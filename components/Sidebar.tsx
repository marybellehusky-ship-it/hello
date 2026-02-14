
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: any) => void;
  role: UserRole;
  onToggleRole: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, role, onToggleRole, isMobileOpen, onCloseMobile }) => {
  const navItems = [
    { id: 'browse', label: 'Explore', icon: 'fa-magnifying-glass' },
    { id: 'inbox', label: 'Messages', icon: 'fa-comments', hasNotification: true },
    { id: 'profile', label: 'My Profile', icon: 'fa-user' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity md:hidden ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onCloseMobile}
      ></div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:flex ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-indigo-600 flex items-center gap-2">
            <i className="fa-solid fa-handshake-angle"></i>
            LocalAssist
          </h1>
          <button onClick={onCloseMobile} className="md:hidden text-slate-400 p-2 hover:text-slate-600 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 font-semibold'
              }`}
            >
              <div className="flex items-center gap-4">
                <i className={`fa-solid ${item.icon} text-lg w-6 ${activeView === item.id ? 'text-white' : 'group-hover:text-indigo-500 transition-colors'}`}></i>
                {item.label}
              </div>
              {item.hasNotification && activeView !== item.id && (
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 mb-6 md:mb-0">
          <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${role === 'provider' ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
                 <span className="text-lg font-black capitalize text-slate-900">{role}</span>
              </div>
            </div>
            <button 
              onClick={onToggleRole}
              className="w-full py-3 bg-white border-2 border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-arrows-rotate text-[8px]"></i>
              Switch to {role === 'client' ? 'Provider' : 'Client'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
