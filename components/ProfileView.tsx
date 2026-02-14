
import React from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onToggleRole: () => void;
  onEdit?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onToggleRole, onEdit }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-16 left-10 flex items-end gap-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover bg-slate-100" 
                alt={user.name} 
              />
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <div className="flex items-center gap-2 text-slate-500">
                <i className="fa-solid fa-location-dot"></i>
                <span className="text-sm">{user.location}</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 right-6">
            <button 
              onClick={onEdit}
              className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 border border-white/30"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="pt-24 pb-12 px-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <p className="text-xl font-bold text-slate-900">{user.rating}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase">Rating</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <p className="text-xl font-bold text-slate-900">{user.reviewsCount}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase">Reviews</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                  <p className="text-xl font-bold text-slate-900">24</p>
                  <p className="text-xs text-slate-400 font-bold uppercase">Completed</p>
                </div>
              </div>

              <section className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">About Me</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {user.bio || "No description provided. Click edit to share more about yourself with the community!"}
                </p>
                {(!user.bio) && (
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
                    Note: Verified profiles are more likely to get hired.
                  </p>
                )}
              </section>

              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="flex items-center gap-4 text-slate-400">
                   <i className="fa-solid fa-lock text-xl"></i>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest">Phone Number Hidden</p>
                      <p className="text-[10px] font-medium">Unlocked only for active connections</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 space-y-4">
              <div className="bg-indigo-50 p-6 rounded-3xl space-y-4">
                <h4 className="font-bold text-indigo-900">Account Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-indigo-600">Current Role</span>
                    <span className="font-bold capitalize">{user.role}</span>
                  </div>
                  <button 
                    onClick={onToggleRole}
                    className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                  >
                    Switch to {user.role === 'client' ? 'Provider' : 'Client'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
