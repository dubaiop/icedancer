import { v4 as uuidv4 } from 'uuid'
import Cookies from 'js-cookie'

// Authentication service for user management
// In production, this would connect to a backend API
class AuthService {
  constructor() {
    this.storageKey = 'aiIceDancer_users'
    this.sessionKey = 'aiIceDancer_session'
    this.currentUser = null
    
    // Initialize with demo users for testing
    this.initializeDemoUsers()
    
    // Check for existing session
    this.checkExistingSession()
  }

  // Initialize demo users for testing
  initializeDemoUsers() {
    const existingUsers = this.getAllUsers()
    if (existingUsers.length === 0) {
      const demoUsers = [
        {
          id: uuidv4(),
          email: 'demo@icedancer.ai',
          password: 'demo123', // In production, this would be hashed
          firstName: 'Demo',
          lastName: 'User',
          userType: 'athlete',
          subscriptionTier: 'free',
          createdAt: new Date().toISOString(),
          profile: {
            level: 'intermediate',
            discipline: 'ice_dance',
            goals: ['improve_technique', 'competition_prep'],
            coachId: null
          }
        },
        {
          id: uuidv4(),
          email: 'coach@icedancer.ai', 
          password: 'coach123',
          firstName: 'Coach',
          lastName: 'Expert',
          userType: 'coach',
          subscriptionTier: 'pro',
          createdAt: new Date().toISOString(),
          profile: {
            certification: 'ISU_certified',
            experience: 15,
            specialties: ['ice_dance', 'pair_skating'],
            athletes: []
          }
        }
      ]
      
      localStorage.setItem(this.storageKey, JSON.stringify(demoUsers))
    }
  }

  // Check for existing session on service initialization
  checkExistingSession() {
    const sessionData = Cookies.get(this.sessionKey)
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        if (this.isValidSession(session)) {
          this.currentUser = this.getUserById(session.userId)
        } else {
          this.clearSession()
        }
      } catch (error) {
        console.error('Invalid session data:', error)
        this.clearSession()
      }
    }
  }

  // Validate session token and expiry
  isValidSession(session) {
    if (!session.userId || !session.token || !session.expiresAt) {
      return false
    }
    
    const now = new Date()
    const expires = new Date(session.expiresAt)
    return now < expires
  }

  // User registration
  async register(userData) {
    try {
      const { email, password, firstName, lastName, userType = 'athlete' } = userData
      
      // Validate input
      if (!email || !password || !firstName || !lastName) {
        throw new Error('All fields are required')
      }
      
      if (!this.isValidEmail(email)) {
        throw new Error('Invalid email format')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      // Check if user already exists
      if (this.getUserByEmail(email)) {
        throw new Error('User with this email already exists')
      }
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        email: email.toLowerCase(),
        password: password, // In production, hash this
        firstName,
        lastName,
        userType,
        subscriptionTier: 'free',
        createdAt: new Date().toISOString(),
        profile: userType === 'athlete' ? {
          level: 'beginner',
          discipline: 'ice_dance',
          goals: [],
          coachId: null
        } : {
          certification: '',
          experience: 0,
          specialties: [],
          athletes: []
        }
      }
      
      // Save user
      const users = this.getAllUsers()
      users.push(newUser)
      localStorage.setItem(this.storageKey, JSON.stringify(users))
      
      // Auto-login after registration
      return this.login({ email, password })
      
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  // User login
  async login(credentials) {
    try {
      const { email, password } = credentials
      
      if (!email || !password) {
        throw new Error('Email and password are required')
      }
      
      // Find user
      const user = this.getUserByEmail(email.toLowerCase())
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      // Verify password (in production, compare hashed passwords)
      if (user.password !== password) {
        throw new Error('Invalid email or password')
      }
      
      // Create session
      const session = {
        userId: user.id,
        token: uuidv4(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }
      
      // Store session
      Cookies.set(this.sessionKey, JSON.stringify(session), { expires: 7 })
      this.currentUser = user
      
      // Update last login
      this.updateUser(user.id, { lastLoginAt: new Date().toISOString() })
      
      return {
        user: this.sanitizeUser(user),
        token: session.token,
        expiresAt: session.expiresAt
      }
      
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  // User logout
  logout() {
    this.clearSession()
    this.currentUser = null
    return true
  }

  // Get coach athletes
  getCoachAthletes(coachId) {
    const users = this.getAllUsers()
    return users.filter(user => 
      user.userType === 'athlete' && 
      user.profile?.coachId === coachId
    ).map(user => this.sanitizeUser(user))
  }

  // Get athlete coaches  
  getAthleteCoaches(athleteId) {
    const athlete = this.getUserById(athleteId)
    if (!athlete || athlete.userType !== 'athlete') {
      return []
    }
    
    const users = this.getAllUsers()
    const coaches = []
    
    if (athlete.profile?.coachId) {
      const coach = users.find(u => u.id === athlete.profile.coachId)
      if (coach) {
        coaches.push(this.sanitizeUser(coach))
      }
    }
    
    return coaches
  }

  // Assign coach to athlete
  assignCoachToAthlete(coachId, athleteId) {
    const coach = this.getUserById(coachId)
    const athlete = this.getUserById(athleteId)
    
    if (!coach || coach.userType !== 'coach') {
      throw new Error('Invalid coach')
    }
    
    if (!athlete || athlete.userType !== 'athlete') {
      throw new Error('Invalid athlete')
    }
    
    // Update athlete's coach
    this.updateUser(athleteId, {
      profile: {
        ...athlete.profile,
        coachId: coachId
      }
    })
    
    // Add athlete to coach's list
    const updatedAthletes = [...(coach.profile?.athletes || [])]
    if (!updatedAthletes.includes(athleteId)) {
      updatedAthletes.push(athleteId)
    }
    
    this.updateUser(coachId, {
      profile: {
        ...coach.profile,
        athletes: updatedAthletes
      }
    })
    
    return true
  }

  // Find user by email
  findUserByEmail(email) {
    const user = this.getUserByEmail(email)
    return user ? this.sanitizeUser(user) : null
  } data
  clearSession() {
    Cookies.remove(this.sessionKey)
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser ? this.sanitizeUser(this.currentUser) : null
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null
  }

  // Check user subscription tier
  hasSubscription(tier) {
    if (!this.currentUser) return false
    
    const tierHierarchy = {
      free: 0,
      basic: 1,
      pro: 2,
      elite: 3
    }
    
    const userTierLevel = tierHierarchy[this.currentUser.subscriptionTier] || 0
    const requiredTierLevel = tierHierarchy[tier] || 0
    
    return userTierLevel >= requiredTierLevel
  }

  // Check if user has specific permission
  hasPermission(permission) {
    if (!this.currentUser) return false
    
    const permissions = {
      free: ['basic_analysis', 'progress_tracking'],
      basic: ['basic_analysis', 'progress_tracking', 'video_upload', 'export_data'],
      pro: ['basic_analysis', 'progress_tracking', 'video_upload', 'export_data', 'advanced_analytics', 'coach_collaboration'],
      elite: ['basic_analysis', 'progress_tracking', 'video_upload', 'export_data', 'advanced_analytics', 'coach_collaboration', 'competition_scoring', 'priority_support']
    }
    
    const userPermissions = permissions[this.currentUser.subscriptionTier] || permissions.free
    return userPermissions.includes(permission)
  }

  // Update user profile
  async updateProfile(updates) {
    if (!this.currentUser) {
      throw new Error('Not authenticated')
    }
    
    try {
      const updatedUser = await this.updateUser(this.currentUser.id, updates)
      this.currentUser = updatedUser
      return this.sanitizeUser(updatedUser)
    } catch (error) {
      throw new Error(error.message || 'Profile update failed')
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    if (!this.currentUser) {
      throw new Error('Not authenticated')
    }
    
    if (this.currentUser.password !== currentPassword) {
      throw new Error('Current password is incorrect')
    }
    
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters')
    }
    
    await this.updateUser(this.currentUser.id, { password: newPassword })
    return true
  }

  // Upgrade subscription
  async upgradeSubscription(newTier, paymentMethod = null) {
    if (!this.currentUser) {
      throw new Error('Not authenticated')
    }
    
    const validTiers = ['free', 'basic', 'pro', 'elite']
    if (!validTiers.includes(newTier)) {
      throw new Error('Invalid subscription tier')
    }
    
    // In production, this would process payment
    if (newTier !== 'free' && !paymentMethod) {
      throw new Error('Payment method required for paid subscriptions')
    }
    
    const updatedUser = await this.updateUser(this.currentUser.id, {
      subscriptionTier: newTier,
      subscriptionUpdatedAt: new Date().toISOString()
    })
    
    this.currentUser = updatedUser
    return this.sanitizeUser(updatedUser)
  }

  // Helper methods
  getAllUsers() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load users:', error)
      return []
    }
  }

  getUserById(id) {
    const users = this.getAllUsers()
    return users.find(user => user.id === id)
  }

  getUserByEmail(email) {
    const users = this.getAllUsers()
    return users.find(user => user.email === email.toLowerCase())
  }

  async updateUser(id, updates) {
    const users = this.getAllUsers()
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }
    
    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem(this.storageKey, JSON.stringify(users))
    
    return users[userIndex]
  }

  sanitizeUser(user) {
    const { password, ...sanitized } = user
    return sanitized
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Coach-specific methods
  getAthletes() {
    if (!this.currentUser || this.currentUser.userType !== 'coach') {
      return []
    }
    
    const users = this.getAllUsers()
    return users
      .filter(user => user.userType === 'athlete' && user.profile.coachId === this.currentUser.id)
      .map(user => this.sanitizeUser(user))
  }

  async addAthlete(athleteEmail) {
    if (!this.currentUser || this.currentUser.userType !== 'coach') {
      throw new Error('Only coaches can add athletes')
    }
    
    const athlete = this.getUserByEmail(athleteEmail.toLowerCase())
    if (!athlete) {
      throw new Error('Athlete not found')
    }
    
    if (athlete.userType !== 'athlete') {
      throw new Error('User is not an athlete')
    }
    
    if (athlete.profile.coachId) {
      throw new Error('Athlete already has a coach')
    }
    
    await this.updateUser(athlete.id, {
      profile: { ...athlete.profile, coachId: this.currentUser.id }
    })
    
    return this.sanitizeUser(athlete)
  }

  async removeAthlete(athleteId) {
    if (!this.currentUser || this.currentUser.userType !== 'coach') {
      throw new Error('Only coaches can remove athletes')
    }
    
    const athlete = this.getUserById(athleteId)
    if (!athlete || athlete.profile.coachId !== this.currentUser.id) {
      throw new Error('Athlete not found or not assigned to you')
    }
    
    await this.updateUser(athleteId, {
      profile: { ...athlete.profile, coachId: null }
    })
    
    return true
  }

  // Demo and testing methods
  getDemoCredentials() {
    return {
      athlete: { email: 'demo@icedancer.ai', password: 'demo123' },
      coach: { email: 'coach@icedancer.ai', password: 'coach123' }
    }
  }

  // Reset to demo state (for testing)
  resetToDemo() {
    localStorage.removeItem(this.storageKey)
    this.clearSession()
    this.currentUser = null
    this.initializeDemoUsers()
  }

  // Export user data (GDPR compliance)
  exportUserData() {
    if (!this.currentUser) {
      throw new Error('Not authenticated')
    }
    
    return {
      user: this.sanitizeUser(this.currentUser),
      exportedAt: new Date().toISOString()
    }
  }

  // Delete user account
  async deleteAccount() {
    if (!this.currentUser) {
      throw new Error('Not authenticated')
    }
    
    const users = this.getAllUsers()
    const filteredUsers = users.filter(user => user.id !== this.currentUser.id)
    localStorage.setItem(this.storageKey, JSON.stringify(filteredUsers))
    
    this.logout()
    return true
  }

  // Clear session
  clearSession() {
    Cookies.remove(this.sessionKey)
  }
}

// Export singleton instance
export default new AuthService()