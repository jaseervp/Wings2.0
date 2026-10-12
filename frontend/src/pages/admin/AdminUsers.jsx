import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, Filter, Download, Plus, MoreVertical, Eye, Edit2, Trash2, 
  Mail, Shield, Loader2, AlertCircle, CheckCircle2, X, RefreshCw,
  Phone, Calendar, UserCheck, Check, ChevronDown
} from 'lucide-react';
import { adminUsersApi } from '../../features/admin/services/adminUsersApi';
import { AddUserModal } from '../../features/admin/components/AddUserModal';

const STATUS_CONFIG = {
  ACTIVE: { bg: 'bg-emerald-500', label: 'ACTIVE' },
  PENDING_VERIFICATION: { bg: 'bg-amber-500', label: 'PENDING VERIFICATION' },
  INACTIVE: { bg: 'bg-gray-400', label: 'INACTIVE' },
  SUSPENDED: { bg: 'bg-orange-500', label: 'SUSPENDED' },
  BANNED: { bg: 'bg-red-500', label: 'BANNED' },
};

const PLAN_CONFIG = {
  PREMIUM: { badge: 'bg-purple-50 text-purple-700 border-purple-200', icon: true, label: 'PREMIUM' },
  PRO: { badge: 'bg-blue-50 text-blue-700 border-blue-200', icon: false, label: 'PRO' },
  FREE: { badge: 'bg-gray-50 text-gray-600 border-gray-200', icon: false, label: 'FREE' },
};

const AdminUsers = () => {
  const [activeTab, setActiveTab] = useState('All Users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  
  // Search & Filter state
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Row selection
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  // Export state
  const [exporting, setExporting] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Action status message / notification
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');



  // Edit User Form State
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    role: 'PARENT',
    status: 'ACTIVE',
    plan: 'FREE',
    emailVerified: true,
  });
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Debounce search input (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleFromTab = (tab) => {
    switch (tab) {
      case 'Parents': return 'PARENT';
      case 'Therapists': return 'THERAPIST';
      case 'Admins': return 'ADMIN';
      default: return 'ALL';
    }
  };

  const fetchUsers = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      setError(null);

      const role = getRoleFromTab(activeTab);
      const res = await adminUsersApi.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        role,
        status: statusFilter,
        plan: planFilter,
        search: debouncedSearch,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
      if (!isPolling) {
        setError(err.message || 'Failed to fetch users from server.');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [activeTab, pagination.page, pagination.limit, statusFilter, planFilter, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Periodic polling every 30s when tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchUsers(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const showNotification = (msg, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(''), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // Handle Tab Switch
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
    setSelectedUserIds(new Set());
  };

  // Handle Export CSV
  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const role = getRoleFromTab(activeTab);
      await adminUsersApi.exportCsv({
        role,
        status: statusFilter,
        plan: planFilter,
        search: debouncedSearch,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      showNotification('CSV exported successfully');
    } catch (err) {
      console.error('CSV Export failed:', err);
      showNotification(err.message || 'Failed to export CSV', true);
    } finally {
      setExporting(false);
    }
  };

  // Handle Select All Checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(users.map(u => u._id || u.id));
      setSelectedUserIds(allIds);
    } else {
      setSelectedUserIds(new Set());
    }
  };

  // Handle Individual Checkbox
  const handleSelectOne = (id) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Open Edit User Modal
  const handleOpenEdit = (user) => {
    setEditUser(user);
    setEditForm({
      fullName: user.fullName || '',
      phone: user.phone || '',
      role: user.role || 'PARENT',
      status: user.status || 'ACTIVE',
      plan: user.plan || 'FREE',
      emailVerified: user.emailVerified ?? true,
    });
  };

  // Handle User Created Successfully from AddUserModal
  const handleAddUserSuccess = (newUser) => {
    const roleNameMap = {
      PARENT: 'Parents',
      THERAPIST: 'Therapists',
      ADMIN: 'Admins',
    };
    const targetTab = roleNameMap[newUser.role] || 'All Users';

    if (activeTab === 'All Users' || activeTab === targetTab) {
      showNotification(`User "${newUser.fullName}" created successfully!`);
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchUsers();
    } else {
      showNotification(`User "${newUser.fullName}" created successfully in ${targetTab}!`);
      handleTabChange(targetTab);
    }
  };

  // Submit Edit User
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      setSubmittingEdit(true);
      const userId = editUser._id || editUser.id;
      const res = await adminUsersApi.updateUser(userId, editForm);
      if (res.success) {
        showNotification('User updated successfully');
        setEditUser(null);
        fetchUsers();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to update user', true);
    } finally {
      setSubmittingEdit(false);
    }
  };

  // Submit Delete User
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const targetId = deleteTarget._id || deleteTarget.id;
      const res = await adminUsersApi.deleteUser(targetId);
      if (res.success) {
        showNotification('User deleted successfully');
        setDeleteTarget(null);
        fetchUsers();
      }
    } catch (err) {
      showNotification(err.message || 'Failed to delete user', true);
    }
  };

  // Format Join Date
  const formatJoinedDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const isAllSelected = users.length > 0 && users.every(u => selectedUserIds.has(u._id || u.id));
  const activeFilterCount = (statusFilter !== 'ALL' ? 1 : 0) + (planFilter !== 'ALL' ? 1 : 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toast Notifications */}
      {actionSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{actionError}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight">User Management</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage parents, therapists, and administrative accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCsv}
            disabled={exporting || users.length === 0}
            className="px-4 py-2 bg-white text-text text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" /> : <Download className="w-4 h-4 text-gray-500" />}
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200/60 p-1 rounded-xl shadow-inner overflow-x-auto max-w-full">
            {['All Users', 'Parents', 'Therapists', 'Admins'].map(tab => (
              <button 
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
                  activeTab === tab 
                    ? 'bg-white text-text shadow-sm border border-gray-200/50' 
                    : 'text-gray-500 hover:text-text hover:bg-gray-200/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto relative" ref={filterRef}>
            <div className="relative flex-1 md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or email..." 
                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" 
              />
              {searchInput && (
                <button 
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 border rounded-xl transition-colors shadow-sm relative ${
                isFilterOpen || activeFilterCount > 0 
                  ? 'bg-primary/10 border-primary/30 text-primary' 
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-text'
              }`}
              title="Filter records"
            >
              <Filter className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Popover Panel */}
            {isFilterOpen && (
              <div className="absolute right-0 top-12 z-30 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h4 className="font-bold text-sm text-text">Filter Users</h4>
                  {(statusFilter !== 'ALL' || planFilter !== 'ALL') && (
                    <button 
                      onClick={() => { setStatusFilter('ALL'); setPlanFilter('ALL'); setPagination(p => ({ ...p, page: 1 })); }}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Account Status Filter */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Account State</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-text outline-none focus:border-primary"
                  >
                    <option value="ALL">All States</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_VERIFICATION">Pending Verification</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="BANNED">Banned</option>
                  </select>
                </div>

                {/* Plan Status Filter */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Plan Status</label>
                  <select 
                    value={planFilter}
                    onChange={(e) => { setPlanFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-text outline-none focus:border-primary"
                  >
                    <option value="ALL">All Plans</option>
                    <option value="FREE">Free</option>
                    <option value="PRO">Pro</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[300px] relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
              <p className="text-xs font-bold text-gray-500">Loading user records...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-text mb-1">Failed to Load Users</h4>
              <p className="text-sm text-gray-500 max-w-sm mb-4">{error}</p>
              <button 
                onClick={() => fetchUsers()} 
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}

          {!loading && !error && users.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mb-3 border border-gray-100">
                <Mail className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-base text-text mb-1">No users found</h4>
              <p className="text-sm text-gray-500 max-w-sm mb-5">
                {searchInput || statusFilter !== 'ALL' || planFilter !== 'ALL'
                  ? 'No accounts matched your search or filters. Try adjusting your query.'
                  : 'Users will appear here when accounts are created.'}
              </p>
              {searchInput || statusFilter !== 'ALL' || planFilter !== 'ALL' ? (
                <button 
                  onClick={() => { setSearchInput(''); setStatusFilter('ALL'); setPlanFilter('ALL'); }}
                  className="px-4 py-2 bg-primary/10 text-primary font-bold text-xs rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  Clear Filters
                </button>
              ) : (
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add First User
                </button>
              )}
            </div>
          )}

          {!error && users.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                  <th className="px-6 py-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                    />
                  </th>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4 text-center">Children</th>
                  <th className="px-6 py-4">Plan Status</th>
                  <th className="px-6 py-4">Account State</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50 font-medium">
                {users.map((user) => {
                  const userId = user._id || user.id;
                  const isChecked = selectedUserIds.has(userId);
                  const statusConf = STATUS_CONFIG[user.status] || { bg: 'bg-gray-400', label: user.status || 'UNKNOWN' };
                  const planConf = PLAN_CONFIG[user.plan] || PLAN_CONFIG.FREE;
                  const avatarInitial = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

                  return (
                    <tr key={userId} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 w-12 text-center align-middle">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => handleSelectOne(userId)}
                          className={`rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer transition-opacity ${
                            isChecked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200 text-gray-600 font-bold flex items-center justify-center shrink-0 shadow-sm text-sm">
                            {avatarInitial}
                          </div>
                          <div>
                            <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">
                              {user.fullName}
                            </p>
                            <p className="text-gray-500 font-mono text-[11px] tracking-tight flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center align-middle">
                        {user.role === 'PARENT' ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 text-gray-600 font-mono font-bold text-xs border border-gray-200">
                            {user.childrenCount ?? 0}
                          </span>
                        ) : (
                          <span className="text-gray-400 font-bold text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${planConf.badge}`}>
                          {planConf.icon && <Shield className="w-3 h-3" />}
                          {planConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full shadow-sm ${statusConf.bg}`}></span>
                           <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{statusConf.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs font-semibold align-middle font-mono">
                        {formatJoinedDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setViewUser(user)}
                            title="View user details"
                            className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenEdit(user)}
                            title="Edit user"
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteTarget(user)}
                            title="Delete user"
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Controls */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
           <div className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
             {pagination.total > 0 ? (
               <>
                 Showing <span className="text-text font-black">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="text-text font-black">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-text font-black">{pagination.total.toLocaleString()}</span> users
               </>
             ) : (
               'No records'
             )}
           </div>

           <div className="flex items-center gap-1">
             <button 
               onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
               disabled={pagination.page <= 1 || loading}
               className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
             >
               Prev
             </button>
             
             {/* Page numbers */}
             {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
               .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
               .map((p, idx, arr) => {
                 const prevPage = arr[idx - 1];
                 const isGap = prevPage && p - prevPage > 1;

                 return (
                   <React.Fragment key={p}>
                     {isGap && <span className="px-2 text-gray-400 text-xs">...</span>}
                     <button
                       onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                       disabled={loading}
                       className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                         pagination.page === p
                           ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20'
                           : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-text'
                       }`}
                     >
                       {p}
                     </button>
                   </React.Fragment>
                 );
               })}

             <button 
               onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
               disabled={pagination.page >= pagination.totalPages || loading}
               className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
             >
               Next
             </button>
           </div>
        </div>

      </div>

      {/* -------------------- MODALS -------------------- */}

      {/* 1. Add User Modal */}
      <AddUserModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddUserSuccess}
        currentTab={activeTab}
        onSwitchTab={handleTabChange}
      />

      {/* 2. Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-heading font-black text-text">Edit User Profile</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{editUser.email}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text block mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-text block mb-1">Role</label>
                  <select 
                    value={editForm.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary"
                  >
                    <option value="PARENT">Parent</option>
                    <option value="THERAPIST">Therapist</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-text block mb-1">Account State</label>
                  <select 
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING_VERIFICATION">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                    <option value="BANNED">Banned</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-text block mb-1">Plan</label>
                  <select 
                    value={editForm.plan}
                    onChange={(e) => setEditForm(prev => ({ ...prev, plan: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text outline-none focus:border-primary"
                  >
                    <option value="FREE">Free</option>
                    <option value="PRO">Pro</option>
                    <option value="PREMIUM">Premium</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editForm.emailVerified}
                    onChange={(e) => setEditForm(prev => ({ ...prev, emailVerified: e.target.checked }))}
                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-gray-700">Email Address Verified</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setEditUser(null)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submittingEdit}
                  className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                >
                  {submittingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{submittingEdit ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. View User Details Modal */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200 text-gray-700 font-black flex items-center justify-center text-lg">
                  {viewUser.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-heading font-black text-text">{viewUser.fullName}</h3>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {viewUser.role}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase">Email</span>
                <span className="font-mono font-medium text-text text-xs">{viewUser.email}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase">Phone</span>
                <span className="font-medium text-text text-xs">{viewUser.phone || '—'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase">Account State</span>
                <span className="text-xs font-bold uppercase">{viewUser.status}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase">Plan Status</span>
                <span className="text-xs font-bold uppercase">{viewUser.plan || 'FREE'}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase">Children Profiles</span>
                <span className="font-bold text-text text-xs">
                  {viewUser.role === 'PARENT' ? (viewUser.childrenCount ?? 0) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase">Joined Date</span>
                <span className="font-medium text-text text-xs font-mono">{formatJoinedDate(viewUser.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-xs font-bold text-gray-500 uppercase">Email Verified</span>
                <span className={`text-xs font-bold ${viewUser.emailVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {viewUser.emailVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
              <button 
                onClick={() => { const u = viewUser; setViewUser(null); handleOpenEdit(u); }}
                className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-sm hover:bg-primary/90 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit User
              </button>
              <button 
                onClick={() => setViewUser(null)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-heading font-black text-text mb-2">Delete User Account?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-text">{deleteTarget.fullName}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-red-700 transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
