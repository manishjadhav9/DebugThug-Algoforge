import { useState, useEffect } from 'react'
import { userService, User } from '@/lib/services/user-service'

// Define hook return type
interface UseUserReturn {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: (email: string) => Promise<User>
  logout: () => void
  setCurrentUser: (userId: string) => Promise<User | null> // For demo/testing
}

/**
 * Hook for accessing the current user
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // On mount, check for existing logged in user
  useEffect(() => {
    try {
      const currentUser = userService.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Login function
  const login = async (email: string): Promise<User> => {
    setIsLoading(true)
    setError(null)
    
    try {
      // For demo purposes, if email is empty, use demo accounts
      if (!email) {
        email = 'tenant@example.com' // Default to tenant for demo
      }
      
      const loggedInUser = await userService.login(email)
      setUser(loggedInUser)
      return loggedInUser
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  // Logout function
  const logout = () => {
    userService.logout()
    setUser(null)
  }
  
  // Set current user for demo/testing
  const setCurrentUser = async (userId: string): Promise<User | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const user = await userService.setCurrentUser(userId)
      setUser(user)
      return user
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }
  
  return {
    user,
    isLoading,
    error,
    login,
    logout,
    setCurrentUser
  }
} 