
import React, { useState } from 'react';

interface ClientSetupProps {
  onComplete: (data: { name: string, desiredServices: string[] }) => void;
}

const SERVICE_OPTIONS = ['Assignment Writing', 'Plumbing', 'Carpenter', 'Household Chores', 'Photography', 'Gardening'];

const ClientSetupView: React.FC<ClientSetupProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleService = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    setTimeout(() => onComplete({ name, desiredServices: selected }), 1000);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-indigo-50/50 p-6 relative overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl border border-white relative z-10 animate-fadeIn">
        <div className="text-center space-y-2 mb-10">
           <h2 className="text-3xl font-black text-slate-900">Finish Profile</h2>
           <p className="text-slate-500 font-medium">Just a few details to get you started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Your Full Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Alex Johnson"
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all font-bold"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Services you desire</label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${selected.includes(s) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !name}
            className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Start Exploring'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientSetupView;
