
import React, { useState, useEffect } from 'react';

interface ProfileSetupProps {
  onComplete: (data: {
    name: string;
    address: string;
    service: string;
    rate: number;
    rateUnit: string;
    avatar: string;
    description: string;
    portfolio: string[];
  }) => void;
}

const PREDEFINED_SERVICES = [
  'Assignment Writing',
  'Plumber',
  'Carpenter',
  'Household Chores',
  'Other'
];

const ProfileSetupView: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    selectedCategory: '',
    customService: '',
    rate: 0,
    rateUnit: 'hour',
    avatar: 'https://i.pravatar.cc/150?u=newuser',
    description: '',
  });

  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Auto-set rate units based on category
  useEffect(() => {
    let unit = 'visit';
    if (formData.selectedCategory === 'Assignment Writing') unit = 'page';
    else if (formData.selectedCategory === 'Household Chores') unit = 'month';
    else if (formData.selectedCategory === 'Plumber' || formData.selectedCategory === 'Carpenter') unit = 'visit';
    
    setFormData(prev => ({ ...prev, rateUnit: unit }));
  }, [formData.selectedCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addPortfolioItem = () => {
    const newItem = `https://picsum.photos/seed/sample${Math.random()}/600/800`;
    setPortfolio(prev => [...prev, newItem]);
  };

  const removePortfolioItem = (index: number) => {
    setPortfolio(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    const finalServiceTitle = formData.selectedCategory === 'Other' ? formData.customService : formData.selectedCategory;
    
    if (!formData.name || !formData.address || !finalServiceTitle || formData.rate <= 0) {
        alert("Please fill all mandatory fields correctly.");
        return;
    }

    setLoading(true);
    setTimeout(() => {
      onComplete({ 
        ...formData, 
        service: finalServiceTitle,
        portfolio 
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-indigo-50/50 p-4 py-12 relative overflow-hidden">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white relative z-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 rounded-t-full">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-in-out rounded-t-full" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Setup Provider Profile</h1>
            <p className="text-slate-500 font-medium">Earn by offering services in your area</p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                  {i}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= i ? 'text-indigo-600' : 'text-slate-300'}`}>
                  {i === 1 ? 'Personal' : i === 2 ? 'Service' : 'Portfolio'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group cursor-pointer">
                    <img src={formData.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-xl" alt="Avatar" />
                    <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white">
                       <i className="fa-solid fa-camera"></i>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-black text-slate-400 uppercase tracking-widest">Profile Photo *</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      placeholder="Enter your name"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Your Area *</label>
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2 relative">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Select Service Category *</label>
                  <div className="relative">
                    <select 
                      name="selectedCategory"
                      required
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold bg-white text-slate-900 appearance-none pr-12 cursor-pointer shadow-sm"
                      value={formData.selectedCategory}
                      onChange={handleInputChange}
                    >
                      <option value="" className="text-slate-400">Choose a service...</option>
                      {PREDEFINED_SERVICES.map(s => <option key={s} value={s} className="text-slate-900">{s}</option>)}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <i className="fa-solid fa-chevron-down"></i>
                    </div>
                  </div>
                </div>

                {formData.selectedCategory === 'Other' && (
                  <div className="space-y-2 animate-slideDown">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Specify your service *</label>
                    <input 
                      type="text" 
                      name="customService"
                      required 
                      placeholder="e.g. Yoga Instructor"
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400"
                      value={formData.customService}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Rate (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">₹</span>
                      <input 
                        type="number" 
                        name="rate"
                        required 
                        placeholder="0.00"
                        className="w-full pl-10 pr-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400"
                        value={formData.rate || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Unit</label>
                    <input 
                      type="text" 
                      name="rateUnit"
                      readOnly
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-600 outline-none font-black uppercase text-xs"
                      value={formData.rateUnit}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-widest px-1">Expertise Description *</label>
                  <textarea 
                    name="description"
                    required 
                    rows={4}
                    placeholder="Describe your skills, previous experience, and what makes your service stand out..."
                    className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 outline-none transition-all font-bold text-slate-900 resize-none shadow-sm placeholder:text-slate-400 bg-white"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2 mb-6">
                  <h3 className="text-xl font-black text-slate-900">Work Samples</h3>
                  <p className="text-sm text-slate-500">Showcase your skills with clear photos of your work or documents.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {portfolio.map((img, idx) => (
                    <div key={idx} className="relative group aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                      <img src={img} className="w-full h-full object-cover" alt="Sample" />
                      <button 
                        type="button"
                        onClick={() => removePortfolioItem(idx)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <i className="fa-solid fa-xmark text-xs"></i>
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={addPortfolioItem}
                    className="aspect-[3/4] rounded-2xl border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300 hover:border-indigo-200 hover:text-indigo-400 hover:bg-indigo-50/30 transition-all group"
                  >
                    <i className="fa-solid fa-plus text-2xl group-hover:scale-110 transition-all"></i>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Add Sample</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <button 
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-5 rounded-2xl border-2 border-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                >
                  Back
                </button>
              )}
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.97]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-sm">
                      {step === 3 ? 'Publish Profile' : 'Next Step'}
                    </span>
                    <i className="fa-solid fa-arrow-right"></i>
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

export default ProfileSetupView;
