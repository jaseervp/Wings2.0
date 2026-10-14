import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Filter, LayoutGrid, List, Plus, Download, Brain, 
  RotateCw, CheckCircle2, AlertCircle, X, Baby, Loader2 
} from 'lucide-react';
import { adminChildrenApi } from '../../features/admin/services/adminChildrenApi';
import { ChildProfileCard } from '../../features/admin/components/ChildProfileCard';
import { ChildListView } from '../../features/admin/components/ChildListView';
import { AddChildModal } from '../../features/admin/components/AddChildModal';
import { ChildDetailsModal } from '../../features/admin/components/ChildDetailsModal';

const AdminChildren = () => {
  // View mode
  const [view, setView] = useState('grid');

  // Data & loading state
  const [children, setChildren] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [ageRange, setAgeRange] = useState('All');
  const [gender, setGender] = useState('All');
  const [iqBand, setIqBand] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Action feedback (toasts)
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [exporting, setExporting] = useState(false);

  // Debounce search input (400ms)
  const debounceTimerRef = useRef(null);
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 400);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message, type = 'success') => {
    setToastType(type);
    setToastMessage(message);
  };

  // Fetch children list
  const fetchChildren = useCallback(async (pageToFetch = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageToFetch,
        limit: 12,
        search: debouncedSearch,
        ageRange,
        gender,
        iqBand,
      };

      const res = await adminChildrenApi.getChildren(params);

      if (res.success) {
        setChildren(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        throw new Error(res.message || 'Failed to fetch children profiles');
      }
    } catch (err) {
      console.error('Error fetching admin children:', err);
      setError(err.message || 'Unable to connect to children repository. Please verify your connection or login status.');
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, ageRange, gender, iqBand]);

  // Fetch when filters or page changes
  useEffect(() => {
    fetchChildren(pagination.page);
  }, [fetchChildren, pagination.page]);

  // Filter change handlers (reset page to 1)
  const handleAgeRangeChange = (e) => {
    setAgeRange(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleIqBandChange = (e) => {
    setIqBand(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setAgeRange('All');
    setGender('All');
    setIqBand('All');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Boolean(
    (searchInput && searchInput.trim()) ||
    ageRange !== 'All' ||
    gender !== 'All' ||
    iqBand !== 'All'
  );

  // Pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // View full profile modal
  const handleViewDetails = (child) => {
    if (child?._id || child?.id) {
      setSelectedChildId(child._id || child.id);
      setIsDetailsModalOpen(true);
    }
  };

  // Export CSV handler
  const handleExport = async () => {
    try {
      setExporting(true);
      await adminChildrenApi.exportChildren({
        search: debouncedSearch,
        ageRange,
        gender,
        iqBand,
      });
      showToast('Children dataset exported successfully as CSV', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast(err.message || 'Failed to export children data', 'error');
    } finally {
      setExporting(false);
    }
  };

  // Calculate slice indicators
  const fromRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const toRecord = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`fixed top-6 right-6 z-50 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            toastType === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-bold">{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight">Children Profiles</h2>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage and monitor developmental profiles and clinical histories.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleExport}
            disabled={exporting || loading || children.length === 0}
            className="px-4 py-2 bg-white text-text text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-gray-500" />
            )}
            {exporting ? 'Exporting...' : 'Export Data'}
          </button>
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Child
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        
        {/* Filters Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-gray-50/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Age Range Filter */}
            <div className="relative">
              <select 
                value={ageRange}
                onChange={handleAgeRangeChange}
                className="bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="All">Age Range: All</option>
                <option value="0 - 2 Years">0 - 2 Years</option>
                <option value="3 - 4 Years">3 - 4 Years</option>
                <option value="5 - 6 Years">5 - 6 Years</option>
                <option value="7 - 12 Years">7 - 12 Years</option>
                <option value="13+ Years">13+ Years</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Filter className="w-4 h-4" />
              </div>
            </div>
            
            {/* Gender Filter */}
            <div className="relative">
              <select 
                value={gender}
                onChange={handleGenderChange}
                className="bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="All">Gender: All</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Filter className="w-4 h-4" />
              </div>
            </div>

            {/* IQ Band Filter */}
            <div className="relative">
              <select 
                value={iqBand}
                onChange={handleIqBandChange}
                className="bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="All">IQ Band: All</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Profound">Profound</option>
                <option value="Pending">Pending / Not Assessed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Brain className="w-4 h-4" />
              </div>
            </div>

            {/* Clear Filters Button if any filter active */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-primary hover:text-blue-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-100 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}
          </div>

          {/* Search & View Toggle */}
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search children or parents..." 
                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" 
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-gray-100/80 border border-gray-200/60 p-1 rounded-xl shadow-inner shrink-0">
              <button 
                type="button"
                onClick={() => setView('grid')} 
                title="Grid View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  view === 'grid' 
                    ? 'bg-white text-primary shadow-sm border border-gray-200/50' 
                    : 'text-gray-500 hover:text-text hover:bg-gray-200/50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => setView('list')} 
                title="List View"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  view === 'list' 
                    ? 'bg-white text-primary shadow-sm border border-gray-200/50' 
                    : 'text-gray-500 hover:text-text hover:bg-gray-200/50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Body: Loading, Error, Empty, or Data Views */}
        {loading ? (
          /* Skeleton Loader */
          <div className="p-6 bg-gray-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col space-y-4 animate-pulse">
                  <div className="flex gap-4 items-center mb-2">
                    <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 bg-gray-100 rounded-xl mt-4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-text mb-1">Failed to Load Children Profiles</h3>
            <p className="text-sm text-gray-500 max-w-md mb-6">{error}</p>
            <button
              type="button"
              onClick={() => fetchChildren(pagination.page)}
              className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : children.length === 0 ? (
          /* Empty State */
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-4">
              <Baby className="w-8 h-8" />
            </div>
            {hasActiveFilters ? (
              <>
                <h3 className="text-lg font-bold text-text mb-1">No Children Match Your Filters</h3>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                  No registered children correspond to the selected age, gender, IQ band, or search keywords.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-white text-text border border-gray-200 text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-text mb-1">No Children Profiles Registered</h3>
                <p className="text-sm text-gray-500 max-w-md mb-6">
                  Child profiles will appear here automatically when parents complete onboarding or when an administrator creates a child profile.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add First Child
                </button>
              </>
            )}
          </div>
        ) : (
          /* Real Data Views */
          <>
            {view === 'grid' ? (
              <div className="p-6 bg-gray-50/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {children.map((child) => (
                    <ChildProfileCard 
                      key={child.id || child._id} 
                      child={child} 
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <ChildListView 
                children={children} 
                onViewDetails={handleViewDetails}
              />
            )}
          </>
        )}

        {/* Server-Side Pagination Bar */}
        {!loading && children.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Showing <span className="text-text">{fromRecord}</span> to <span className="text-text">{toRecord}</span> of <span className="text-text">{pagination.total.toLocaleString()}</span> children
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Prev
              </button>

              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                // Only render pages close to current page
                if (
                  pageNum === 1 || 
                  pageNum === pagination.totalPages || 
                  (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        pagination.page === pageNum
                          ? 'border border-primary bg-primary text-white shadow-sm shadow-primary/20'
                          : 'border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-text'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  (pageNum === pagination.page - 2 && pageNum > 1) || 
                  (pageNum === pagination.page + 2 && pageNum < pagination.totalPages)
                ) {
                  return <span key={pageNum} className="px-1 text-gray-400 text-xs">...</span>;
                }
                return null;
              })}

              <button 
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-text transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add Child Modal */}
      <AddChildModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(createdChild) => {
          setIsAddModalOpen(false);
          showToast(`Child "${createdChild?.firstName || 'Profile'}" created and linked to parent successfully`, 'success');
          fetchChildren(1);
        }}
      />

      {/* Complete Child Profile Modal */}
      <ChildDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedChildId(null);
        }}
        childId={selectedChildId}
      />

    </div>
  );
};

export default AdminChildren;
