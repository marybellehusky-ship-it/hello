
export type UserRole = 'client' | 'provider';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  location: string;
  rating: number;
  reviewsCount: number;
  isPhoneVerified: boolean;
  isAadharVerified: boolean;
  phoneNumber?: string;
  aadharNumber?: string;
  desiredServices?: string[];
  bio?: string;
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  rate: number;
  rateUnit: string; // Dynamic unit like 'page', 'month', 'hour'
  images: string[];
  provider: User;
  distanceKm: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Conversation {
  id: string;
  participants: [string, string];
  serviceId: string;
  messages: Message[];
  lastMessage?: string;
  step: 'availability' | 'unlock-request' | 'payment' | 'chat';
  availabilityResponse?: 'yes' | 'no';
  clientAgreedToUnlock: boolean;
  providerAgreedToUnlock: boolean;
  clientPaid: boolean;
  providerPaid: boolean;
  isUnlocked: boolean;
}

export interface AppState {
  currentUser: User;
  services: Service[];
  conversations: Conversation[];
  activeView: 'role-selection' | 'verification' | 'profile-setup' | 'client-setup' | 'browse' | 'inbox' | 'profile' | 'service-detail' | 'edit-profile';
  selectedServiceId?: string;
  selectedConversationId?: string;
  isLoggedIn: boolean;
  pendingRole?: UserRole;
}
