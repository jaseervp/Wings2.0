import { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, LogOut, Globe, ChevronRight, Users, 
  Target, HeartPulse, CreditCard, PhoneCall, BarChart3, 
  CheckCircle2, Plus, Edit2, AlertTriangle, ShieldCheck, Loader2, Baby
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { childrenApi } from '../../features/onboarding/services/onboardingApi';

const TABS = [
  { id: 'profile', icon: User, label: 'Child Profiles' },
  { id: 'family', icon: Users, label: 'Family Access' },
  { id: 'goals', icon: Target, label: 'Development Goals' },
  { id: 'health', icon: HeartPulse, label: 'Healthcare Prefs' },
  { id: 'billing', icon: CreditCard, label: 'Membership' },
  { id: 'emergency', icon: PhoneCall, label: 'Emergency Contacts' },
  { id: 'security', icon: Shield, label: 'Privacy & Security' },
  { id: 'language', icon: Globe, label: 'Language & Acc.' },
  { id: 'analytics', icon: BarChart3, label: 'Account Analytics' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Child edit form state
  const [childForm, setChildForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    medicalConditions: '',
    allergies: '',
  });

  // Modal state for adding a new child
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChildForm, setNewChildForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    medicalConditions: '',
    allergies: '',
  });
  const [addingChild, setAddingChild] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await childrenApi.getMyChildren();
        if (isMounted && res.success && Array.isArray(res.data)) {
          setChildrenList(res.data);
          if (res.data.length > 0) {
            const first = res.data[0];
            setChildForm({
              firstName: first.firstName || '',
              lastName: first.lastName || '',
              dateOfBirth: first.dateOfBirth ? new Date(first.dateOfBirth).toISOString().split('T')[0] : '',
              medicalConditions: first.medicalConditions || '',
              allergies: first.allergies || '',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load children:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchChildren();
    return () => { isMounted = false; };
  }, []);

  const handleSelectChild = (idx) => {
    setSelectedChildIndex(idx);
    const child = childrenList[idx];
    if (child) {
      setChildForm({
        firstName: child.firstName || '',
        lastName: child.lastName || '',
        dateOfBirth: child.dateOfBirth ? new Date(child.dateOfBirth).toISOString().split('T')[0] : '',
        medicalConditions: child.medicalConditions || '',
        allergies: child.allergies || '',
      });
    }
  };

  const handleSaveChild = async () => {
    const activeChild = childrenList[selectedChildIndex];
    if (!activeChild?._id) return;

    try {
      setSaving(true);
      setSaveError('');
      setSaveSuccess(false);

      const res = await childrenApi.updateChild(activeChild._id, {
        firstName: childForm.firstName,
        lastName: childForm.lastName,
        dateOfBirth: childForm.dateOfBirth || undefined,
        medicalConditions: childForm.medicalConditions || undefined,
        allergies: childForm.allergies || undefined,
      });

      if (res.success && res.data) {
        setSaveSuccess(true);
        // Update in list
        setChildrenList(prev => {
          const next = [...prev];
          next[selectedChildIndex] = res.data;
          return next;
        });
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update child profile:', err);
      setSaveError(err.message || 'Failed to update child profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    if (!newChildForm.firstName || !newChildForm.lastName || !newChildForm.dateOfBirth) {
      return;
    }

    try {
      setAddingChild(true);
      const res = await childrenApi.createChild(newChildForm);
      if (res.success && res.data) {
        const updated = [...childrenList, res.data];
        setChildrenList(updated);
        setSelectedChildIndex(updated.length - 1);
        setChildForm({
          firstName: res.data.firstName || '',
          lastName: res.data.lastName || '',
          dateOfBirth: res.data.dateOfBirth ? new Date(res.data.dateOfBirth).toISOString().split('T')[0] : '',
          medicalConditions: res.data.medicalConditions || '',
          allergies: res.data.allergies || '',
        });
        setShowAddModal(false);
        setNewChildForm({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: 'MALE',
          medicalConditions: '',
          allergies: '',
        });
      }
    } catch (err) {
      console.error('Failed to create child:', err);
    } finally {
      setAddingChild(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activeChild = childrenList[selectedChildIndex];
  const activeChildName = activeChild 
    ? `${activeChild.firstName || ''} ${activeChild.lastName || ''}`.trim() 
    : 'No child selected';

  const calculateAgeText = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    return `${years} Years Old`;
  };

  // Animation variants for tab content
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        if (loading) {
          return (
            <div className="glass bg-white rounded-[2rem] p-12 border border-white shadow-sm flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-sm font-semibold text-muted">Loading child profiles...</p>
            </div>
          );
        }

        if (childrenList.length === 0) {
          return (
            <motion.div key="no-profile" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-heading font-extrabold text-text">Child Profiles</h3>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Child
                </button>
              </div>
              <div className="glass bg-white rounded-[2rem] p-12 border border-white shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Baby className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-text mb-2">No Child Profiles Found</h4>
                <p className="text-muted text-sm max-w-sm mb-6">You have not added any children yet. Create a child profile to get personalized care and assessments.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add First Child
                </button>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div key="profile" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-heading font-extrabold text-text">Child Profiles</h3>
                {childrenList.length > 1 && (
                  <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl">
                    {childrenList.map((c, i) => (
                      <button
                        key={c._id || i}
                        onClick={() => handleSelectChild(i)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          selectedChildIndex === i 
                            ? 'bg-white text-primary shadow-sm' 
                            : 'text-muted hover:text-text'
                        }`}
                      >
                        {c.firstName || `Child ${i + 1}`}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Child
              </button>
            </div>
            
            <div className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 pb-8 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent border-4 border-white shadow-lg flex items-center justify-center text-white text-3xl font-black">
                    {activeChild?.firstName ? activeChild.firstName.charAt(0).toUpperCase() : 'C'}
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xl font-bold text-text mb-1">{activeChildName}</h4>
                  <p className="text-sm font-medium text-muted mb-3">
                    {activeChild?.dateOfBirth ? calculateAgeText(activeChild.dateOfBirth) : 'Age not provided'}
                    {activeChild?.medicalConditions ? ` • ${activeChild.medicalConditions}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-md">
                      {activeChild?.speechLanguageDelays ? 'Speech Support' : 'Speech Therapy'}
                    </span>
                    <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-md">
                      {activeChild?.motorSkillsDelays ? 'Motor Skill Support' : 'Occupational Therapy'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text block">First Name</label>
                  <input 
                    type="text" 
                    value={childForm.firstName} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text block">Last Name</label>
                  <input 
                    type="text" 
                    value={childForm.lastName} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text block">Date of Birth</label>
                  <input 
                    type="date" 
                    value={childForm.dateOfBirth} 
                    onChange={(e) => setChildForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text block">Primary Diagnosis / Medical Conditions</label>
                  <input 
                    type="text" 
                    value={childForm.medicalConditions} 
                    placeholder="e.g. ASD Level 1, ADHD, None"
                    onChange={(e) => setChildForm(prev => ({ ...prev, medicalConditions: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text" 
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-text block">Allergies / Special Notes</label>
                  <input 
                    type="text" 
                    value={childForm.allergies} 
                    placeholder="e.g. Peanut allergy, sensitive to loud noises"
                    onChange={(e) => setChildForm(prev => ({ ...prev, allergies: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-text" 
                  />
                </div>
              </div>

              {saveError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Child profile updated successfully!</span>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSaveChild}
                  disabled={saving}
                  className={`px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );
      
      case 'family':
        return (
          <motion.div key="family" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <h3 className="text-2xl font-heading font-extrabold text-text mb-2">Family & Care Team Access</h3>
            <div className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm space-y-6">
              
              {/* Primary Parent */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">P</div>
                  <div>
                    <h5 className="font-bold text-text text-sm">Priya Sharma (You)</h5>
                    <p className="text-xs text-muted font-medium">Primary Account Holder</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-md">Owner</span>
              </div>

              {/* Co-Parent */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">R</div>
                  <div>
                    <h5 className="font-bold text-text text-sm">Rahul Sharma</h5>
                    <p className="text-xs text-muted font-medium">Co-Parent</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-muted hover:text-red-500 transition-colors">Remove</button>
              </div>

              {/* Therapist */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-bold text-lg">D</div>
                  <div>
                    <h5 className="font-bold text-text text-sm">Dr. Anjali Menon</h5>
                    <p className="text-xs text-muted font-medium">Therapist (View Only)</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-muted hover:text-red-500 transition-colors">Revoke</button>
              </div>

              <button className="w-full py-4 border-2 border-dashed border-gray-200 text-primary font-bold rounded-2xl hover:bg-primary/5 hover:border-primary/30 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Invite Caregiver or Therapist
              </button>
            </div>
          </motion.div>
        );

      case 'goals':
        return (
          <motion.div key="goals" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <h3 className="text-2xl font-heading font-extrabold text-text mb-2">Development Goals</h3>
            <div className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm space-y-6">
               <div className="space-y-4">
                 {[
                   { goal: "Improve Pincer Grasp", status: "In Progress", progress: 65, color: "bg-primary" },
                   { goal: "Expand Expressive Vocabulary (50 words)", status: "In Progress", progress: 40, color: "bg-secondary" },
                   { goal: "Establish Independent Morning Routine", status: "Target Met", progress: 100, color: "bg-success" }
                 ].map((item, i) => (
                   <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
                     <div className="flex justify-between items-center mb-3">
                       <h5 className="font-bold text-sm text-text">{item.goal}</h5>
                       <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${item.progress === 100 ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>
                         {item.status}
                       </span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div className={`${item.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
               <button className="px-6 py-3 bg-gray-100 text-text font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Goal
               </button>
            </div>
          </motion.div>
        );

      case 'billing':
        return (
          <motion.div key="billing" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <h3 className="text-2xl font-heading font-extrabold text-text mb-2">Premium Membership</h3>
            
            <div className="glass bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 sm:p-10 shadow-xl text-white relative overflow-hidden border border-gray-700">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -ml-10 -mb-10" />
               
               <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-b border-gray-700/50 pb-8">
                 <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-950 text-xs font-black rounded-lg uppercase tracking-widest mb-3 shadow-sm">
                     <ShieldCheck className="w-4 h-4" /> Pro Plan Active
                   </div>
                   <h3 className="text-3xl font-heading font-black mb-1">Wings Premium</h3>
                   <p className="text-gray-400 font-medium">Billed annually. Next billing date: 24th June, 2026</p>
                 </div>
                 <div className="text-right">
                   <div className="text-4xl font-black">₹4,999<span className="text-lg text-gray-400 font-bold">/yr</span></div>
                 </div>
               </div>

               <div className="relative z-10 grid sm:grid-cols-2 gap-4 mb-8">
                 <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                   <CheckCircle2 className="w-5 h-5 text-success" /> Unlimited IQ & Assessments
                 </div>
                 <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                   <CheckCircle2 className="w-5 h-5 text-success" /> Priority Therapist Booking
                 </div>
                 <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                   <CheckCircle2 className="w-5 h-5 text-success" /> Advanced AI Diet Coach
                 </div>
                 <div className="flex items-center gap-3 text-sm font-medium text-gray-300">
                   <CheckCircle2 className="w-5 h-5 text-success" /> Exclusive Resource Bundles
                 </div>
               </div>

               <div className="relative z-10 flex gap-4">
                 <button className="px-6 py-3 bg-white text-gray-900 font-black rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                   Update Payment Method
                 </button>
                 <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm">
                   Cancel Plan
                 </button>
               </div>
            </div>
          </motion.div>
        );

      case 'emergency':
        return (
          <motion.div key="emergency" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-heading font-extrabold text-text">Emergency Contacts</h3>
                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
             </div>
             
             <div className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm space-y-6">
                <p className="text-sm font-medium text-muted mb-4">Store critical contact numbers that can be accessed instantly in case of an emergency.</p>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Primary Doctor</span>
                    <input type="text" defaultValue="Dr. Anjali Menon" className="bg-transparent font-bold text-text text-sm outline-none mb-2" />
                    <input type="text" defaultValue="+91 98765 43210" className="bg-transparent font-black text-primary text-lg outline-none" />
                  </div>
                  
                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Nearest Hospital</span>
                    <input type="text" defaultValue="Apollo Children's Hospital" className="bg-transparent font-bold text-text text-sm outline-none mb-2" />
                    <input type="text" defaultValue="044 2829 6262" className="bg-transparent font-black text-primary text-lg outline-none" />
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider mb-1">Emergency Service</span>
                    <input type="text" defaultValue="National Emergency (Ambulance)" className="bg-transparent font-bold text-text text-sm outline-none mb-2" />
                    <input type="text" defaultValue="108" className="bg-transparent font-black text-red-600 text-xl outline-none" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                    Save Contacts
                  </button>
                </div>
             </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div key="security" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <h3 className="text-2xl font-heading font-extrabold text-text mb-2">Privacy & Security</h3>
            <div className="glass bg-white rounded-[2rem] p-6 sm:p-8 border border-white shadow-sm space-y-8">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                  <h4 className="font-bold text-text text-sm mb-1">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-muted font-medium">Add an extra layer of security to your account.</p>
                </div>
                <div className="w-12 h-6 bg-success rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                  <h4 className="font-bold text-text text-sm mb-1">Medical Data Sharing</h4>
                  <p className="text-xs text-muted font-medium">Allow Wings AI to analyze anonymous data to improve recommendations.</p>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-text text-sm mb-4">Change Password</h4>
                <div className="space-y-4">
                  <input type="password" placeholder="Current Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                  <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm" />
                  <button className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors text-sm">
                    Update Password
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div key="analytics" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <h3 className="text-2xl font-heading font-extrabold text-text mb-2">Account Analytics</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass bg-white p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-heading font-black text-primary mb-2">12</span>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Assessments Taken</span>
              </div>
              <div className="glass bg-white p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-heading font-black text-secondary mb-2">45</span>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Consultations</span>
              </div>
              <div className="glass bg-white p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-heading font-black text-accent mb-2">14d</span>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Activity Streak</span>
              </div>
              <div className="glass bg-white p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-heading font-black text-success mb-2">92%</span>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Profile Completeness</span>
              </div>
            </div>
            <p className="text-center text-sm font-medium text-muted">Analytics data is updated daily based on your platform usage.</p>
          </motion.div>
        );

      default:
        return (
          <motion.div key="placeholder" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="glass bg-white rounded-[2rem] p-10 border border-white shadow-sm flex flex-col items-center justify-center text-center h-64">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
               <Shield className="w-8 h-8" />
             </div>
             <h3 className="font-bold text-lg text-text">Section Under Construction</h3>
             <p className="text-sm font-medium text-muted mt-2">This settings panel will be available shortly.</p>
          </motion.div>
        );
    }
  };

  const parentName = currentUser?.fullName || 'Parent';
  const parentInitial = parentName.charAt(0).toUpperCase();
  const childCountText = childrenList.length === 1 
    ? 'Managing 1 Child Profile' 
    : `Managing ${childrenList.length} Child Profiles`;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4 px-4 sm:px-6">
      
      {/* 1. Parent Overview Hero */}
      <div className="glass rounded-[2.5rem] p-8 sm:p-10 border border-white bg-gradient-to-br from-primary to-blue-800 shadow-xl shadow-primary/10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            {parentInitial}
          </div>
          <div>
            <h2 className="text-3xl font-heading font-extrabold mb-1">{parentName}</h2>
            <p className="text-primary-100 font-medium text-sm flex items-center gap-2">
              {childCountText} <span className="w-1.5 h-1.5 bg-success rounded-full"></span> Active Member
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-4">
           <button 
             onClick={() => setActiveTab('family')}
             className="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold text-sm rounded-xl transition-colors border border-white/30"
           >
             Account Details
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:w-72 shrink-0 space-y-2">
          {TABS.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'glass bg-white text-muted border border-white hover:border-primary/30 hover:text-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`} />
                {tab.label}
              </div>
              {activeTab !== tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm text-red-600 glass bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Secure Sign Out
            </button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>

      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-heading font-extrabold text-text">Add New Child Profile</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChild} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-text block mb-1">First Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newChildForm.firstName}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text block mb-1">Last Name *</label>
                  <input 
                    type="text" 
                    required
                    value={newChildForm.lastName}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-text block mb-1">Date of Birth *</label>
                  <input 
                    type="date" 
                    required
                    value={newChildForm.dateOfBirth}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-text block mb-1">Gender *</label>
                  <select
                    value={newChildForm.gender}
                    onChange={(e) => setNewChildForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">Medical Conditions / Primary Diagnosis</label>
                <input 
                  type="text" 
                  value={newChildForm.medicalConditions}
                  placeholder="e.g. ASD Level 1, Speech delay"
                  onChange={(e) => setNewChildForm(prev => ({ ...prev, medicalConditions: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">Allergies / Special Notes</label>
                <input 
                  type="text" 
                  value={newChildForm.allergies}
                  placeholder="e.g. Peanut allergy"
                  onChange={(e) => setNewChildForm(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={addingChild}
                  className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-md hover:bg-primary/90 flex items-center gap-2"
                >
                  {addingChild ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>{addingChild ? 'Adding...' : 'Add Child'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
