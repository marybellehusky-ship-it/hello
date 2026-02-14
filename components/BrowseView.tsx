
import React from 'react';
import { Service } from '../types';

interface BrowseViewProps {
  services: Service[];
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
}

const categories = ['All', 'Education', 'Home Service', 'Creative', 'Personal Support'];

const BrowseView: React.FC<BrowseViewProps> = ({ 
  services, onSelect, searchQuery, onSearchChange, categoryFilter, onCategoryChange 
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="space-y-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">
            Local <span className="text-indigo-600">Assistance</span>
          </h2>
          <p className="text-slate-500 font-medium">Find reliable services within your immediate neighborhood</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Who are you looking for?" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-14 pr-4 py-5 rounded-[1.5rem] border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm font-bold text-slate-700"
            />
          </div>
          <button className="bg-white border border-slate-200 px-8 py-5 rounded-[1.5rem] text-slate-900 font-black text-xs uppercase tracking-widest hover:bg-slate-50 flex items-center gap-3 shadow-sm transition-all active:scale-95">
            <i className="fa-solid fa-location-crosshairs text-indigo-500"></i>
            Near Springfield
          </button>
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                categoryFilter === cat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.length > 0 ? (
          services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => onSelect(service.id)}
              className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col h-full"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={service.images[0]} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <i className="fa-solid fa-bolt text-amber-500"></i>
                  {service.distanceKm} km
                </div>
                {service.provider.rating >= 4.8 && (
                  <div className="absolute top-4 right-4 bg-indigo-600 px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                    TOP RATED
                  </div>
                )}
                <div className="absolute bottom-4 left-6">
                  <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{service.category}</p>
                  <h3 className="text-2xl font-black text-white leading-tight">{service.title}</h3>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 space-y-6">
                <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
                  {service.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={service.provider.avatar} 
                        className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-50" 
                        alt={service.provider.name} 
                      />
                      {(service.provider.isPhoneVerified || service.provider.isAadharVerified) && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                          <i className="fa-solid fa-check text-white text-[8px]"></i>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 tracking-tight leading-none mb-1">
                        {service.provider.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
                          <span className="text-xs font-black text-slate-600">{service.provider.rating}</span>
                        </div>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{service.provider.reviewsCount} Reviews</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 leading-none">₹{service.rate}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">per {service.rateUnit}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-wind text-slate-300 text-3xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Nothing found</h3>
            <p className="text-slate-500 font-medium">Adjust your search to find more local experts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseView;
