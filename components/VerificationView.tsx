
import React, { useState, useEffect } from 'react';

interface VerificationViewProps {
  onComplete: (phone: string, aadhar: string) => void;
}

const VerificationView: React.FC<VerificationViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSentToast, setShowSentToast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Simulate API call for OTP sending or verification
    setTimeout(() => {
      setLoading(false);
      
      if (step === 1) {
        // Validation: 10 digits
        if (phone.length !== 10) {
          setError("Please enter a valid 10-digit mobile number.");
          triggerShake();
          return;
        }
        setShowSentToast(true);
        setStep(2);
        setResendTimer(30); // Start 30s countdown
        setTimeout(() => setShowSentToast(false), 3000);
      } else if (step === 2) {
        // Simulated failure for demonstration: If OTP is "000000", show error
        if (otp === '000000') {
          setError("Invalid OTP. Please check the code and try again.");
          triggerShake();
          return;
        }
        if (otp.length < 6) {
          setError("Please enter the full 6-digit code.");
          triggerShake();
          return;
        }
        setStep(3);
      } else if (step === 3) {
        // Validation: Aadhar must be 12 digits
        const cleanAadhar = aadhar.replace(/\s/g, '');
        if (cleanAadhar.length !== 12) {
          setError("Aadhar number must be 12 digits.");
          triggerShake();
          return;
        }
        // Simulated invalid Aadhar check
        if (cleanAadhar === '123412341234') {
          setError("Aadhar verification failed. Please provide a valid ID.");
          triggerShake();
          return;
        }
        onComplete(phone, aadhar);
      }
    }, 1200);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSentToast(true);
      setResendTimer(30);
      setError(null);
      setTimeout(() => setShowSentToast(false), 3000);
    }, 1000);
  };

  const handleBackToPhone = () => {
    setStep(1);
    setOtp('');
    setError(null);
    setShowSentToast(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-indigo-50/50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

      <div className={`max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white relative z-10 transition-transform duration-300 ${shake ? 'animate-shake' : ''}`}>
        <style>
          {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-8px); }
              75% { transform: translateX(8px); }
            }
            .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
          `}
        </style>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-in-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">LocalAssist</h1>
            <p className="text-slate-500 font-medium">Verified Local Marketplace</p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
            ))}
          </div>

          <form onSubmit={handleNext} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-inner">
                  <i className="fa-solid fa-mobile-screen-button text-3xl"></i>
                </div>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Phone Login</h2>
                  <p className="text-sm text-slate-500">We'll send an OTP to verify your account</p>
                </div>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black border-r border-slate-200 pr-3">+91</span>
                  <input 
                    type="tel" 
                    required 
                    autoFocus
                    placeholder="Enter Mobile Number"
                    className={`w-full pl-20 pr-4 py-5 rounded-[1.25rem] border-2 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold text-lg ${error ? 'border-red-400' : 'border-slate-100 focus:border-indigo-600'}`}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ''));
                      setError(null);
                    }}
                    maxLength={10}
                  />
                </div>
                {error && <p className="text-red-500 text-xs font-bold text-center animate-fadeIn">{error}</p>}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 mx-auto mb-6 shadow-inner">
                  <i className="fa-solid fa-shield-check text-3xl"></i>
                </div>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Verify Code</h2>
                  <p className="text-sm text-slate-500">Enter the 6-digit code sent to</p>
                  <p className="text-sm font-black text-slate-900">+91 {phone}</p>
                </div>

                {showSentToast && (
                  <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-green-100 animate-bounce">
                    <i className="fa-solid fa-circle-check"></i>
                    OTP Sent Successfully!
                  </div>
                )}

                <div className="flex justify-center mb-2">
                  <button 
                    type="button" 
                    onClick={handleBackToPhone}
                    className="text-[10px] text-indigo-600 font-black uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100/50 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-pen"></i>
                    Change Mobile Number
                  </button>
                </div>
                <input 
                  type="text" 
                  required 
                  maxLength={6}
                  placeholder="------"
                  className={`w-full px-4 py-5 rounded-[1.25rem] border-2 text-center text-3xl font-black tracking-[0.4em] focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-100 ${error ? 'border-red-400' : 'border-slate-100 focus:border-indigo-600'}`}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setError(null);
                  }}
                />
                {error && <p className="text-red-500 text-xs font-bold text-center animate-fadeIn">{error}</p>}
                
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    className={`text-xs font-bold transition-colors ${resendTimer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600'}`}
                  >
                    {resendTimer > 0 ? (
                      `Resend Code in ${resendTimer}s`
                    ) : (
                      <>Didn't receive it? <span className="text-indigo-600 underline">Resend Code</span></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="w-20 h-20 bg-purple-50 rounded-[2rem] flex items-center justify-center text-purple-600 mx-auto mb-6 shadow-inner">
                  <i className="fa-solid fa-id-card text-3xl"></i>
                </div>
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">Identity Check</h2>
                  <p className="text-sm text-slate-500">Secure your profile with Aadhar</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Aadhar Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="XXXX XXXX XXXX"
                    className={`w-full px-5 py-5 rounded-[1.25rem] border-2 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-lg tracking-widest ${error ? 'border-red-400' : 'border-slate-100 focus:border-indigo-600'}`}
                    value={aadhar}
                    onChange={(e) => {
                      // Formatting Aadhar into 4-digit groups
                      const val = e.target.value.replace(/\D/g, '');
                      const groups = val.match(/.{1,4}/g);
                      setAadhar(groups ? groups.join(' ') : val);
                      setError(null);
                    }}
                    maxLength={14}
                  />
                </div>
                {error && <p className="text-red-500 text-xs font-bold text-center animate-fadeIn">{error}</p>}
                
                <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
                  <i className="fa-solid fa-circle-info text-slate-400 mt-1"></i>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                    We value your privacy. Your Aadhar data is used only for identity verification to prevent fraud and ensure community safety. (Try "1234 1234 1234" to test failure feedback)
                  </p>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.25rem] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.97] ${loading ? 'opacity-80' : ''}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-sm">
                    {step === 1 ? 'Send OTP' : (step === 3 ? 'Finish Verification' : 'Verify & Continue')}
                  </span>
                  <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationView;
