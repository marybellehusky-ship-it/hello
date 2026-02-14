
import React, { useState, useMemo } from 'react';
import { AppState, Service, Conversation, Message, UserRole, User } from './types';
import { CURRENT_USER, MOCK_SERVICES } from './constants';
import { getSimulatedProviderResponse } from './services/geminiService';

// Sub-components
import Sidebar from './components/Sidebar';
import BrowseView from './components/BrowseView';
import ServiceDetailView from './components/ServiceDetailView';
import InboxView from './components/InboxView';
import ProfileView from './components/ProfileView';
import VerificationView from './components/VerificationView';
import ProfileSetupView from './components/ProfileSetupView';
import RoleSelectionView from './components/RoleSelectionView';
import ClientSetupView from './components/ClientSetupView';
import EditProfileView from './components/EditProfileView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentUser: CURRENT_USER,
    services: MOCK_SERVICES,
    conversations: [],
    activeView: 'role-selection',
    isLoggedIn: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setState(prev => ({ ...prev, pendingRole: role, activeView: 'verification' }));
  };

  const handleVerificationComplete = (phone: string, aadhar: string) => {
    const nextView = state.pendingRole === 'provider' ? 'profile-setup' : 'client-setup';
    setState(prev => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        role: prev.pendingRole || 'client',
        isPhoneVerified: true,
        isAadharVerified: true,
        phoneNumber: phone,
        aadharNumber: aadhar
      },
      activeView: nextView
    }));
  };

  const handleClientSetupComplete = (data: { name: string, desiredServices: string[] }) => {
    setState(prev => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        name: data.name,
        desiredServices: data.desiredServices
      },
      isLoggedIn: true,
      activeView: 'browse'
    }));
  };

  const handleProfileSetupComplete = (profileData: {
    name: string;
    address: string;
    service: string;
    rate: number;
    rateUnit: string;
    avatar: string;
    description: string;
    portfolio: string[];
  }) => {
    const newUser: User = {
      ...state.currentUser,
      name: profileData.name,
      location: profileData.address,
      avatar: profileData.avatar,
      bio: profileData.description
    };

    const newService: Service = {
      id: `s_new_${Date.now()}`,
      providerId: newUser.id,
      title: profileData.service,
      description: profileData.description,
      category: 'General', 
      rate: profileData.rate,
      rateUnit: profileData.rateUnit,
      images: profileData.portfolio.length > 0 ? profileData.portfolio : ['https://picsum.photos/seed/default/600/400'],
      provider: newUser,
      distanceKm: 0
    };

    setState(prev => ({
      ...prev,
      currentUser: newUser,
      services: [newService, ...prev.services],
      isLoggedIn: true,
      activeView: 'browse'
    }));
  };

  const handleEditProfileComplete = (updatedData: {
    name: string;
    address: string;
    avatar: string;
    bio: string;
  }) => {
    setState(prev => ({
      ...prev,
      currentUser: {
        ...prev.currentUser,
        name: updatedData.name,
        location: updatedData.address,
        avatar: updatedData.avatar,
        bio: updatedData.bio
      },
      activeView: 'profile'
    }));
  };

  const filteredServices = useMemo(() => {
    return state.services.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [state.services, searchQuery, categoryFilter]);

  const handleSelectService = (id: string) => {
    setState(prev => ({ ...prev, activeView: 'service-detail', selectedServiceId: id }));
  };

  const handleStartChat = (serviceId: string) => {
    const service = state.services.find(s => s.id === serviceId);
    if (!service) return;

    let existingConv = state.conversations.find(c => 
      c.participants.includes(service.providerId) && c.serviceId === serviceId
    );

    if (!existingConv) {
      existingConv = {
        id: `conv_${Date.now()}`,
        participants: [state.currentUser.id, service.providerId],
        serviceId: serviceId,
        messages: [],
        lastMessage: 'Negotiation started',
        step: 'availability',
        clientAgreedToUnlock: false,
        providerAgreedToUnlock: false,
        clientPaid: false,
        providerPaid: false,
        isUnlocked: false
      };
      setState(prev => ({
        ...prev,
        conversations: [...prev.conversations, existingConv!],
        activeView: 'inbox',
        selectedConversationId: existingConv!.id
      }));
    } else {
      setState(prev => ({
        ...prev,
        activeView: 'inbox',
        selectedConversationId: existingConv!.id
      }));
    }
  };

  const updateConversationState = (convId: string, updates: Partial<Conversation>) => {
    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c => 
        c.id === convId ? { ...c, ...updates } : c
      )
    }));
  };

  const handleSendMessage = async (convId: string, text: string) => {
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: state.currentUser.id,
      text,
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      conversations: prev.conversations.map(c => 
        c.id === convId ? { ...c, messages: [...c.messages, newMessage], lastMessage: text } : c
      )
    }));

    const conv = state.conversations.find(c => c.id === convId);
    const service = state.services.find(s => s.id === conv?.serviceId);
    if (conv && service && conv.isUnlocked) {
      const history = conv.messages.map(m => ({
        role: m.senderId === state.currentUser.id ? 'user' : 'model',
        content: m.text
      }));
      
      const aiText = await getSimulatedProviderResponse(
        service.provider.name,
        service.title,
        text,
        history
      );

      const aiMessage: Message = {
        id: `msg_ai_${Date.now()}`,
        senderId: service.providerId,
        text: aiText,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        conversations: prev.conversations.map(c => 
          c.id === convId ? { ...c, messages: [...c.messages, aiMessage], lastMessage: aiText } : c
        )
      }));
    }
  };

  const isAuthView = ['role-selection', 'verification', 'profile-setup', 'client-setup'].includes(state.activeView);

  if (!state.isLoggedIn && !isAuthView) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 font-bold">Session loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {state.activeView === 'role-selection' ? (
        <RoleSelectionView onSelect={handleRoleSelect} />
      ) : state.activeView === 'verification' ? (
        <VerificationView onComplete={handleVerificationComplete} />
      ) : state.activeView === 'profile-setup' ? (
        <ProfileSetupView onComplete={handleProfileSetupComplete} />
      ) : state.activeView === 'client-setup' ? (
        <ClientSetupView onComplete={handleClientSetupComplete} />
      ) : (
        <>
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-sm">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <h1 className="text-xl font-black text-indigo-600 flex items-center gap-2">
              <i className="fa-solid fa-handshake-angle"></i>
              LocalAssist
            </h1>
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
               <img src={state.currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </header>

          <Sidebar 
            activeView={state.activeView} 
            onNavigate={(view) => {
              setState(prev => ({ ...prev, activeView: view }));
              setIsMobileMenuOpen(false);
            }}
            role={state.currentUser.role}
            onToggleRole={() => setState(prev => ({ ...prev, currentUser: { ...prev.currentUser, role: prev.currentUser.role === 'client' ? 'provider' : 'client' }}))}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-4 md:p-8">
              {state.activeView === 'browse' && (
                <BrowseView 
                  services={filteredServices} 
                  onSelect={handleSelectService}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                />
              )}
              {state.activeView === 'service-detail' && state.selectedServiceId && (
                <ServiceDetailView 
                  service={state.services.find(s => s.id === state.selectedServiceId)!}
                  onBack={() => setState(p => ({ ...p, activeView: 'browse' }))}
                  onChat={handleStartChat}
                />
              )}
              {state.activeView === 'inbox' && (
                <InboxView 
                  conversations={state.conversations}
                  services={state.services}
                  currentUser={state.currentUser}
                  selectedConversationId={state.selectedConversationId}
                  onSelectConversation={(id) => setState(p => ({ ...p, selectedConversationId: id }))}
                  onSendMessage={handleSendMessage}
                  onUpdateConversation={updateConversationState}
                />
              )}
              {state.activeView === 'profile' && (
                <ProfileView 
                  user={state.currentUser} 
                  onToggleRole={() => setState(prev => ({ ...prev, currentUser: { ...prev.currentUser, role: prev.currentUser.role === 'client' ? 'provider' : 'client' }}))}
                  onEdit={() => setState(prev => ({ ...prev, activeView: 'edit-profile' }))}
                />
              )}
              {state.activeView === 'edit-profile' && (
                <EditProfileView 
                  user={state.currentUser}
                  onBack={() => setState(prev => ({ ...prev, activeView: 'profile' }))}
                  onComplete={handleEditProfileComplete}
                />
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default App;
