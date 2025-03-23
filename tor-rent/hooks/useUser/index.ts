import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  userType: 'tenant' | 'landlord';
  credScore?: number;
  profileImage?: string;
}

// This is a mock implementation for development purposes
// In a real application, this would fetch user data from an API or auth provider
export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll just return mock data
        const mockUser: User = {
          id: 'user-1',
          name: 'Arjun Reddy',
          email: 'arjun.reddy@example.com',
          walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
          userType: 'landlord',
          credScore: 750,
          profileImage: '/avatars/landlord.jpg',
        };
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setUser(mockUser);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    setUser,
  };
} 