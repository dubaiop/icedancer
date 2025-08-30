import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../../services/authService'
import subscriptionService from '../../services/subscriptionService'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      loadUserSubscription(currentUser.id)
    }
    setLoading(false)
  }, [])

  const loadUserSubscription = async (userId) => {
    try {
      const userSub = subscriptionService.getUserSubscription(userId)
      setSubscription(userSub)
    } catch (error) {
      console.error('Failed to load subscription:', error)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const result = await authService.login(credentials)
      setUser(result.user)
      await loadUserSubscription(result.user.id)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const result = await authService.register(userData)
      setUser(result.user)
      
      // Create free subscription for new users
      const freeSub = subscriptionService.createDemoSubscription(result.user.id, 'free')
      setSubscription(freeSub)
      
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setSubscription(null)
  }

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await authService.updateProfile(updates)
      setUser(updatedUser)
      return updatedUser
    } catch (error) {
      throw error
    }
  }

  const upgradeSubscription = async (planId, paymentMethod) => {
    try {
      setLoading(true)
      
      // Process payment
      const newSubscription = await subscriptionService.processPayment(planId, {
        ...paymentMethod,
        userId: user.id
      })
      
      // Update user subscription tier
      const updatedUser = await authService.upgradeSubscription(planId)
      
      setUser(updatedUser)
      setSubscription(newSubscription)
      
      return { user: updatedUser, subscription: newSubscription }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    try {
      if (subscription) {
        await subscriptionService.cancelSubscription(subscription.id)
        const updatedUser = await authService.upgradeSubscription('free')
        setUser(updatedUser)
        setSubscription(null)
      }
    } catch (error) {
      throw error
    }
  }

  const hasPermission = (permission) => {
    return authService.hasPermission(permission)
  }

  const hasSubscription = (tier) => {
    return authService.hasSubscription(tier)
  }

  const canPerformAction = (action) => {
    const currentUsage = subscriptionService.getCurrentMonthUsage(user?.id)
    return subscriptionService.canPerformAction(
      user?.subscriptionTier || 'free',
      action,
      currentUsage[action] || 0
    )
  }

  const trackUsage = (action, metadata) => {
    if (user) {
      return subscriptionService.trackUsage(user.id, action, metadata)
    }
  }

  const getUsageStats = () => {
    if (!user) return {}
    return subscriptionService.getCurrentMonthUsage(user.id)
  }

  const getUpgradeRecommendation = () => {
    if (!user) return null
    const usage = getUsageStats()
    return subscriptionService.getUpgradeRecommendation(user.subscriptionTier, usage)
  }

  const value = {
    user,
    subscription,
    loading,
    login,
    register,
    logout,
    updateProfile,
    upgradeSubscription,
    cancelSubscription,
    hasPermission,
    hasSubscription,
    canPerformAction,
    trackUsage,
    getUsageStats,
    getUpgradeRecommendation,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
