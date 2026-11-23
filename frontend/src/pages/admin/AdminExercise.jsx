import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  PlayCircle,
  Edit2,
  Trash2,
  Calendar,
  Activity,
  Upload,
  Filter,
  Loader2,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import { adminExerciseApi } from '../../features/admin/services/adminExerciseApi';
import ExerciseFormModal from '../../features/admin/components/ExerciseFormModal';
import ExerciseAssignmentModal from '../../features/admin/components/ExerciseAssignmentModal';
import CreateProgramTemplateModal from '../../features/admin/components/CreateProgramTemplateModal';
import ViewProgramTemplatesModal from '../../features/admin/components/ViewProgramTemplatesModal';
import VideoPlayerModal from '../../features/admin/components/VideoPlayerModal';

const AdminExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningExerciseId, setAssigningExerciseId] = useState(null);

  // Program Templates Modals
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [isViewTemplatesOpen, setIsViewTemplatesOpen] = useState(false);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedPlayback, setSelectedPlayback] = useState({
    title: '',
    playbackUrl: '',
    fallbackUrls: [],
    thumbnailUrl: '',
    instructions: [],
    loading: false,
    error: null,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch exercises and categories in parallel
      const [exRes, catRes] = await Promise.all([
        adminExerciseApi.getExercises({
          search: searchTerm,
          category: selectedCategory,
        }),
        adminExerciseApi.getCategories(),
      ]);

      let items = exRes.data?.items || exRes.data || [];
      const cats = catRes.data || [];
      setCategories(cats);

      // If library is completely empty on fresh install, auto-seed default clinical library
      if (items.length === 0 && !searchTerm && selectedCategory === 'All Categories') {
        const seedRes = await adminExerciseApi.seedDefaults();
        if (seedRes.seeded) {
          const reloadRes = await adminExerciseApi.getExercises({});
          items = reloadRes.data?.items || reloadRes.data || [];
        }
      }

      setExercises(items);
    } catch (err) {
      console.error('Failed to load exercises:', err);
      setError(err.message || 'Failed to load exercise library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (ex) => {
    setEditingExercise(ex);
    setIsFormModalOpen(true);
  };

  const handleOpenAssign = (exId = null) => {
    setAssigningExerciseId(exId);
    setIsAssignModalOpen(true);
  };

  const handleArchive = async (id, title) => {
    if (!window.confirm(`Are you sure you want to archive "${title}"?`)) return;
    try {
      await adminExerciseApi.archiveExercise(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to archive exercise');
    }
  };

  const handlePlayVideo = async (ex) => {
    setSelectedPlayback({
      title: ex.title,
      playbackUrl: '',
      fallbackUrls: [],
      thumbnailUrl: ex.media?.thumbnailUrl || '',
      instructions: ex.instructions || [],
      loading: true,
      error: null,
    });
    setIsVideoModalOpen(true);

    try {
      const res = await adminExerciseApi.getPlaybackUrl(ex._id);
      setSelectedPlayback((prev) => ({
        ...prev,
        playbackUrl: res.data?.playbackUrl || '',
        fallbackUrls: res.data?.fallbackUrls || [],
        thumbnailUrl: res.data?.thumbnailUrl || prev.thumbnailUrl,
        instructions: ex.instructions || [],
        loading: false,
      }));
    } catch (err) {
      setSelectedPlayback((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Unable to retrieve playback stream.',
      }));
    }
  };

  const formatDuration = (mins, seconds) => {
    if (seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(mins || 5).padStart(2, '0')}:00`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-admin-heading font-black text-text tracking-tight flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-6 h-6" />
            </div>
            Exercise & Therapy Programs
          </h2>
          <p className="text-gray-500 font-medium text-sm mt-1 ml-11">
            Manage video content library, structured routines, and home programs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Video
          </button>
        </div>
      </div>

      {/* Structured Programs Notice */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-transparent to-blue-50/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

        <div className="flex gap-5 items-start">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm mt-1 text-blue-600 group-hover:scale-105 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-admin-heading font-black text-text text-lg tracking-tight">
              Structured Exercise Programs
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl font-medium leading-relaxed">
              Create sequential 7-day or 30-day exercise routines by grouping videos from the library.
              You can assign these programs to specific child profiles based on age and developmental level.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsViewTemplatesOpen(true)}
            className="whitespace-nowrap px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl hover:text-primary hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center gap-2 text-sm shadow-sm cursor-pointer"
          >
            <Layers className="w-4 h-4 text-blue-600" /> View Programs
          </button>
          <button
            onClick={() => setIsCreateTemplateOpen(true)}
            className="whitespace-nowrap px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            Create Program <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Video Library */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
          <h3 className="font-admin-heading font-bold text-text text-lg">Video Library</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search videos by title or category..."
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-sm transition-all text-text placeholder:text-gray-400 font-medium"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-48 bg-white border border-gray-200 text-sm rounded-xl pl-4 pr-10 py-2.5 outline-none font-bold text-gray-600 focus:border-primary shadow-sm appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="All Categories">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <Filter className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="p-6 bg-gray-50/30 min-h-[300px]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading exercise library...</p>
            </div>
          ) : error ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-rose-500" />
              <p className="text-base font-bold text-gray-800">Error loading library</p>
              <p className="text-xs text-gray-500">{error}</p>
              <button
                onClick={loadData}
                className="mt-2 px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : exercises.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                <Activity className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-700">No exercises found</h4>
              <p className="text-xs text-gray-400 max-w-sm">
                No video exercises match your current search or category filter.
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Exercise Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {exercises.map((video) => {
                const durationStr = formatDuration(video.durationMinutes, video.media?.durationSeconds);
                const thumbUrl = video.media?.thumbnailUrl;
                const status = video.media?.status || 'READY';

                return (
                  <div
                    key={video._id}
                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => handlePlayVideo(video)}
                      className="h-40 bg-gray-900 relative flex items-center justify-center overflow-hidden cursor-pointer"
                    >
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-700 to-primary flex items-center justify-center" />
                      )}

                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />

                      <PlayCircle className="w-12 h-12 text-white/90 group-hover:scale-110 group-hover:text-white transition-all drop-shadow-lg z-20" />

                      {/* Video Status Badge if processing */}
                      {status === 'PROCESSING' && (
                        <span className="absolute top-3 left-3 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-20 flex items-center gap-1 shadow-sm backdrop-blur-sm">
                          <Loader2 className="w-3 h-3 animate-spin" /> Processing
                        </span>
                      )}
                      {status === 'FAILED' && (
                        <span className="absolute top-3 left-3 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md z-20 flex items-center gap-1 shadow-sm backdrop-blur-sm">
                          Upload Failed
                        </span>
                      )}

                      <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-mono font-bold px-2 py-1 rounded-md z-20 border border-white/10 shadow-sm">
                        {durationStr}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="font-admin-heading font-black text-text line-clamp-2 leading-tight group-hover:text-primary transition-colors text-base mb-1.5">
                        {video.title}
                      </h4>
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        {video.category}
                      </p>

                      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 justify-between text-xs font-bold text-gray-500 font-mono">
                        <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                          {video.minAge} - {video.maxAge} Years
                        </span>
                        <span>{video.difficulty}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-3 bg-gray-50/80 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => handleOpenAssign(video._id)}
                        className="py-1.5 px-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                        title="Assign to Child"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Assign
                      </button>
                      <button
                        onClick={() => handleOpenEdit(video)}
                        className="flex-1 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-primary hover:border-blue-200 hover:bg-blue-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleArchive(video._id, video.title)}
                        className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-all flex items-center justify-center shadow-sm cursor-pointer"
                        title="Archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ExerciseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        exercise={editingExercise}
        categories={categories}
        onSuccess={loadData}
      />

      <ExerciseAssignmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        preselectedExerciseId={assigningExerciseId}
        onSuccess={loadData}
      />

      <CreateProgramTemplateModal
        isOpen={isCreateTemplateOpen}
        onClose={() => setIsCreateTemplateOpen(false)}
        categories={categories}
        exercises={exercises}
        onSuccess={loadData}
      />

      <ViewProgramTemplatesModal
        isOpen={isViewTemplatesOpen}
        onClose={() => setIsViewTemplatesOpen(false)}
        onCreateNew={() => setIsCreateTemplateOpen(true)}
      />

      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={selectedPlayback.title}
        playbackUrl={selectedPlayback.playbackUrl}
        fallbackUrls={selectedPlayback.fallbackUrls}
        thumbnailUrl={selectedPlayback.thumbnailUrl}
        instructions={selectedPlayback.instructions}
        loading={selectedPlayback.loading}
        error={selectedPlayback.error}
      />
    </div>
  );
};

export default AdminExercise;
