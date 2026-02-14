
import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Service, User, Message } from '../types';

interface InboxViewProps {
  conversations: Conversation[];
  services: Service[];
  currentUser: User;
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (convId: string, text: string) => void;
  onUpdateConversation: (convId: string, updates: Partial<Conversation>) => void;
}

const InboxView: React.FC<InboxViewProps> = ({ 
  conversations, services, currentUser, selectedConversationId, onSelectConversation, onSendMessage, onUpdateConversation 
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === selectedConversationId);
  const activeService = services.find(s => s.id === activeConv?.serviceId);
  const partnerId = activeConv?.participants.find(p => p !== currentUser.id);
  
  const isUserProvider = activeService?.providerId === currentUser.id;
  const partner = isUserProvider 
    ? { name: "Client", avatar: "https://i.pravatar.cc/150?u=client" } 
    : activeService?.provider;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages.length, activeConv?.step, activeConv?.isUnlocked]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConversationId) return;
    onSendMessage(selectedConversationId, inputText);
    setInputText('');
  };

  const addSystemMessage = (text: string) => {
    if (!activeConv) return;
    const msg: Message = { id: `sys_${Date.now()}`, senderId: 'system', text, timestamp: Date.now(), isSystem: true };
    onUpdateConversation(activeConv.id, { messages: [...activeConv.messages, msg] });
  };

  const handleClientAvailabilityRequest = () => {
    if (!activeConv) return;
    addSystemMessage("Client asked: Are you available?");
    onUpdateConversation(activeConv.id, { step: 'availability' });
  };

  const handleProviderAvailabilityResponse = (response: 'yes' | 'no') => {
    if (!activeConv) return;
    addSystemMessage(`Provider answered: ${response === 'yes' ? 'Yes, I am available.' : 'No, I am currently busy.'}`);
    if (response === 'yes') {
      onUpdateConversation(activeConv.id, { availabilityResponse: 'yes', step: 'unlock-request' });
    } else {
      onUpdateConversation(activeConv.id, { availabilityResponse: 'no' });
    }
  };

  const handleClientUnlockRequest = () => {
    if (!activeConv) return;
    onUpdateConversation(activeConv.id, { clientAgreedToUnlock: true });
    addSystemMessage("Client: Let's unlock inbox by transferring money.");
  };

  const handleProviderUnlockResponse = (agreed: boolean) => {
    if (!activeConv) return;
    if (agreed) {
      onUpdateConversation(activeConv.id, { providerAgreedToUnlock: true, step: 'payment' });
      addSystemMessage("Provider agreed. Both parties must pay 10% fee to unlock.");
    } else {
      addSystemMessage("Provider declined the unlock request.");
    }
  };

  const handlePayment = () => {
    if (!activeConv) return;
    const updates = isUserProvider ? { providerPaid: true } : { clientPaid: true };
    onUpdateConversation(activeConv.id, updates);
    addSystemMessage(`${isUserProvider ? 'Provider' : 'Client'} completed the 10% fee payment.`);
    
    setTimeout(() => {
        const checkConv = conversations.find(c => c.id === activeConv.id);
        const clientPaid = updates.clientPaid || (checkConv && checkConv.clientPaid);
        const providerPaid = updates.providerPaid || (checkConv && checkConv.providerPaid);
        
        if (clientPaid && providerPaid) {
          onUpdateConversation(activeConv.id, { isUnlocked: true, step: 'chat' });
          addSystemMessage("Payment Verified. Inbox is now UNLOCKED.");
        }
    }, 500);
  };

  useEffect(() => {
      if (!activeConv || activeConv.isUnlocked || isUserProvider) return;
      if (activeConv.messages.some(m => m.text.includes("Are you available?")) && !activeConv.availabilityResponse) {
          const timer = setTimeout(() => handleProviderAvailabilityResponse('yes'), 2000);
          return () => clearTimeout(timer);
      }
      if (activeConv.clientAgreedToUnlock && !activeConv.providerAgreedToUnlock) {
          const timer = setTimeout(() => handleProviderUnlockResponse(true), 2000);
          return () => clearTimeout(timer);
      }
      if (activeConv.clientPaid && !activeConv.providerPaid) {
          const timer = setTimeout(() => {
            onUpdateConversation(activeConv.id, { providerPaid: true, isUnlocked: true, step: 'chat' });
            addSystemMessage("Provider paid. Inbox is now UNLOCKED.");
          }, 3000);
          return () => clearTimeout(timer);
      }
  }, [activeConv?.messages.length, activeConv?.clientAgreedToUnlock, activeConv?.clientPaid]);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl animate-fadeIn">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/30 ${selectedConversationId && 'hidden md:flex'}`}>
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? conversations.map((conv) => {
            const service = services.find(s => s.id === conv.serviceId);
            const isProv = service?.providerId === currentUser.id;
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-4 flex gap-4 transition-all hover:bg-white border-b border-slate-50 relative group ${
                  selectedConversationId === conv.id ? 'bg-white shadow-sm ring-1 ring-slate-100' : ''
                }`}
              >
                <div className="relative">
                    <img src={isProv ? "https://i.pravatar.cc/150?u=client" : service?.provider.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-50" alt="" />
                    {!conv.isUnlocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <i className="fa-solid fa-lock text-[8px] text-white"></i>
                      </div>
                    )}
                </div>
                <div className="text-left flex-1 min-w-0 py-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-slate-900 truncate">{isProv ? "Client" : service?.provider.name}</p>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Now</span>
                  </div>
                  <p className="text-xs text-indigo-500 font-bold truncate tracking-tight">{service?.title}</p>
                </div>
                {selectedConversationId === conv.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>
                )}
              </button>
            );
          }) : (
            <div className="p-10 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                <i className="fa-solid fa-inbox text-2xl"></i>
              </div>
              <p className="text-sm font-bold text-slate-400">No active conversations</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat View */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedConversationId && 'hidden md:flex'}`}>
        {activeConv && partner ? (
          <>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => onSelectConversation('')} className="md:hidden text-slate-400 p-2 hover:bg-slate-50 rounded-xl transition-all">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="relative">
                  <img src={partner.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none mb-1">{isUserProvider ? "Client" : partner.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${activeConv.isUnlocked ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                      {activeConv.isUnlocked ? 'Verified Secure' : 'Protected Mode'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                  <i className="fa-solid fa-phone text-xs"></i>
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                  <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/10">
              {activeConv.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : (msg.senderId === currentUser.id ? 'justify-end' : 'justify-start')} animate-fadeIn`}>
                  {msg.isSystem ? (
                    <div className="bg-white/80 text-slate-500 text-[9px] font-black uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border border-slate-100 shadow-sm backdrop-blur-sm">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div className={`px-5 py-3 rounded-[1.5rem] text-sm font-medium shadow-sm transition-all ${
                        msg.senderId === currentUser.id 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[8px] font-bold text-slate-300 uppercase px-2 ${msg.senderId === currentUser.id ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Verification Workflow Controls */}
            {!activeConv.isUnlocked ? (
              <div className="p-6 border-t border-slate-100 bg-white space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] animate-slideUp">
                <div className="flex items-center gap-3 justify-center">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                    <i className="fa-solid fa-shield-halved text-indigo-400"></i>
                    Verification Flow
                  </p>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                {/* Unified Workflow Rendering */}
                {activeConv.step === 'availability' && (
                  <div className="animate-fadeIn">
                    {!isUserProvider ? (
                      <button 
                        onClick={handleClientAvailabilityRequest}
                        className="w-full bg-slate-50 hover:bg-indigo-600 hover:text-white group border-2 border-slate-100 hover:border-indigo-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                      >
                        Check Availability
                        <i className="fa-solid fa-paper-plane text-indigo-400 group-hover:text-white transition-colors"></i>
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleProviderAvailabilityResponse('yes')}
                          className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                        >
                          I'm Available
                        </button>
                        <button 
                          onClick={() => handleProviderAvailabilityResponse('no')}
                          className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                          Busy Now
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeConv.step === 'unlock-request' && (
                  <div className="animate-fadeIn">
                    {!isUserProvider ? (
                      <button 
                        onClick={handleClientUnlockRequest}
                        disabled={activeConv.clientAgreedToUnlock}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeConv.clientAgreedToUnlock ? 'bg-green-50 text-green-600 border-2 border-green-100' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700'}`}
                      >
                        {activeConv.clientAgreedToUnlock ? 'Awaiting Provider' : "Request Unlock"}
                        <i className={`fa-solid ${activeConv.clientAgreedToUnlock ? 'fa-spinner fa-spin' : 'fa-lock-open'}`}></i>
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client is ready to proceed</p>
                        <div className="flex gap-3">
                            <button onClick={() => handleProviderUnlockResponse(true)} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Accept Request</button>
                            <button onClick={() => handleProviderUnlockResponse(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Decline</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeConv.step === 'payment' && (
                  <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] space-y-6 shadow-2xl animate-fadeIn border-t border-white/10">
                    <div className="text-center">
                      <h4 className="font-black uppercase tracking-widest text-xs mb-1">Security Deposit</h4>
                      <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase">10% Platform Connection Fee</p>
                    </div>

                    <div className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10">
                      <div>
                        <p className="text-[8px] font-black text-indigo-400 uppercase mb-1">Your Share</p>
                        <p className="text-2xl font-black">₹{((activeService?.rate || 0) * 0.1).toFixed(0)}</p>
                      </div>
                      <div className="text-right">
                         <div className="px-3 py-1 bg-indigo-500 rounded-lg text-[8px] font-black uppercase mb-1">Secure</div>
                         <p className="text-[9px] text-slate-400 font-medium italic">Ref-ID: #LA{Math.floor(Math.random()*10000)}</p>
                      </div>
                    </div>

                    <button 
                      onClick={handlePayment}
                      disabled={(isUserProvider && activeConv.providerPaid) || (!isUserProvider && activeConv.clientPaid)}
                      className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                        ((isUserProvider && activeConv.providerPaid) || (!isUserProvider && activeConv.clientPaid))
                        ? 'bg-green-500 text-white' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-900/40'
                      }`}
                    >
                      {((isUserProvider && activeConv.providerPaid) || (!isUserProvider && activeConv.clientPaid)) ? (
                        <>VERIFYING PAYMENT <i className="fa-solid fa-spinner fa-spin"></i></>
                      ) : (
                        <>PAY NOW VIA UPI <i className="fa-solid fa-arrow-right"></i></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)] sticky bottom-0">
                <div className="flex gap-3">
                  <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500">
                       <i className="fa-solid fa-feather-pointed"></i>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 text-slate-700 font-bold transition-all text-sm"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 transition-all active:scale-90"
                  >
                    <i className="fa-solid fa-paper-plane text-lg"></i>
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50/10">
            <div className="text-center animate-fadeIn">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border border-slate-50 relative">
                <i className="fa-solid fa-comments text-4xl text-indigo-50/50"></i>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                   <i className="fa-solid fa-lock text-xs"></i>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Private Connections</h3>
              <p className="max-w-[280px] mx-auto text-sm text-slate-500 font-medium leading-relaxed">
                Connect safely. All conversations are protected by our verification layer.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxView;
