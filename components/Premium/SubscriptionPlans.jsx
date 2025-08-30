import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { useAuth } from '../../src/contexts/AuthContext'
import subscriptionService from '../../services/subscriptionService'
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  Users,
  Loader,
  AlertCircle,
  CreditCard,
  Gift
} from 'lucide-react'

const SubscriptionPlans = ({ onClose }) => {
  const { user, upgradeSubscription, canPerformAction, getUsageStats, getUpgradeRecommendation } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  const [error, setError] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [promoCode, setPromoCode] = useState('')

  const plans = subscriptionService.getPlans()
  const currentPlan = user?.subscriptionTier || 'free'
  const usageStats = getUsageStats()
  const recommendation = getUpgradeRecommendation()

  const handleSelectPlan = (planId) => {
    if (planId === 'free') {
      // Handle downgrade to free
      return
    }
    
    setSelectedPlan(planId)
    setShowPayment(true)
    setError('')
  }

  const handleUpgrade = async () => {
    if (!selectedPlan) return
    
    setLoading(true)
    setError('')
    
    try {
      await upgradeSubscription(selectedPlan, {
        cardNumber: paymentDetails.cardNumber,
        expiry: paymentDetails.expiry,
        cvc: paymentDetails.cvc,
        name: paymentDetails.name,
        userId: user.id
      })
      
      setShowPayment(false)
      setSelectedPlan(null)
      onClose?.()
    } catch (err) {
      setError(err.message || 'Upgrade failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const applyPromoCode = () => {
    try {
      const discount = subscriptionService.applyPromoCode(selectedPlan, promoCode)
      console.log('Promo applied:', discount)
    } catch (err) {
      setError('Invalid promo code')
    }
  }

  const getFeatureIcon = (included) => {
    return included ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-red-400" />
    )
  }

  const getPlanIcon = (planId) => {
    const icons = {
      free: <Gift className="h-5 w-5" />,
      basic: <Zap className="h-5 w-5" />,
      pro: <Star className="h-5 w-5" />,
      elite: <Crown className="h-5 w-5" />
    }
    return icons[planId] || <Zap className="h-5 w-5" />
  }

  const getPlanColor = (planId) => {
    const colors = {
      free: 'border-green-200 bg-green-50',
      basic: 'border-blue-200 bg-blue-50',
      pro: 'border-purple-200 bg-purple-50',
      elite: 'border-yellow-200 bg-yellow-50'
    }
    return colors[planId] || 'border-gray-200 bg-gray-50'
  }

  if (showPayment && selectedPlan) {
    const plan = plans[selectedPlan]
    
    return (
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Your Upgrade
            </CardTitle>
            <CardDescription>
              Upgrading to {plan.name} - ${plan.price}/{plan.interval}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                {error}
              </div>
            )}

            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MM/YY
                  </label>
                  <input
                    type="text"
                    placeholder="12/25"
                    value={paymentDetails.expiry}
                    onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentDetails.cvc}
                    onChange={(e) => setPaymentDetails({...paymentDetails, cvc: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={paymentDetails.name}
                  onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* Promo Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={applyPromoCode}
                    disabled={loading || !promoCode}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowPayment(false)}
                disabled={loading}
              >
                Back
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={handleUpgrade}
                disabled={loading || !paymentDetails.cardNumber || !paymentDetails.name}
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${plan.price}`
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              🔒 Your payment information is secure and encrypted
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock the full power of AI-driven ice dance analysis. Start with our free trial and upgrade when you're ready.
        </p>
        
        {recommendation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <Star className="h-4 w-4 inline mr-1" />
              Recommended: {recommendation.message}
            </p>
          </div>
        )}
      </div>

      {/* Current Usage Stats */}
      {user && Object.keys(usageStats).length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">This Month's Usage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Video Analyses:</span>
              <span className="ml-2 font-semibold">{usageStats.video_analysis || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Sessions:</span>
              <span className="ml-2 font-semibold">{usageStats.sessions || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Exports:</span>
              <span className="ml-2 font-semibold">{usageStats.exports || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Current Plan:</span>
              <span className="ml-2 font-semibold capitalize">{currentPlan}</span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(plans).map((plan) => {
          const isCurrentPlan = plan.id === currentPlan
          const isUpgrade = ['basic', 'pro', 'elite'].indexOf(plan.id) > ['free', 'basic', 'pro', 'elite'].indexOf(currentPlan)
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${getPlanColor(plan.id)} ${
                isCurrentPlan ? 'ring-2 ring-blue-500' : ''
              } ${plan.id === 'pro' ? 'scale-105 shadow-lg' : ''} transition-all hover:shadow-lg`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-blue-600 text-white">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className={`p-3 rounded-lg ${
                    plan.id === 'free' ? 'bg-green-100 text-green-600' :
                    plan.id === 'basic' ? 'bg-blue-100 text-blue-600' :
                    plan.id === 'pro' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {getPlanIcon(plan.id)}
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-lg font-normal text-gray-500">/{plan.interval}</span>}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    isCurrentPlan 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : isUpgrade
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || loading}
                >
                  {isCurrentPlan 
                    ? 'Current Plan'
                    : isUpgrade 
                      ? `Upgrade to ${plan.name}`
                      : 'Downgrade'
                  }
                </Button>

                {/* Plan Limits */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Video analyses: {plan.limits.videoAnalyses === -1 ? 'Unlimited' : `${plan.limits.videoAnalyses}/month`}</div>
                  <div>Storage: {plan.limits.storageDays === -1 ? 'Unlimited' : `${plan.limits.storageDays} days`}</div>
                  <div>Support: {plan.limits.supportLevel}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Feature Comparison */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Feature Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-semibold">Feature</th>
                {Object.values(plans).map(plan => (
                  <th key={plan.id} className="text-center p-4 font-semibold capitalize">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Video Analysis', free: '3/trial', basic: '10/month', pro: 'Unlimited', elite: 'Unlimited' },
                { name: 'Real-time AI Feedback', free: true, basic: true, pro: true, elite: true },
                { name: 'Progress Tracking', free: true, basic: true, pro: true, elite: true },
                { name: 'Export Reports', free: false, basic: 'PDF', pro: 'PDF, Video', elite: 'All Formats' },
                { name: 'Coach Collaboration', free: false, basic: false, pro: true, elite: true },
                { name: 'Competition Scoring', free: false, basic: false, pro: false, elite: true },
                { name: 'Priority Support', free: false, basic: false, pro: true, elite: true },
                { name: 'Multi-athlete Accounts', free: false, basic: false, pro: false, elite: true }
              ].map((feature, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-4 font-medium">{feature.name}</td>
                  {Object.keys(plans).map(planId => {
                    const value = feature[planId]
                    return (
                      <td key={planId} className="p-4 text-center">
                        {typeof value === 'boolean' ? (
                          getFeatureIcon(value)
                        ) : (
                          <span className="text-sm">{value}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Questions about our plans? 
          <button className="text-blue-600 hover:underline ml-1">
            Contact our team
          </button>
        </p>
        <p className="text-sm text-gray-500">
          All plans include a 30-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  )
}

export default SubscriptionPlans