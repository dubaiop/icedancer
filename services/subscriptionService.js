// Subscription management service
// In production, this would integrate with Stripe or similar payment processor
class SubscriptionService {
  constructor() {
    this.plans = {
      free: {
        id: 'free',
        name: 'Free Trial',
        price: 0,
        interval: 'forever',
        features: [
          '1-3 video analyses',
          'Basic feedback (rhythm, posture)',
          'Watermarked videos',
          '7-day access'
        ],
        limits: {
          videoAnalyses: 3,
          storageDays: 7,
          exportFormats: ['basic'],
          supportLevel: 'community'
        }
      },
      basic: {
        id: 'basic',
        name: 'Basic',
        price: 29,
        interval: 'month',
        features: [
          '5-10 video uploads/month',
          'AI breakdown of timing, edges, and flow',
          'Progress tracking',
          'Sync with mobile app'
        ],
        limits: {
          videoAnalyses: 10,
          storageDays: 30,
          exportFormats: ['basic', 'pdf'],
          supportLevel: 'email'
        }
      },
      pro: {
        id: 'pro',
        name: 'Pro',
        price: 79,
        interval: 'month',
        features: [
          'Unlimited uploads',
          'Advanced AI analysis (edge depth, rotational alignment, pair spacing)',
          'Frame-by-frame comparison to elite skaters',
          'Coach collaboration tools'
        ],
        limits: {
          videoAnalyses: -1, // unlimited
          storageDays: 365,
          exportFormats: ['basic', 'pdf', 'video', 'json'],
          supportLevel: 'priority'
        }
      },
      elite: {
        id: 'elite',
        name: 'Elite / Team',
        price: 200,
        interval: 'month',
        features: [
          'Multi-skater accounts',
          'Integration with competition scoring standards (ISU)',
          'Priority support',
          'Custom training center features'
        ],
        limits: {
          videoAnalyses: -1, // unlimited
          storageDays: -1, // unlimited
          exportFormats: ['basic', 'pdf', 'video', 'json', 'competition'],
          supportLevel: 'dedicated'
        }
      }
    }
    
    this.paymentMethods = []
    this.subscriptions = this.loadSubscriptions()
  }

  // Get all available plans
  getPlans() {
    return this.plans
  }

  // Get specific plan
  getPlan(planId) {
    return this.plans[planId] || null
  }

  // Check if user can perform action based on subscription
  canPerformAction(userSubscription, action, currentUsage = 0) {
    const plan = this.getPlan(userSubscription)
    if (!plan) return false

    switch (action) {
      case 'video_analysis':
        return plan.limits.videoAnalyses === -1 || currentUsage < plan.limits.videoAnalyses
      
      case 'export_pdf':
        return plan.limits.exportFormats.includes('pdf')
      
      case 'export_video':
        return plan.limits.exportFormats.includes('video')
      
      case 'coach_collaboration':
        return ['pro', 'elite'].includes(plan.id)
      
      case 'priority_support':
        return ['pro', 'elite'].includes(plan.id)
      
      case 'competition_scoring':
        return plan.id === 'elite'
      
      default:
        return true
    }
  }

  // Get usage limits for subscription
  getUsageLimits(userSubscription) {
    const plan = this.getPlan(userSubscription)
    return plan ? plan.limits : null
  }

  // Calculate upgrade recommendation
  getUpgradeRecommendation(currentPlan, usage) {
    const current = this.getPlan(currentPlan)
    if (!current) return null

    const recommendations = []

    // Check if user is hitting limits
    if (current.limits.videoAnalyses !== -1 && usage.videoAnalyses >= current.limits.videoAnalyses * 0.8) {
      recommendations.push({
        reason: 'approaching_video_limit',
        message: 'You\'re approaching your monthly video analysis limit',
        suggestedPlan: currentPlan === 'free' ? 'basic' : 'pro'
      })
    }

    if (usage.wantsCoachCollaboration && !this.canPerformAction(currentPlan, 'coach_collaboration')) {
      recommendations.push({
        reason: 'coach_collaboration',
        message: 'Upgrade to collaborate with coaches',
        suggestedPlan: 'pro'
      })
    }

    if (usage.needsCompetitionScoring && !this.canPerformAction(currentPlan, 'competition_scoring')) {
      recommendations.push({
        reason: 'competition_scoring',
        message: 'Get ISU-compliant competition scoring',
        suggestedPlan: 'elite'
      })
    }

    return recommendations.length > 0 ? recommendations[0] : null
  }

  // Simulate payment processing
  async processPayment(planId, paymentMethod) {
    const plan = this.getPlan(planId)
    if (!plan) {
      throw new Error('Invalid subscription plan')
    }

    if (plan.price > 0 && !paymentMethod) {
      throw new Error('Payment method required for paid plans')
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate payment success/failure (90% success rate)
    if (Math.random() < 0.1) {
      throw new Error('Payment processing failed. Please try again.')
    }

    // Create subscription record
    const subscription = {
      id: `sub_${Date.now()}`,
      planId: plan.id,
      userId: paymentMethod?.userId || 'demo_user',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: this.calculatePeriodEnd(plan.interval),
      createdAt: new Date().toISOString(),
      paymentMethod: paymentMethod,
      amount: plan.price
    }

    this.subscriptions.push(subscription)
    this.saveSubscriptions()

    return subscription
  }

  // Calculate subscription period end
  calculatePeriodEnd(interval) {
    const now = new Date()
    switch (interval) {
      case 'month':
        return new Date(now.setMonth(now.getMonth() + 1)).toISOString()
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() + 1)).toISOString()
      default:
        return new Date(now.setFullYear(now.getFullYear() + 100)).toISOString() // "forever"
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    const subscription = this.subscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error('Subscription not found')
    }

    subscription.status = 'canceled'
    subscription.canceledAt = new Date().toISOString()
    
    this.saveSubscriptions()
    return subscription
  }

  // Reactivate subscription
  async reactivateSubscription(subscriptionId) {
    const subscription = this.subscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error('Subscription not found')
    }

    subscription.status = 'active'
    subscription.canceledAt = null
    
    this.saveSubscriptions()
    return subscription
  }

  // Get user's active subscription
  getUserSubscription(userId) {
    return this.subscriptions.find(sub => 
      sub.userId === userId && 
      sub.status === 'active' &&
      new Date(sub.currentPeriodEnd) > new Date()
    )
  }

  // Update payment method
  async updatePaymentMethod(subscriptionId, newPaymentMethod) {
    const subscription = this.subscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error('Subscription not found')
    }

    subscription.paymentMethod = newPaymentMethod
    subscription.updatedAt = new Date().toISOString()
    
    this.saveSubscriptions()
    return subscription
  }

  // Generate invoice
  generateInvoice(subscriptionId) {
    const subscription = this.subscriptions.find(sub => sub.id === subscriptionId)
    if (!subscription) {
      throw new Error('Subscription not found')
    }

    const plan = this.getPlan(subscription.planId)
    
    return {
      id: `inv_${Date.now()}`,
      subscriptionId: subscription.id,
      amount: subscription.amount,
      currency: 'USD',
      description: `${plan.name} - AI Ice Dancer`,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      status: 'paid',
      paidAt: new Date().toISOString(),
      downloadUrl: this.generateInvoiceUrl(subscription.id)
    }
  }

  generateInvoiceUrl(subscriptionId) {
    // In production, this would generate a secure URL to download invoice PDF
    return `https://api.icedancer.ai/invoices/${subscriptionId}.pdf`
  }

  // Usage tracking
  trackUsage(userId, action, metadata = {}) {
    const usage = this.getUserUsage(userId)
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    
    if (!usage[currentMonth]) {
      usage[currentMonth] = {}
    }
    
    if (!usage[currentMonth][action]) {
      usage[currentMonth][action] = 0
    }
    
    usage[currentMonth][action]++
    
    // Store usage data
    localStorage.setItem(`usage_${userId}`, JSON.stringify(usage))
    
    return usage[currentMonth]
  }

  getUserUsage(userId) {
    try {
      const data = localStorage.getItem(`usage_${userId}`)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Failed to load usage data:', error)
      return {}
    }
  }

  getCurrentMonthUsage(userId) {
    const usage = this.getUserUsage(userId)
    const currentMonth = new Date().toISOString().slice(0, 7)
    return usage[currentMonth] || {}
  }

  // Promo codes and discounts
  validatePromoCode(code) {
    const promoCodes = {
      'WELCOME20': { discount: 20, type: 'percentage', validFor: ['basic', 'pro'] },
      'STUDENT50': { discount: 50, type: 'percentage', validFor: ['basic'] },
      'COACH25': { discount: 25, type: 'percentage', validFor: ['pro', 'elite'] }
    }
    
    return promoCodes[code.toUpperCase()] || null
  }

  applyPromoCode(planId, promoCode) {
    const plan = this.getPlan(planId)
    const promo = this.validatePromoCode(promoCode)
    
    if (!plan || !promo) {
      throw new Error('Invalid plan or promo code')
    }
    
    if (!promo.validFor.includes(planId)) {
      throw new Error('Promo code not valid for this plan')
    }
    
    const discount = promo.type === 'percentage' 
      ? (plan.price * promo.discount / 100)
      : promo.discount
    
    return {
      originalPrice: plan.price,
      discount: discount,
      finalPrice: Math.max(0, plan.price - discount),
      promoCode: promoCode
    }
  }

  // Billing history
  getBillingHistory(userId) {
    return this.subscriptions
      .filter(sub => sub.userId === userId)
      .map(sub => ({
        date: sub.createdAt,
        amount: sub.amount,
        plan: this.getPlan(sub.planId)?.name,
        status: sub.status,
        invoice: this.generateInvoice(sub.id)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  // Analytics for business
  getSubscriptionAnalytics() {
    const analytics = {
      totalSubscriptions: this.subscriptions.length,
      activeSubscriptions: this.subscriptions.filter(sub => sub.status === 'active').length,
      monthlyRevenue: 0,
      planDistribution: {},
      churnRate: 0
    }
    
    // Calculate revenue and plan distribution
    this.subscriptions.forEach(sub => {
      if (sub.status === 'active') {
        const plan = this.getPlan(sub.planId)
        analytics.monthlyRevenue += plan.price
        analytics.planDistribution[sub.planId] = (analytics.planDistribution[sub.planId] || 0) + 1
      }
    })
    
    return analytics
  }

  // Storage methods
  loadSubscriptions() {
    try {
      const data = localStorage.getItem('aiIceDancer_subscriptions')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
      return []
    }
  }

  saveSubscriptions() {
    try {
      localStorage.setItem('aiIceDancer_subscriptions', JSON.stringify(this.subscriptions))
    } catch (error) {
      console.error('Failed to save subscriptions:', error)
    }
  }

  // Demo methods
  createDemoSubscription(userId, planId) {
    const plan = this.getPlan(planId)
    if (!plan) return null
    
    const subscription = {
      id: `demo_sub_${Date.now()}`,
      planId: plan.id,
      userId: userId,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: this.calculatePeriodEnd(plan.interval),
      createdAt: new Date().toISOString(),
      paymentMethod: { type: 'demo' },
      amount: plan.price
    }
    
    this.subscriptions.push(subscription)
    this.saveSubscriptions()
    
    return subscription
  }
}

export default new SubscriptionService()