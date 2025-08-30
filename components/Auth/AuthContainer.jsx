import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { 
  Sparkles, 
  Users, 
  Trophy, 
  Target,
  CheckCircle,
  Star
} from 'lucide-react'

const AuthContainer = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showDemo, setShowDemo] = useState(false)

  const features = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "Real AI Analysis", 
      description: "Get instant feedback on your ice dance performance with computer vision"
    },
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "ISU-Compliant Scoring",
      description: "Receive official competition-style scores and technical feedback"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Coach Collaboration",
      description: "Share progress with coaches and get personalized training plans"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Progress Tracking",
      description: "Track improvement over time with detailed analytics and insights"
    }
  ]

  const demoCredentials = {
    athlete: { email: 'demo@icedancer.ai', password: 'demo123', type: 'Athlete' },
    coach: { email: 'coach@icedancer.ai', password: 'coach123', type: 'Coach' }
  }

  const handleSwitchToSignup = () => {
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
  }

  const handleAuthSuccess = (authData) => {
    onLogin(authData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">AI Ice Dancer</span>
            </div>
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
              onClick={() => window.location.href = '/'}
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features & Benefits */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Coaching
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Transform Your
                <span className="block text-blue-600">Ice Dance Training</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Join thousands of ice dancers using AI-powered analysis to perfect their technique, 
                track progress, and achieve their competitive goals.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Access */}
            <div className="p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Try Demo Accounts</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDemo(!showDemo)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  {showDemo ? 'Hide' : 'Show'} Demo
                </Button>
              </div>
              
              {showDemo && (
                <div className="space-y-3">
                  {Object.entries(demoCredentials).map(([key, creds]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <div className="font-medium text-slate-900">{creds.type} Demo</div>
                        <div className="text-sm text-slate-600">{creds.email}</div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleAuthSuccess({ email: creds.email, password: creds.password })}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        Quick Login
                      </Button>
                    </div>
                  ))}
                  <p className="text-xs text-slate-500 mt-2">
                    Demo accounts include sample data to explore all features
                  </p>
                </div>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">95%</div>
                <div className="text-sm text-slate-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">50+</div>
                <div className="text-sm text-slate-600">Pro Athletes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">24/7</div>
                <div className="text-sm text-slate-600">AI Coach</div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="max-w-md mx-auto w-full">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {isLogin 
                    ? 'Sign in to continue your ice dance journey'
                    : 'Create your account and start improving today'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLogin ? (
                  <LoginForm 
                    onSwitchToSignup={handleSwitchToSignup}
                    onLogin={handleAuthSuccess}
                  />
                ) : (
                  <SignupForm 
                    onSwitchToLogin={handleSwitchToLogin}
                    onSignup={handleAuthSuccess}
                  />
                )}
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign up for free' : 'Sign in instead'}
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Free Trial</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>No Credit Card</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthContainer 