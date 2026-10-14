import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Search, Filter, AlertTriangle, ArrowRight, Download, 
  FileText, CheckCircle2, Clock, X, RotateCw, Loader2, Calendar 
} from 'lucide-react';
import { adminAssessmentsApi } from '../../features/admin/services/adminAssessmentsApi';
import { ReviewAssessmentModal } from '../../features/admin/components/ReviewAssessmentModal';

const AdminAssessments = () => {
  // Data & loading state
  const [assessments, setAssessments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Modals & actions
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  // Debounce search (400ms)
  const debounceTimerRef = useRef(null);
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPagination((prev) => ({ ...prev, page: 1 }));
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

  // Fetch assessments
  const fetchAssessments = useCallback(async (pageToFetch = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pageToFetch,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        flagged: flaggedOnly ? true : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };

      const res = await adminAssessmentsApi.getAssessments(params);

      if (res.success) {
        setAssessments(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        throw new Error(res.message || 'Failed to fetch assessments');
      }
    } catch (err) {
      console.error('Error fetching admin assessments:', err);
      setError(err.message || 'Unable to load assessment records. Please check your network or login session.');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, flaggedOnly, dateFrom, dateTo]);

  // Refetch when filters or page change
  useEffect(() => {
    fetchAssessments(pagination.page);
  }, [fetchAssessments, pagination.page]);

  const handleClearFilters = () => {
    setSearchInput('');
    setDebouncedSearch('');
    setStatusFilter('ALL');
    setFlaggedOnly(false);
    setDateFrom('');
    setDateTo('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Boolean(
    (searchInput && searchInput.trim()) ||
    statusFilter !== 'ALL' ||
    flaggedOnly ||
    dateFrom ||
    dateTo
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenReview = (item) => {
    if (item?.id) {
      setSelectedAssessmentId(item.id);
      setIsReviewModalOpen(true);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await adminAssessmentsApi.exportAssessments({
        search: debouncedSearch,
        status: statusFilter,
        flagged: flaggedOnly ? true : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      showToast('Assessment records exported successfully as CSV', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast(err.message || 'Failed to export assessments', 'error');
    } finally {
      setExporting(false);
    }
  };

  // Indicators
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
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-bold">{toastMessage}</span>
          <button 
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            Preliminary Assessments
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1 ml-11">
            Review parent-submitted developmental questionnaires and triage cases.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleExport}
            disabled={exporting || loading || assessments.length === 0}
            className="px-4 py-2 bg-white text-text text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-primary transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-gray-500" />
            )}
            {exporting ? 'Exporting...' : 'Export List'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
          <div className="relative flex-1 md:max-w-md group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by Assessment ID, child or parent..." 
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium" 
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter Views Button */}
            <button 
              type="button"
              onClick={() => setShowFilterDrawer((prev) => !prev)}
              className={`px-4 py-2 border rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm cursor-pointer ${
                showFilterDrawer || (statusFilter !== 'ALL' || dateFrom || dateTo)
                  ? 'bg-blue-50 text-primary border-blue-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-text hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" /> 
              Filter Views
              {(statusFilter !== 'ALL' || dateFrom || dateTo) && (
                <span className="w-2 h-2 rounded-full bg-primary"></span>
              )}
            </button>

            {/* Flagged Only Toggle */}
            <button 
              type="button"
              onClick={() => {
                setFlaggedOnly((prev) => !prev);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm cursor-pointer border ${
                flaggedOnly
                  ? 'border-amber-400 bg-amber-500 text-white shadow-amber-500/20 shadow-md'
                  : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> 
              Flagged Only
            </button>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        {showFilterDrawer && (
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase font-mono">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-lg px-3 py-1.5 outline-none focus:border-primary shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase font-mono">From:</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-primary shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase font-mono">To:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                className="bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-lg px-2.5 py-1.5 outline-none focus:border-primary shadow-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setDateFrom('');
                setDateTo('');
                setStatusFilter('ALL');
              }}
              className="text-xs font-bold text-gray-500 hover:text-text transition-colors px-2 py-1 ml-auto cursor-pointer"
            >
              Clear Filter Drawer
            </button>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold font-mono">
                <th className="px-6 py-4">Assessment ID</th>
                <th className="px-6 py-4">Child Patient</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4 text-center">Completion</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50 font-medium">
              {loading ? (
                /* Skeleton Rows */
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-gray-200 rounded-md"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-28 h-4 bg-gray-200 rounded mb-1.5"></div>
                      <div className="w-20 h-3 bg-gray-100 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-4 bg-gray-100 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="w-28 h-4 bg-gray-100 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-20 h-6 bg-gray-100 rounded-md"></div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="w-16 h-7 bg-gray-100 rounded-lg ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-3">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-text mb-1">Failed to Load Assessments</h4>
                      <p className="text-xs text-gray-500 mb-4">{error}</p>
                      <button
                        type="button"
                        onClick={() => fetchAssessments(pagination.page)}
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : assessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-text mb-1">
                        {hasActiveFilters ? 'No Assessments Match Your Filters' : 'No Preliminary Assessments Found'}
                      </h4>
                      <p className="text-xs text-gray-500 mb-4">
                        {hasActiveFilters
                          ? 'Try adjusting your search keywords, status filter, or flagged filter.'
                          : 'Submitted assessments will appear here automatically when parents complete onboarding questionnaires.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="px-4 py-2 bg-white border border-gray-200 text-text text-xs font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                /* Real Database Assessments */
                assessments.map((item) => {
                  const isFlagged = Boolean(item.flagged);
                  const isReviewed = item.status === 'Reviewed';
                  const isInProgress = item.status === 'In Progress';

                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-colors group ${
                        isFlagged ? 'bg-amber-50/30 hover:bg-amber-50' : 'hover:bg-gray-50/80'
                      }`}
                    >
                      {/* Assessment ID */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          {isFlagged ? (
                            <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="p-1.5 bg-gray-100 text-gray-400 rounded-md">
                              <FileText className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <span 
                            className={`font-mono font-bold text-xs ${
                              isFlagged ? 'text-amber-800' : 'text-gray-500'
                            }`}
                          >
                            {item.assessmentCode || item.id}
                          </span>
                        </div>
                      </td>

                      {/* Child Patient & Parent */}
                      <td className="px-6 py-4 align-middle">
                        <p className="font-bold text-text group-hover:text-primary transition-colors text-sm">
                          {item.child?.name || 'Unnamed Child'}
                        </p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          Parent: {item.parent?.name || 'Unassigned Parent'}
                        </p>
                      </td>

                      {/* Submitted Date */}
                      <td className="px-6 py-4 align-middle">
                        <span className="font-mono text-gray-600 text-xs font-semibold">
                          {item.date || 'Pending'}
                        </span>
                      </td>

                      {/* Completion */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3 justify-center group-hover:scale-105 transition-transform">
                          <span className="font-mono text-xs font-bold text-gray-600 w-8 text-right">
                            {item.completion}%
                          </span>
                          <div className="w-24 h-2 bg-gray-100 border border-gray-200/50 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full ${
                                item.completion === 100 ? 'bg-emerald-500' : 'bg-primary'
                              } rounded-full transition-all duration-300`} 
                              style={{ width: `${item.completion}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 align-middle">
                        <span 
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                            isReviewed 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : isInProgress 
                              ? 'bg-gray-50 text-gray-600 border-gray-200' 
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {isReviewed && <CheckCircle2 className="w-3 h-3" />}
                          {!isReviewed && !isInProgress && <AlertTriangle className="w-3 h-3" />}
                          {isInProgress && <Clock className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right align-middle">
                        <button 
                          type="button"
                          onClick={() => handleOpenReview(item)}
                          className="text-xs font-bold text-primary hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-100 flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 shadow-sm cursor-pointer"
                        >
                          Review <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && assessments.length > 0 && (
          <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Showing <span className="text-text">{fromRecord}</span> to <span className="text-text">{toRecord}</span> of <span className="text-text">{pagination.total.toLocaleString()}</span> assessments
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

      {/* Review Assessment Modal */}
      <ReviewAssessmentModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedAssessmentId(null);
        }}
        assessmentId={selectedAssessmentId}
        onUpdated={(msg) => {
          showToast(msg || 'Assessment updated successfully', 'success');
          fetchAssessments(pagination.page);
        }}
      />

    </div>
  );
};

export default AdminAssessments;
