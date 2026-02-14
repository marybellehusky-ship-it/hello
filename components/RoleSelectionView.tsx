
import React from 'react';
import { UserRole } from '../types';

interface RoleSelectionViewProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelectionView: React.FC<RoleSelectionViewProps> = ({ onSelect }) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-indigo-50/50 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-4xl w-full relative z-10 space-y-12 animate-fadeIn flex-1 flex flex-col justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200 mb-6">
             <i className="fa-solid fa-handshake-angle text-white text-3xl"></i>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Welcome to <span className="text-indigo-600">LocalAssist</span></h1>
          <p className="text-xl text-slate-500 font-medium">Choose how you want to use the platform today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Provider Card */}
          <button 
            onClick={() => onSelect('provider')}
            className="group relative bg-white p-10 rounded-[3rem] shadow-2xl border border-white hover:border-indigo-500 transition-all hover:-translate-y-2 text-left"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <i className="fa-solid fa-briefcase text-2xl"></i>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">I want to Work</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Earn money by providing local services like assignment writing, plumbing, or household chores.
            </p>
            <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-sm">
               Become a Provider <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </div>
          </button>

          {/* Client Card */}
          <button 
            onClick={() => onSelect('client')}
            className="group relative bg-white p-10 rounded-[3rem] shadow-2xl border border-white hover:border-purple-500 transition-all hover:-translate-y-2 text-left"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all">
               <i className="fa-solid fa-user-check text-2xl"></i>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">I want to Hire</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Find reliable local help for your assignments, errands, or professional repair needs.
            </p>
            <div className="mt-8 flex items-center gap-2 text-purple-600 font-black uppercase tracking-widest text-sm">
               Start Hiring <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </div>
          </button>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="relative z-10 mt-12 pb-6">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Developed by <span className="text-slate-900 font-black">AKSHANSH KUMAR SINGH</span>
        </p>
      </div>
    </div>
  );
};

export default RoleSelectionView;
