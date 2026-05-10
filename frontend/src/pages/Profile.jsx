import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, FileText, Image as ImageIcon, Save, Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

export default function Profile({ session, profile, onProfileUpdate }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    bio: '',
    favorite_topics: []
  });
  const [newTopic, setNewTopic] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        favorite_topics: profile.favorite_topics || []
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const updates = {
        id: session.user.id,
        ...formData,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;
      
      onProfileUpdate(updates);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.favorite_topics.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        favorite_topics: [...prev.favorite_topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove) => {
    setFormData(prev => ({
      ...prev,
      favorite_topics: prev.favorite_topics.filter(t => t !== topicToRemove)
    }));
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <Link 
          to="/feed" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center text-primary border border-primary/20">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tighter">Your <span className="text-gradient">Profile</span></h2>
            <p className="text-gray-400 mt-1">Manage your identity and preferences.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Preview Card */}
        <div className="md:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 border-white/5 sticky top-24"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-2xl bg-darker border border-white/10 overflow-hidden mb-4 group relative">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-white/5">
                    <User className="h-10 w-10 text-gray-600" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{formData.full_name || 'Anonymous User'}</h3>
              <p className="text-gray-500 text-sm mb-6">{session.user.email}</p>
              
              <div className="w-full space-y-4 pt-6 border-t border-white/5">
                <div className="text-left">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">About</h4>
                  <p className="text-gray-400 text-xs italic">
                    {formData.bio || 'No bio yet...'}
                  </p>
                </div>
                
                <div className="text-left">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.favorite_topics.length > 0 ? (
                      formData.favorite_topics.map((topic, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase border border-primary/10">
                          {topic}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600 text-[10px]">No topics added</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 border-white/5"
          >
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <User className="h-3 w-3 text-primary" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 bg-darker/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="h-3 w-3 text-primary" />
                    Avatar URL
                  </label>
                  <input
                    type="text"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    className="w-full px-4 py-3 bg-darker/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <p className="text-[10px] text-gray-500 italic">Enter a direct image link for your profile picture.</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="h-3 w-3 text-primary" />
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-darker/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Favorite Topics */}
                <div className="space-y-4">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Plus className="h-3 w-3 text-primary" />
                    Favorite Topics
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                      className="flex-1 px-4 py-3 bg-darker/50 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="Add a topic (e.g. LLMs, Robotics)"
                    />
                    <button
                      type="button"
                      onClick={addTopic}
                      className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-primary hover:text-darker transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-darker/30 rounded-xl border border-white/5">
                    {formData.favorite_topics.map((topic, i) => (
                      <span 
                        key={i} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20 group"
                      >
                        {topic}
                        <button 
                          type="button"
                          onClick={() => removeTopic(topic)}
                          className="text-primary/50 hover:text-white transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {formData.favorite_topics.length === 0 && (
                      <span className="text-gray-600 text-xs italic">No topics added yet.</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <div className={`text-sm font-bold text-green-400 transition-opacity duration-500 ${success ? 'opacity-100' : 'opacity-0'}`}>
                  Profile updated successfully!
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-darker font-black rounded-xl hover:bg-white transition-all shadow-[0_0_20px_var(--color-primary-glow)] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                  Save Profile
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
