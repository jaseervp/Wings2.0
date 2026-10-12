import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, Plus, Stethoscope, Filter, Download, Loader2, AlertCircle, 
  CheckCircle2, X, RefreshCw 
} from 'lucide-react';
import { adminTherapistsApi } from '../../features/admin/services/adminTherapistsApi';
import { TherapistCard } from '../../features/admin/components/TherapistCard';
import { AddTherapistModal } from '../../features/admin/components/AddTherapistModal';
import { EditTherapistModal } from '../../features/admin/components/EditTherapistModal';
import { ScheduleModal } from '../../features/admin/components/ScheduleModal';

const AdminTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [schedulingTherapist, setSchedulingTherapist] = useState(null);

  // Notification States
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const notificationTimeoutRef = useRef(null);

  const showNotification = (message, isError = false) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    if (isError) {
      setActionError(message);
      setActionSuccess('');
    } else {
      setActionSuccess(message);
      setActionError('');
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setActionSuccess('');
      setActionError('');
    }, 4000);
  };

  // Debounce search input (400ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Load specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await adminTherapistsApi.getSpecializations();
        if (res.success && Array.isArray(res.data)) {
          setSpecializations(res.data);
        }
      } catch (err) {
        console.error('Failed to load specializations:', err);
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch Therapists
  const fetchTherapists = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        specialization: selectedSpecialization,
      };

      const res = await adminTherapistsApi.getTherapists(params);
      if (res.success) {
        setTherapists(res.data || []);
        if (res.pagination) {
          setPagination(prev => ({
            ...prev,
            page: res.pagination.page,
            limit: res.pagination.limit,
            total: res.pagination.total,
            totalPages: res.pagination.totalPages,
          }));
        }
      } else {
        throw new Error(res.message || 'Failed to load therapists');
      }
    } catch (err) {
      console.error('Error fetching therapists:', err);
      if (!isPolling) {
        setError(err.message || 'Unable to connect to therapist management service');
      }
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, selectedSpecialization]);

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists]);

  // 30-second background polling when page is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchTherapists(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchTherapists]);

  // Handle Specialization change
  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle Export CSV
  const handleExportCsv = async () => {
    try {
      setExporting(true);
      await adminTherapistsApi.exportCsv({
        search: debouncedSearch,
        specialization: selectedSpecialization,
      });
      showNotification('Therapist list exported successfully');
    } catch (err) {
      showNotification(err.message || 'Failed to export CSV', true);
    } finally {
      setExporting(false);
    }
  };

  // Handle Add Therapist Success
  const handleAddSuccess = (newTherapist) => {
    showNotification(`Therapist "${newTherapist.fullName}" added successfully!`);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTherapists();
  };

  // Handle Edit Therapist Success
  const handleEditSuccess = (updatedTherapist) => {
    showNotification(`Profile for "${updatedTherapist.fullName}" updated successfully!`);
    fetchTherapists();
  };

  const startRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endRecord = Math.min(pagination.page * pagination.limit, pagination.total);

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
          <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            Therapist Management
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1 ml-11">
            Manage clinical staff, review availability, and monitor patient assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCsv}
            disabled={exporting || therapists.length === 0}
            className="px-4 py-2 bg-white text-text text-sm font-bold rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            ) : (
              <Download className="w-4 h-4 text-gray-500" />
            )}
            <span>Export List</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Therapist
          </button>
        </div>
      </div>

      {/* Toolbar Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-4 justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div className="relative flex-1 md:max-w-md w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search therapists by name or specialty..." 
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" 
          />
          {searchInput && (
            <button 
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select 
              value={selectedSpecialization}
              onChange={handleSpecializationChange}
              className="w-full md:w-56 bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="All Specializations">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Filter className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Cards / State Handling */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3 pt-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <div className="h-9 bg-gray-200 rounded-xl flex-1"></div>
                <div className="h-9 bg-gray-200 rounded-xl flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-200 p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-text mb-1">Failed to Load Therapists</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-5">{error}</p>
          <button 
            onClick={() => fetchTherapists()}
            className="px-5 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : therapists.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text">
              {debouncedSearch || selectedSpecialization !== 'All Specializations'
                ? 'No therapists match your filters'
                : 'No therapists found'}
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mt-1">
              {debouncedSearch || selectedSpecialization !== 'All Specializations'
                ? 'Try adjusting your search terms or clearing the specialization filter.'
                : 'Clinical staff will appear here when therapist accounts are created.'}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            {(debouncedSearch || selectedSpecialization !== 'All Specializations') && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setDebouncedSearch('');
                  setSelectedSpecialization('All Specializations');
                  setPagination(p => ({ ...p, page: 1 }));
                }}
                className="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary/90 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Therapist
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {therapists.map((doc) => (
              <TherapistCard
                key={doc.id || doc._id}
                therapist={doc}
                onEdit={(t) => setEditingTherapist(t)}
                onSchedule={(t) => setSchedulingTherapist(t)}
              />
            ))}
          </div>

          {/* Pagination Footer */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-mono">
              SHOWING {startRecord} TO {endRecord} OF {pagination.total} THERAPISTS
            </span>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1 || loading}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => {
                  if (pagination.totalPages <= 5) return true;
                  if (p === 1 || p === pagination.totalPages) return true;
                  return Math.abs(p - pagination.page) <= 1;
                })
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
        </>
      )}

      {/* ----------------- MODALS ----------------- */}
      <AddTherapistModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        specializations={specializations}
      />

      <EditTherapistModal
        isOpen={!!editingTherapist}
        onClose={() => setEditingTherapist(null)}
        onSuccess={handleEditSuccess}
        therapist={editingTherapist}
        specializations={specializations}
      />

      <ScheduleModal
        isOpen={!!schedulingTherapist}
        onClose={() => setSchedulingTherapist(null)}
        therapist={schedulingTherapist}
      />

    </div>
  );
};

export default AdminTherapists;
