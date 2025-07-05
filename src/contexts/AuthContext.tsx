import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import supabase from '../supabaseClient'

// 🧠 Define the correct shape based on Supabase response
interface User {
  id: string
  email: string
  user_metadata?: {
    username?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Supabase login error:', error.message)
      throw new Error(error.message)
    }
    setUser(data.user as User)
  }

  const signup = async (username: string, email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: window.location.origin + '/login'  // 👈 optional
    }
  });

  if (error) {
    console.error('Supabase signup error:', error.message);
    throw new Error(error.message);
  }

  // Don't force set user if it's null; wait for confirmation
  if (!data.user) {
    throw new Error("Please check your email to confirm your account.");
  }

  setUser(data.user as User);
};


  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Supabase logout error:', error.message)
    }
    setUser(null)
  }

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting user:', error.message)
        setUser(null)
      } else {
        setUser(data.user as User)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
