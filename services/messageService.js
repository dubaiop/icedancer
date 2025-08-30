/**
 * Message Service for Coach-Athlete Communication
 * Handles real-time messaging, notifications, and message persistence
 */

class MessageService {
  constructor() {
    this.messages = this.loadMessages()
    this.notifications = this.loadNotifications()
    this.messageCallbacks = []
  }

  loadMessages() {
    try {
      const stored = localStorage.getItem('ice_dancer_messages')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load messages:', error)
      return []
    }
  }

  saveMessages() {
    try {
      localStorage.setItem('ice_dancer_messages', JSON.stringify(this.messages))
    } catch (error) {
      console.error('Failed to save messages:', error)
    }
  }

  loadNotifications() {
    try {
      const stored = localStorage.getItem('ice_dancer_notifications')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load notifications:', error)
      return []
    }
  }

  saveNotifications() {
    try {
      localStorage.setItem('ice_dancer_notifications', JSON.stringify(this.notifications))
    } catch (error) {
      console.error('Failed to save notifications:', error)
    }
  }

  // Send a message between coach and athlete
  sendMessage(fromUserId, toUserId, content, type = 'text', metadata = {}) {
    const message = {
      id: Date.now() + Math.random(),
      fromUserId,
      toUserId,
      content,
      type, // 'text', 'progress-report', 'training-plan', 'session-feedback'
      metadata,
      timestamp: new Date(),
      read: false,
      delivered: true // In real app, this would be handled by server
    }

    this.messages.push(message)
    this.saveMessages()

    // Create notification for recipient
    this.createNotification(toUserId, {
      type: 'new_message',
      fromUserId,
      messageId: message.id,
      content: content.length > 50 ? content.substring(0, 50) + '...' : content,
      timestamp: new Date()
    })

    // Notify listeners
    this.notifyCallbacks('message_sent', message)

    return message
  }

  // Get conversation between two users
  getConversation(userId1, userId2, limit = 50) {
    return this.messages
      .filter(msg => 
        (msg.fromUserId === userId1 && msg.toUserId === userId2) ||
        (msg.fromUserId === userId2 && msg.toUserId === userId1)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-limit)
  }

  // Get all conversations for a user
  getUserConversations(userId) {
    const conversations = new Map()

    this.messages
      .filter(msg => msg.fromUserId === userId || msg.toUserId === userId)
      .forEach(msg => {
        const otherUserId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId
        
        if (!conversations.has(otherUserId) || 
            new Date(msg.timestamp) > new Date(conversations.get(otherUserId).lastMessage.timestamp)) {
          conversations.set(otherUserId, {
            otherUserId,
            lastMessage: msg,
            unreadCount: this.getUnreadCount(userId, otherUserId)
          })
        }
      })

    return Array.from(conversations.values())
      .sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp))
  }

  // Mark messages as read
  markAsRead(userId, fromUserId) {
    let updated = false
    this.messages.forEach(msg => {
      if (msg.toUserId === userId && msg.fromUserId === fromUserId && !msg.read) {
        msg.read = true
        updated = true
      }
    })

    if (updated) {
      this.saveMessages()
      this.notifyCallbacks('messages_read', { userId, fromUserId })
    }
  }

  // Get unread message count
  getUnreadCount(userId, fromUserId = null) {
    return this.messages.filter(msg => 
      msg.toUserId === userId && 
      !msg.read && 
      (fromUserId ? msg.fromUserId === fromUserId : true)
    ).length
  }

  // Create notification
  createNotification(userId, notificationData) {
    const notification = {
      id: Date.now() + Math.random(),
      userId,
      ...notificationData,
      read: false,
      createdAt: new Date()
    }

    this.notifications.push(notification)
    this.saveNotifications()

    // In real app, this would trigger push notification
    this.notifyCallbacks('notification_created', notification)

    return notification
  }

  // Get notifications for user
  getUserNotifications(userId, limit = 20) {
    return this.notifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  }

  // Mark notification as read
  markNotificationAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      this.saveNotifications()
      this.notifyCallbacks('notification_read', notification)
    }
  }

  // Send training plan
  sendTrainingPlan(coachId, athleteId, plan) {
    const content = `New training plan: ${plan.title}`
    return this.sendMessage(coachId, athleteId, content, 'training-plan', { plan })
  }

  // Send session feedback
  sendSessionFeedback(coachId, athleteId, sessionId, feedback) {
    const content = `Session feedback: ${feedback.summary}`
    return this.sendMessage(coachId, athleteId, content, 'session-feedback', { 
      sessionId, 
      feedback 
    })
  }

  // Send progress report
  sendProgressReport(athleteId, coachId, reportData) {
    const content = `Progress report: ${reportData.title || 'Latest Performance Update'}`
    return this.sendMessage(athleteId, coachId, content, 'progress-report', { 
      report: reportData 
    })
  }

  // Subscribe to message events
  onMessage(callback) {
    this.messageCallbacks.push(callback)
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback)
    }
  }

  // Notify all callbacks
  notifyCallbacks(event, data) {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(event, data)
      } catch (error) {
        console.error('Message callback error:', error)
      }
    })
  }

  // Search messages
  searchMessages(userId, query, limit = 20) {
    const lowercaseQuery = query.toLowerCase()
    
    return this.messages
      .filter(msg => 
        (msg.fromUserId === userId || msg.toUserId === userId) &&
        msg.content.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  }

  // Get message statistics
  getMessageStats(userId) {
    const userMessages = this.messages.filter(msg => 
      msg.fromUserId === userId || msg.toUserId === userId
    )

    const sent = userMessages.filter(msg => msg.fromUserId === userId).length
    const received = userMessages.filter(msg => msg.toUserId === userId).length
    const unread = this.getUnreadCount(userId)

    return {
      totalMessages: userMessages.length,
      sentMessages: sent,
      receivedMessages: received,
      unreadCount: unread,
      conversationCount: this.getUserConversations(userId).length
    }
  }

  // Delete message (for sender only)
  deleteMessage(messageId, userId) {
    const messageIndex = this.messages.findIndex(msg => 
      msg.id === messageId && msg.fromUserId === userId
    )
    
    if (messageIndex !== -1) {
      const deletedMessage = this.messages.splice(messageIndex, 1)[0]
      this.saveMessages()
      this.notifyCallbacks('message_deleted', deletedMessage)
      return true
    }
    
    return false
  }

  // Clear conversation (for current user)
  clearConversation(userId, otherUserId) {
    const originalLength = this.messages.length
    this.messages = this.messages.filter(msg => !(
      (msg.fromUserId === userId && msg.toUserId === otherUserId) ||
      (msg.fromUserId === otherUserId && msg.toUserId === userId)
    ))
    
    if (this.messages.length < originalLength) {
      this.saveMessages()
      this.notifyCallbacks('conversation_cleared', { userId, otherUserId })
      return true
    }
    
    return false
  }

  // Get typing indicator (simulated)
  setTyping(userId, conversationId, isTyping) {
    // In real app, this would be sent to server and broadcast to other user
    this.notifyCallbacks('typing_indicator', { userId, conversationId, isTyping })
  }
}

// Create singleton instance
const messageService = new MessageService()

export default messageService