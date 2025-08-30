// Simple client-side data storage service using localStorage
// In production, this would connect to a backend database
class UserDataService {
  constructor() {
    this.storageKey = 'aiIceDancer_userData'
    this.sessionsKey = 'aiIceDancer_sessions'
    this.progressKey = 'aiIceDancer_progress'
  }

  // User Profile Management
  saveUserProfile(profile) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profile))
      return true
    } catch (error) {
      console.error('Failed to save user profile:', error)
      return false
    }
  }

  getUserProfile() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load user profile:', error)
      return null
    }
  }

  // Session Management
  saveSession(sessionData) {
    try {
      const sessions = this.getSessions()
      const newSession = {
        id: sessionData.id || Date.now(),
        timestamp: new Date().toISOString(),
        ...sessionData
      }
      
      sessions.unshift(newSession) // Add to beginning
      
      // Keep only last 50 sessions
      const limitedSessions = sessions.slice(0, 50)
      
      localStorage.setItem(this.sessionsKey, JSON.stringify(limitedSessions))
      return newSession
    } catch (error) {
      console.error('Failed to save session:', error)
      return null
    }
  }

  getSessions() {
    try {
      const data = localStorage.getItem(this.sessionsKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load sessions:', error)
      return []
    }
  }

  getSession(sessionId) {
    const sessions = this.getSessions()
    return sessions.find(session => session.id === sessionId)
  }

  deleteSession(sessionId) {
    try {
      const sessions = this.getSessions()
      const filteredSessions = sessions.filter(session => session.id !== sessionId)
      localStorage.setItem(this.sessionsKey, JSON.stringify(filteredSessions))
      return true
    } catch (error) {
      console.error('Failed to delete session:', error)
      return false
    }
  }

  // Progress Tracking
  saveProgress(progressData) {
    try {
      const progress = this.getProgress()
      const newEntry = {
        timestamp: new Date().toISOString(),
        ...progressData
      }
      
      progress.push(newEntry)
      
      // Keep only last 100 progress entries
      const limitedProgress = progress.slice(-100)
      
      localStorage.setItem(this.progressKey, JSON.stringify(limitedProgress))
      return newEntry
    } catch (error) {
      console.error('Failed to save progress:', error)
      return null
    }
  }

  getProgress() {
    try {
      const data = localStorage.getItem(this.progressKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load progress:', error)
      return []
    }
  }

  // Analytics and Statistics
  getPerformanceStats() {
    const sessions = this.getSessions()
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        bestScore: 0,
        improvement: 0,
        elementsAnalyzed: 0,
        recentTrend: 'stable'
      }
    }

    const scores = sessions
      .filter(s => s.metrics && s.metrics.overallScore)
      .map(s => s.metrics.overallScore)

    const totalSessions = sessions.length
    const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0
    
    // Calculate improvement (comparing first half vs second half of sessions)
    const midPoint = Math.floor(scores.length / 2)
    const firstHalf = scores.slice(0, midPoint)
    const secondHalf = scores.slice(midPoint)
    
    const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length : 0
    const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length : 0
    const improvement = secondHalfAvg - firstHalfAvg

    // Count total elements analyzed
    const elementsAnalyzed = sessions.reduce((total, session) => {
      return total + (session.elementsDetected || 0)
    }, 0)

    // Determine recent trend
    let recentTrend = 'stable'
    if (scores.length >= 5) {
      const recent5 = scores.slice(-5)
      const older5 = scores.slice(-10, -5)
      if (older5.length >= 3 && recent5.length >= 3) {
        const recentAvg = recent5.reduce((sum, score) => sum + score, 0) / recent5.length
        const olderAvg = older5.reduce((sum, score) => sum + score, 0) / older5.length
        recentTrend = recentAvg > olderAvg + 0.2 ? 'up' : recentAvg < olderAvg - 0.2 ? 'down' : 'stable'
      }
    }

    return {
      totalSessions,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore: Math.round(bestScore * 10) / 10,
      improvement: Math.round(improvement * 10) / 10,
      elementsAnalyzed,
      recentTrend
    }
  }

  // Element-specific statistics
  getElementStats() {
    const sessions = this.getSessions()
    const elementStats = {}

    sessions.forEach(session => {
      if (session.metrics && session.metrics.elements) {
        session.metrics.elements.forEach(element => {
          if (!elementStats[element.name]) {
            elementStats[element.name] = {
              name: element.name,
              attempts: 0,
              totalScore: 0,
              bestScore: 0,
              averageScore: 0,
              mostCommonLevel: 'Level 1',
              recentTrend: 'stable'
            }
          }

          const stats = elementStats[element.name]
          stats.attempts++
          stats.totalScore += element.score
          stats.bestScore = Math.max(stats.bestScore, element.score)
          stats.averageScore = stats.totalScore / stats.attempts

          // Track most common level (simplified)
          if (element.level && element.level > stats.mostCommonLevel) {
            stats.mostCommonLevel = element.level
          }
        })
      }
    })

    return Object.values(elementStats)
  }

  // Training recommendations based on data
  getTrainingRecommendations() {
    const elementStats = this.getElementStats()
    const recommendations = []

    elementStats.forEach(element => {
      if (element.averageScore < 7.0) {
        recommendations.push({
          type: 'improvement',
          priority: 'high',
          element: element.name,
          message: `Focus on ${element.name} - current average: ${element.averageScore.toFixed(1)}`,
          suggestion: this.getElementSpecificAdvice(element.name)
        })
      } else if (element.averageScore > 8.5) {
        recommendations.push({
          type: 'strength',
          priority: 'low',
          element: element.name,
          message: `Maintain excellent ${element.name} performance - average: ${element.averageScore.toFixed(1)}`,
          suggestion: 'Continue current training approach'
        })
      }
    })

    // Add general recommendations based on overall performance
    const stats = this.getPerformanceStats()
    if (stats.averageScore < 6.0) {
      recommendations.push({
        type: 'general',
        priority: 'high',
        message: 'Focus on fundamental techniques',
        suggestion: 'Consider working with a coach on basic skating skills'
      })
    } else if (stats.improvement < -0.5) {
      recommendations.push({
        type: 'general',
        priority: 'medium',
        message: 'Recent performance has declined',
        suggestion: 'Review recent training sessions and identify areas for improvement'
      })
    } else if (stats.improvement > 0.5) {
      recommendations.push({
        type: 'general',
        priority: 'low',
        message: 'Great improvement trend!',
        suggestion: 'Continue your current training regimen'
      })
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  getElementSpecificAdvice(elementName) {
    const advice = {
      'Balance Control': 'Practice single-leg glides and edge control exercises',
      'Posture Quality': 'Work on core strength and spine alignment',
      'Arm Position': 'Practice port de bras and arm positioning drills',
      'Stability': 'Focus on center of gravity and controlled movements',
      'Twizzles': 'Practice rotation consistency and traveling speed',
      'Lifts': 'Work on entry, height, and landing techniques',
      'Step Sequences': 'Increase variety of turns and edge changes',
      'Spins': 'Focus on centering and rotational speed'
    }

    return advice[elementName] || 'Continue practicing technique and consistency'
  }

  // Export/Import data
  exportData() {
    try {
      const data = {
        profile: this.getUserProfile(),
        sessions: this.getSessions(),
        progress: this.getProgress(),
        exportDate: new Date().toISOString()
      }
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error('Failed to export data:', error)
      return null
    }
  }

  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.profile) {
        this.saveUserProfile(data.profile)
      }
      
      if (data.sessions) {
        localStorage.setItem(this.sessionsKey, JSON.stringify(data.sessions))
      }
      
      if (data.progress) {
        localStorage.setItem(this.progressKey, JSON.stringify(data.progress))
      }
      
      return true
    } catch (error) {
      console.error('Failed to import data:', error)
      return false
    }
  }

  // Clear all data
  clearAllData() {
    try {
      localStorage.removeItem(this.storageKey)
      localStorage.removeItem(this.sessionsKey)
      localStorage.removeItem(this.progressKey)
      return true
    } catch (error) {
      console.error('Failed to clear data:', error)
      return false
    }
  }

  // Generate performance report
  generatePerformanceReport() {
    const stats = this.getPerformanceStats()
    const elementStats = this.getElementStats()
    const recommendations = this.getTrainingRecommendations()
    const recentSessions = this.getSessions().slice(0, 5)

    return {
      summary: stats,
      elements: elementStats,
      recommendations: recommendations,
      recentSessions: recentSessions,
      generatedDate: new Date().toISOString()
    }
  }

  // Coach-Athlete Messaging
  getCoachAthleteMessages(coachId, athleteId) {
    const messages = JSON.parse(localStorage.getItem('ice_dancer_messages') || '[]')
    return messages.filter(msg => 
      (msg.from === coachId && msg.to === athleteId) ||
      (msg.from === athleteId && msg.to === coachId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem('ice_dancer_messages') || '[]')
    messages.push(message)
    localStorage.setItem('ice_dancer_messages', JSON.stringify(messages))
    return message
  }

  // Progress Sharing
  getSharedReports(userId) {
    const reports = JSON.parse(localStorage.getItem('ice_dancer_shared_reports') || '[]')
    return reports.filter(report => report.athleteId === userId)
  }

  saveSharedReport(report) {
    const reports = JSON.parse(localStorage.getItem('ice_dancer_shared_reports') || '[]')
    reports.push(report)
    localStorage.setItem('ice_dancer_shared_reports', JSON.stringify(reports))
    return report
  }

  // Get user sessions by ID
  getUserSessions(userId) {
    const sessions = this.getSessions()
    return sessions.filter(session => session.userId === userId)
  }

  // Get user stats by ID
  getUserStats(userId) {
    const sessions = this.getUserSessions(userId)
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        averageScore: 0,
        bestScore: 0,
        improvement: 0
      }
    }

    const scores = sessions.map(s => s.metrics?.overallScore || 0).filter(s => s > 0)
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0

    let improvement = 0
    if (sessions.length >= 2) {
      const recent = sessions.slice(0, Math.ceil(sessions.length / 2))
      const older = sessions.slice(Math.ceil(sessions.length / 2))
      
      const recentAvg = recent.reduce((sum, s) => sum + (s.metrics?.overallScore || 0), 0) / recent.length
      const olderAvg = older.reduce((sum, s) => sum + (s.metrics?.overallScore || 0), 0) / older.length
      
      improvement = recentAvg - olderAvg
    }

    return {
      totalSessions: sessions.length,
      averageScore,
      bestScore,
      improvement
    }
  }
}

// Export singleton instance
export default new UserDataService()