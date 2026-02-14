
import React from 'react';
import { Service } from '../types';

interface ServiceDetailViewProps {
  service: Service;
  onBack: () => void;
  onChat: (id: string) => void;
}

const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({ service, onBack, onChat }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      <nav className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-[0.2em] group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </div>
          Back to Explore
        </button>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
          <i className="fa-solid fa-heart"></i>
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[16/10] bg-slate-100 relative group">
            <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute top-6 left-6 flex gap-2">
               <div className="bg-white/95 backdrop-blur shadow-xl px-5 py-2.5 rounded-2xl flex items-center gap-3 border border-white/50">
                  <i className="fa-solid fa-location-dot text-indigo-600"></i>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{service.distanceKm} KM Away</span>
               </div>
            </div>
            <div className="absolute bottom-6 right-6">
               <div className="bg-indigo-600 shadow-xl px-5 py-2.5 rounded-2xl flex items-center gap-2 text-white">
                  <i className="fa-solid fa-camera"></i>
                  <span className="text-xs font-black uppercase tracking-widest">1/1 Photos</span>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="bg-indigo-50 text-indigo-700 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                {service.category}
              </span>
              {service.provider.isAadharVerified && (
                <span className="bg-green-50 text-green-700 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-green-100">
                  <i className="fa-solid fa-id-card"></i>
                  Identity Verified
                </span>
              )}
            </div>
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">{service.title}</h2>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm leading-relaxed">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">About the service</h4>
              <p className="text-lg text-slate-600 font-medium">
                {service.description}
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Community Feedback</h3>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-black text-slate-900">{service.provider.rating}</span>
                 <div className="flex text-amber-400 text-[10px]">
                    {[...Array(5)].map((_, idx) => <i key={idx} className="fa-solid fa-star"></i>)}
                 </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Rahul S.", text: "Extremely professional and delivered exactly what I needed. Highly recommended!", date: "2 days ago" },
                { name: "Priya K.", text: "Prompt response and great communication. Will definitely hire again.", date: "1 week ago" }
              ].map((rev, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=rev_${i}`} alt="" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{rev.name}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{rev.date}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-medium italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-50 sticky top-8 space-y-8">
            <div className="text-center">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Starting From</p>
              <div className="flex items-center justify-center gap-1">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{service.rate}</span>
                <span className="text-base text-slate-300 font-bold uppercase tracking-widest pt-2">/ {service.rateUnit}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600">
                  <i className="fa-solid fa-shield-check text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Protection</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">LocalAssist Escrow</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-600">
                  <i className="fa-solid fa-circle-check text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Response</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Under 30 Minutes</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onChat(service.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <span className="uppercase tracking-[0.2em] text-sm">Send Inquiry</span>
              <i className="fa-solid fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
            </button>

            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                  <img src={service.provider.avatar} className="w-16 h-16 rounded-[1.5rem] object-cover border-4 border-indigo-50 shadow-sm" alt={service.provider.name} />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1 group-hover:text-indigo-600 transition-colors">{service.provider.name}</p>
                  <p className="text-[9px] text-indigo-600 font-black uppercase tracking-[0.2em]">Verified Provider</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailView;
