import { useState, useEffect } from 'react';
import {
  Flame,
  Play,
  CheckCircle2,
  Circle,
  Activity,
  Target,
  Award,
  Bot,
  Clock,
  MessageSquare,
  History,
  ChevronRight,
  BrainCircuit,
  Loader2,
  AlertCircle,
  Baby,
  ChevronDown,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { childrenApi } from '../../features/onboarding/services/onboardingApi';
import { exerciseApi } from '../../features/exercise/services/exerciseApi';
import VideoPlayerModal from '../../features/admin/components/VideoPlayerModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

const Exercise = () => {
  // Child state
  const [children, setChildren] = useState([]);
  const [activeChild, setActiveChild] = useState(null);
  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);

  // Exercise data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [progress, setProgress] = useState({
    completedCount: 0,
    totalAssigned: 0,
    dailyTarget: 4,
    progressPercent: 0,
    streakDays: 0,
  });

  const [skillData, setSkillData] = useState([]);
  const [coachAdvice, setCoachAdvice] = useState('');
  const [therapistFeedback, setTherapistFeedback] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);

  // Video playback modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoPlayback, setVideoPlayback] = useState({
    title: '',
    playbackUrl: '',
    thumbnailUrl: '',
    loading: false,
    error: null,
  });

  // 1. Load Children
  useEffect(() => {
    let isMounted = true;
    const fetchChildren = async () => {
      try {
        const res = await childrenApi.getMyChildren();
        if (isMounted && res.success && res.data && res.data.length > 0) {
          setChildren(res.data);
          const savedId = localStorage.getItem('wings_active_child_id');
          const matched = res.data.find((c) => c._id === savedId) || res.data[0];
          setActiveChild(matched);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load children in Exercise:', err);
        if (isMounted) {
          setError('Failed to load child profile.');
          setLoading(false);
        }
      }
    };

    fetchChildren();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Load Exercise Hub data whenever active child changes
  const loadChildExerciseData = async (childId) => {
    if (!childId) return;

    try {
      setLoading(true);
      setError(null);

      const [
        todayRes,
        skillsRes,
        coachRes,
        feedbackRes,
        milestonesRes,
        historyRes,
      ] = await Promise.all([
        exerciseApi.getTodayActivities(childId),
        exerciseApi.getSkillFocus(childId).catch(() => ({ data: [] })),
        exerciseApi.getActivityCoach(childId).catch(() => ({ data: {} })),
        exerciseApi.getTherapistFeedback(childId).catch(() => ({ data: null })),
        exerciseApi.getMilestones(childId).catch(() => ({ data: [] })),
        exerciseApi.getRecentHistory(childId).catch(() => ({ data: [] })),
      ]);

      if (todayRes.success && todayRes.data) {
        setActivities(todayRes.data.activities || []);
        setProgress(todayRes.data.progress || {
          completedCount: 0,
          totalAssigned: 0,
          dailyTarget: 4,
          progressPercent: 0,
          streakDays: 0,
        });
      }

      setSkillData(skillsRes.data || []);
      setCoachAdvice(coachRes.data?.message || '');
      setTherapistFeedback(feedbackRes.data || null);
      setMilestones(milestonesRes.data || []);
      setRecentHistory(historyRes.data || []);
    } catch (err) {
      console.error('Failed to load exercise dashboard:', err);
      setError(err.message || 'Failed to load activities for today.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeChild?._id) {
      localStorage.setItem('wings_active_child_id', activeChild._id);
      loadChildExerciseData(activeChild._id);
    }
  }, [activeChild?._id]);

  const handleSelectChild = (child) => {
    setActiveChild(child);
    setIsChildDropdownOpen(false);
  };

  // Toggle activity completion
  const handleToggleActivity = async (activity) => {
    if (!activeChild?._id || !activity.planId) return;

    const willBeCompleted = !activity.completed;

    // Optimistic UI update
    setActivities((prev) =>
      prev.map((a) => (a.planId === activity.planId ? { ...a, completed: willBeCompleted } : a)),
    );

    const newCompletedCount = willBeCompleted
      ? progress.completedCount + 1
      : Math.max(0, progress.completedCount - 1);
    const newProgressPercent = Math.min(
      100,
      Math.round((newCompletedCount / (progress.dailyTarget || 4)) * 100),
    );

    setProgress((prev) => ({
      ...prev,
      completedCount: newCompletedCount,
      progressPercent: newProgressPercent,
    }));

    try {
      await exerciseApi.completeActivity(activity.planId, {
        childId: activeChild._id,
        durationCompleted: activity.durationMinutes || 5,
        revert: !willBeCompleted,
      });

      // Refresh streaks and milestones
      const [todayRes, milestonesRes, historyRes] = await Promise.all([
        exerciseApi.getTodayActivities(activeChild._id),
        exerciseApi.getMilestones(activeChild._id),
        exerciseApi.getRecentHistory(activeChild._id),
      ]);

      if (todayRes.success && todayRes.data?.progress) {
        setProgress(todayRes.data.progress);
      }
      setMilestones(milestonesRes.data || []);
      setRecentHistory(historyRes.data || []);
    } catch (err) {
      console.error('Failed to toggle activity completion:', err);
      // Revert optimistic update
      setActivities((prev) =>
        prev.map((a) => (a.planId === activity.planId ? { ...a, completed: !willBeCompleted } : a)),
      );
      loadChildExerciseData(activeChild._id);
    }
  };

  // Play video handler
  const handlePlayVideo = async (activity) => {
    const exerciseId = activity.exerciseId || activity.id;
    setVideoPlayback({
      title: activity.title,
      playbackUrl: '',
      fallbackUrls: [],
      thumbnailUrl: activity.img,
      instructions: activity.instructions || [],
      loading: true,
      error: null,
    });
    setIsVideoModalOpen(true);

    try {
      const res = await exerciseApi.getPlaybackUrl(exerciseId);
      setVideoPlayback((prev) => ({
        ...prev,
        playbackUrl: res.data?.playbackUrl || '',
        fallbackUrls: res.data?.fallbackUrls || [],
        thumbnailUrl: res.data?.thumbnailUrl || prev.thumbnailUrl,
        instructions: activity.instructions || [],
        loading: false,
      }));
    } catch (err) {
      console.error('Playback error:', err);
      setVideoPlayback((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Unable to retrieve playback stream.',
      }));
    }
  };

  const childName = activeChild?.preferredName || activeChild?.firstName || 'Child';
  const progressPercent = progress.progressPercent || 0;
  const streakDays = progress.streakDays || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      {/* Header & Child Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-heading font-extrabold text-primary mb-1">Activity Hub</h2>
          <p className="text-muted font-medium text-sm">
            Therapeutic activities for motor and cognitive development
          </p>
        </div>

        {/* Child Selector Dropdown if multiple children exist */}
        {children.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
              className="bg-white border border-gray-200 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm hover:border-primary/50 transition-all cursor-pointer"
            >
              <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(childName)}&backgroundColor=c0aede`}
                alt={childName}
                className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20"
              />
              <span className="text-sm font-bold text-text">{childName}</span>
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>

            {isChildDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-30">
                <p className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Select Child Profile
                </p>
                {children.map((k) => {
                  const kName = k.preferredName || k.firstName;
                  const isCurrent = k._id === activeChild?._id;
                  return (
                    <button
                      key={k._id}
                      onClick={() => handleSelectChild(k)}
                      className={`w-full px-4 py-2.5 text-left text-sm font-bold flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        isCurrent ? 'text-primary bg-primary/5' : 'text-text'
                      }`}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(kName)}&backgroundColor=c0aede`}
                        alt={kName}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{kName}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-semibold">Loading personalized activities...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-200 rounded-3xl flex flex-col items-center justify-center text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
          <h3 className="font-bold text-red-800 text-base">Unable to load activities</h3>
          <p className="text-xs text-red-600 mt-1 mb-4">{error}</p>
          <button
            onClick={() => loadChildExerciseData(activeChild?._id)}
            className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* 1. Child Activity Hero Section */}
          <motion.div
            variants={itemVariants}
            className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-indigo-600 to-primary text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

            <div className="relative z-10 flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 p-1">
                  <img
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(childName)}&backgroundColor=ffffff`}
                    alt={childName}
                    className="w-full h-full rounded-full shadow-lg bg-white object-cover"
                  />
                </div>
                <svg
                  className="absolute inset-0 w-24 h-24 -rotate-90 pointer-events-none"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="transparent"
                    stroke="#F59E0B"
                    strokeWidth="6"
                    strokeDasharray="289"
                    initial={{ strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * progressPercent) / 100 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-xs font-bold mb-3 shadow-sm">
                  <Target className="w-4 h-4 text-accent" /> Daily Target:{' '}
                  {progress.dailyTarget || 4} Activities
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-extrabold mb-1">
                  Activity Journey
                </h2>
                <p className="text-indigo-100 font-medium">
                  {progressPercent}% of daily therapy completed
                </p>
              </div>
            </div>

            <div className="relative z-10 flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
                <Flame className="w-8 h-8 text-accent mb-2 drop-shadow-sm" />
                <span className="text-2xl font-heading font-black">{streakDays} Days</span>
                <span className="text-xs text-indigo-100 font-semibold uppercase tracking-wider">
                  Streak
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* 2. Recommended Activities */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-end mb-6">
                  <h3 className="font-heading font-extrabold text-2xl text-text">
                    Recommended for Today
                  </h3>
                  <span className="text-sm font-bold text-primary hover:text-blue-700 cursor-pointer">
                    View All
                  </span>
                </div>

                {activities.length === 0 ? (
                  <div className="p-8 bg-white border border-gray-100 rounded-3xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-primary flex items-center justify-center mx-auto">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-gray-700">No activities scheduled today</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      Your therapist has not assigned any specific exercises for today.
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {activities.map((ex) => (
                      <div
                        key={ex.id || ex.planId}
                        className="glass bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 group border-b-4 border-b-white hover:border-b-primary transition-all flex flex-col h-full"
                      >
                        <div
                          onClick={() => handlePlayVideo(ex)}
                          className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-gray-900 mb-4 cursor-pointer"
                        >
                          <img
                            src={ex.img}
                            alt={ex.title}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                              <Play className="w-6 h-6 text-white ml-1 fill-white" />
                            </div>
                          </div>
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md bg-white/90 ${ex.color}`}
                            >
                              {ex.category}
                            </span>
                            {ex.recommended && (
                              <span className="text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm backdrop-blur-md bg-accent/90 text-white flex items-center gap-1">
                                <Target className="w-3 h-3" /> Therapist Pick
                              </span>
                            )}
                          </div>
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {ex.duration}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="mb-4">
                            <h4 className="font-bold text-lg text-text leading-tight mb-1 group-hover:text-primary transition-colors">
                              {ex.title}
                            </h4>
                            <p className="text-sm text-muted font-medium">
                              Difficulty: {ex.difficulty}
                            </p>
                          </div>
                          <div
                            onClick={() => handleToggleActivity(ex)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer mt-auto ${
                              ex.completed
                                ? 'bg-success/5 border-success/20'
                                : 'bg-gray-50 border-transparent hover:border-gray-200'
                            }`}
                          >
                            <div className="shrink-0">
                              {ex.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-success fill-success bg-white rounded-full shadow-sm" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-300" />
                              )}
                            </div>
                            <span
                              className={`font-semibold text-sm ${
                                ex.completed ? 'text-success/80' : 'text-text'
                              }`}
                            >
                              {ex.completed ? 'Session Completed' : 'Mark as Complete'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* 3 & 5. Daily Journey & Skill Focus */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* 3. Daily Activity Journey */}
                <motion.div
                  variants={itemVariants}
                  className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white"
                >
                  <h3 className="font-heading font-extrabold text-xl text-text mb-2">
                    Today's Journey
                  </h3>
                  <p className="text-sm text-muted font-medium mb-6">
                    Your customized activity pathway
                  </p>

                  <div className="space-y-0 relative">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 rounded-full" />
                    <div
                      className="absolute left-6 top-6 w-0.5 bg-primary rounded-full transition-all duration-1000"
                      style={{ height: `${progressPercent}%` }}
                    />

                    {activities.map((task) => (
                      <div
                        key={task.id || task.planId}
                        className="relative flex items-center gap-4 py-4 pl-3"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 border-[3px] transition-colors bg-white ${
                            task.completed ? 'border-primary' : 'border-gray-200'
                          }`}
                        >
                          {task.completed && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <div
                          className={`flex-1 p-4 rounded-2xl border transition-all ${
                            task.completed
                              ? 'bg-gray-50/50 border-gray-100'
                              : 'bg-white border-white shadow-sm'
                          }`}
                        >
                          <h4
                            className={`font-bold text-sm ${
                              task.completed ? 'text-muted line-through' : 'text-text'
                            }`}
                          >
                            {task.title}
                          </h4>
                          <p className="text-xs text-muted font-medium mt-0.5">{task.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 5. Skill Focus Radar Chart */}
                <motion.div
                  variants={itemVariants}
                  className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-heading font-extrabold text-xl text-text">Skill Focus</h3>
                      <p className="text-sm text-muted">Weekly development areas</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex-1 w-full min-h-[220px] -ml-4 flex items-center justify-center">
                    {skillData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }}
                          />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                          />
                          <Radar
                            name={childName}
                            dataKey="A"
                            stroke="var(--primary)"
                            fill="var(--primary)"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-xs text-muted italic text-center p-6">
                        Skill insights will appear after assessment or therapist evaluation.
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="space-y-8">
              {/* 4. AI Exercise Coach */}
              <motion.div
                variants={itemVariants}
                className="glass rounded-[2.5rem] border border-white p-6 relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50"
              >
                <div className="absolute -right-6 -bottom-6 opacity-10">
                  <Bot className="w-40 h-40 text-indigo-600" />
                </div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm border border-indigo-200">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-indigo-900">
                    AI Activity Coach
                  </h3>
                </div>
                <p className="text-sm text-indigo-900/80 font-medium leading-relaxed relative z-10 mb-4">
                  {coachAdvice ||
                    `${childName} is making great steady progress! Continue consistent daily routines for optimal developmental gains.`}
                </p>
              </motion.div>

              {/* 6. Therapist Feedback */}
              <motion.div
                variants={itemVariants}
                className="glass rounded-[2.5rem] border border-white p-6"
              >
                {therapistFeedback ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <img
                        src={
                          therapistFeedback.therapistAvatar ||
                          'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=b6e3f4'
                        }
                        alt="Therapist"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-white"
                      />
                      <div>
                        <h4 className="font-bold text-text text-sm">
                          {therapistFeedback.therapistName || 'Dr. Sarah Jenkins'}
                        </h4>
                        <p className="text-xs text-muted font-semibold">
                          {therapistFeedback.therapistRole || 'Occupational Therapist'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-border/50 rounded-2xl p-4 relative">
                      <div className="absolute top-4 left-4 text-gray-300">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <p className="text-sm text-muted font-medium italic pl-8">
                        "{therapistFeedback.feedback}"
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm font-bold">
                      <span className="text-muted">Next Review:</span>
                      <span className="text-primary">
                        {therapistFeedback.nextReviewDate
                          ? new Date(therapistFeedback.nextReviewDate).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Jun 25, 2026'}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-muted italic text-center py-6">
                    Therapist feedback notes will appear following clinical reviews.
                  </p>
                )}
              </motion.div>

              {/* 7. Achievement Milestones */}
              <motion.div
                variants={itemVariants}
                className="glass rounded-[2.5rem] border border-white p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-accent/10 rounded-xl text-accent shadow-sm border border-accent/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text">Milestones</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {milestones.length > 0 ? (
                    milestones.map((badge, i) => {
                      const IconComponent =
                        badge.badge === 'streak'
                          ? Flame
                          : badge.badge === 'sensory'
                          ? Target
                          : Activity;
                      return (
                        <div
                          key={i}
                          className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                            badge.locked
                              ? 'bg-gray-50 border-gray-100 opacity-60 grayscale'
                              : 'bg-white border-white shadow-sm hover:-translate-y-1 hover:shadow-md'
                          } ${i === 2 ? 'col-span-2' : ''}`}
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                              badge.locked ? 'bg-gray-200 text-gray-400' : `${badge.bg} ${badge.color}`
                            }`}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-text leading-tight">
                            {badge.title}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center p-4 rounded-2xl border text-center bg-white border-white shadow-sm">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-accent/10 text-accent">
                          <Flame className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-text leading-tight">
                          {streakDays}-Day Streak
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-4 rounded-2xl border text-center bg-white border-white shadow-sm">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-primary/10 text-primary">
                          <Target className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-text leading-tight">
                          Sensory Master
                        </span>
                      </div>
                      <div className="col-span-2 flex flex-col items-center justify-center p-4 rounded-2xl border text-center bg-gray-50 border-gray-100 opacity-60 grayscale">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gray-200 text-gray-400">
                          <Activity className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-text leading-tight">
                          Perfect Balance
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* 8. Activity History */}
              <motion.div
                variants={itemVariants}
                className="glass rounded-[2.5rem] border border-white p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-100 rounded-xl text-gray-600 shadow-sm border border-gray-200">
                      <History className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-text">Recent History</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentHistory.length > 0 ? (
                    recentHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-text">{item.title}</h4>
                          <p className="text-xs text-muted font-medium mt-0.5">
                            {item.date} • {item.duration}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted italic text-center py-4">
                      Completed exercise sessions will be logged here.
                    </p>
                  )}
                </div>
                {recentHistory.length > 0 && (
                  <button className="w-full mt-4 py-3 text-sm font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer">
                    View Full Log
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title={videoPlayback.title}
        playbackUrl={videoPlayback.playbackUrl}
        fallbackUrls={videoPlayback.fallbackUrls}
        thumbnailUrl={videoPlayback.thumbnailUrl}
        instructions={videoPlayback.instructions}
        loading={videoPlayback.loading}
        error={videoPlayback.error}
      />
    </div>
  );
};

export default Exercise;
