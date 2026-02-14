
import React, { useState } from 'react';
import { User } from '../types';

interface EditProfileViewProps {
  user: User;
  onBack: () => void;
  onComplete: (data: {
    name: string;
    address: string;
    avatar: string;
    bio: string;
  }) => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    address: user.location,
    avatar: user.avatar,
    bio: user.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onComplete(formData);
      setLoading(false);
    }, 1000);
  };

  const changeAvatar = () => {
    // Just a placeholder to rotate some avatars
    const randomId = Math.floor(Math.random() * 70);
    setFormData(prev => ({ ...prev, avatar: `https://i.pravatar.cc/150?u=user_${randomId}` }));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12 space-y-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <i className="fa-solid fa-chevron-left"></i>
              Cancel
            </button>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Update Profile</h2>
            <div className="w-12"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={changeAvatar}>
                <img 
                  src={formData.avatar} 
                  className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-slate-50 shadow-lg" 
                  alt="Avatar" 
                />
                <div className="absolute inset-0 bg-indigo-600/40 rounded-[2.5rem] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                   <i className="fa-solid fa-camera text-2xl"></i>
                </div>
              </div>
              <p className="mt-3 text-[10px] font-black text-indigo-600 uppercase tracking-widest">Tap to change avatar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Display Name</label>
                <input 
                  type="text" 
                  name="name"
                  required 
                  placeholder="Your Name"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Location / Area</label>
                <input 
                  type="text" 
                  name="address"
                  required 
                  placeholder="e.g. Springfield"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">About Me (Bio)</label>
              <textarea 
                name="bio"
                required 
                rows={5}
                placeholder="Share your experience, availability, or what you're looking for..."
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 resize-none shadow-sm placeholder:text-slate-400 bg-white"
                value={formData.bio}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.97]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-sm">Save Changes</span>
                    <i className="fa-solid fa-check"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileView;
