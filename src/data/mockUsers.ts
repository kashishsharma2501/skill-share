import type { User, AuthUser } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Aditi Singh',
    email: 'aditi.singh@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi&backgroundColor=ffdfbf',
    location: 'Gurdev Nagar, Ludhiana',
    city: 'Ludhiana',
    role: 'learner',
    joinedAt: '2026-04-10',
    isVerified: true,
    bio: 'Curious learner exploring creative and tech skills in Ludhiana. Interested in photography, design, and coding.',
    languages: ['Hindi', 'Punjabi', 'English'],
  },
  {
    id: 'u2',
    name: 'Simran Sharma',
    email: 'simran.sharma@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran&backgroundColor=b6e3f4',
    location: 'Model Town, Ludhiana',
    city: 'Ludhiana',
    role: 'provider',
    joinedAt: '2023-03-15',
    isVerified: true,
    bio: 'Photographer and visual educator based in Ludhiana.',
    languages: ['Hindi', 'Punjabi', 'English'],
  },
];

export const mockAuthUser: AuthUser = {
  id: 'u1',
  name: 'Aditi Singh',
  email: 'aditi.singh@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi&backgroundColor=ffdfbf',
  role: 'learner',
  city: 'Ludhiana',
  isAuthenticated: true,
};

export const mockProviderAuthUser: AuthUser = {
  id: 'u2',
  name: 'Simran Sharma',
  email: 'simran.sharma@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran&backgroundColor=b6e3f4',
  role: 'provider',
  city: 'Ludhiana',
  isAuthenticated: true,
};

export const mockAdminUser: AuthUser = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@skillsharelocal.in',
  role: 'admin',
  city: 'Chandigarh',
  isAuthenticated: true,
};
