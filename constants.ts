
import { Service, User } from './types';

export const CURRENT_USER: User = {
  id: 'user_1',
  name: 'Alex Johnson',
  avatar: 'https://i.pravatar.cc/150?u=user_1',
  role: 'client',
  location: 'Downtown, Springfield',
  rating: 4.8,
  reviewsCount: 12,
  isPhoneVerified: false,
  isAadharVerified: false,
  bio: "Looking for reliable help with academic assignments and home maintenance."
};

export const MOCK_SERVICES: Service[] = [
  {
    id: 's_1',
    providerId: 'p_1',
    title: 'Professional Assignment Writer',
    category: 'Education',
    description: 'I specialize in academic writing, essays, and technical reports. Fast turnaround and 100% original content guaranteed. Expert in APA/MLA citations.',
    rate: 250,
    rateUnit: 'page',
    images: ['https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800'],
    distanceKm: 2.5,
    provider: {
      id: 'p_1',
      name: 'Sarah Miller',
      avatar: 'https://i.pravatar.cc/150?u=p_1',
      role: 'provider',
      location: '2.5 miles away',
      rating: 4.9,
      reviewsCount: 84,
      isPhoneVerified: true,
      isAadharVerified: true
    }
  },
  {
    id: 's_2',
    providerId: 'p_2',
    title: 'Expert Home Repair & Plumbing',
    category: 'Home Service',
    description: 'Licensed plumber with 10 years experience. Handling leaky faucets, toilet repairs, and emergency drain cleaning in the Springfield area.',
    rate: 800,
    rateUnit: 'visit',
    images: ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800'],
    distanceKm: 0.8,
    provider: {
      id: 'p_2',
      name: 'Mike Hammer',
      avatar: 'https://i.pravatar.cc/150?u=p_2',
      role: 'provider',
      location: '0.8 miles away',
      rating: 4.7,
      reviewsCount: 156,
      isPhoneVerified: true,
      isAadharVerified: true
    }
  },
  {
    id: 's_3',
    providerId: 'p_3',
    title: 'Portrait & Event Photographer',
    category: 'Creative',
    description: 'Capture your best moments! Specializing in graduation shoots, family portraits, and small events. Full editing included in the price.',
    rate: 1500,
    rateUnit: 'event',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'],
    distanceKm: 1.2,
    provider: {
      id: 'p_3',
      name: 'Elena Rios',
      avatar: 'https://i.pravatar.cc/150?u=p_3',
      role: 'provider',
      location: '1.2 miles away',
      rating: 5.0,
      reviewsCount: 42,
      isPhoneVerified: true,
      isAadharVerified: false
    }
  },
  {
    id: 's_4',
    providerId: 'p_4',
    title: 'Custom Woodwork & Carpentry',
    category: 'Home Service',
    description: 'Crafting bespoke furniture and fixing wooden fixtures. From door adjustments to custom shelving units, I deliver quality craftsmanship.',
    rate: 600,
    rateUnit: 'visit',
    images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800'],
    distanceKm: 1.5,
    provider: {
      id: 'p_4',
      name: 'David Wood',
      avatar: 'https://i.pravatar.cc/150?u=p_4',
      role: 'provider',
      location: '1.5 miles away',
      rating: 4.8,
      reviewsCount: 67,
      isPhoneVerified: true,
      isAadharVerified: true
    }
  },
  {
    id: 's_5',
    providerId: 'p_5',
    title: 'Deep Home Cleaning Service',
    category: 'Home Service',
    description: 'Thorough cleaning for houses and apartments. Eco-friendly products used. We cover kitchen, bathrooms, windows and floors.',
    rate: 2000,
    rateUnit: 'month',
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=800'],
    distanceKm: 4.2,
    provider: {
      id: 'p_5',
      name: 'Clean Team',
      avatar: 'https://i.pravatar.cc/150?u=p_5',
      role: 'provider',
      location: '4.2 miles away',
      rating: 4.6,
      reviewsCount: 213,
      isPhoneVerified: true,
      isAadharVerified: true
    }
  }
];
