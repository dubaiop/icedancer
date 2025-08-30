import './App.css'
import { useState } from 'react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import AuthContainer from './components/Auth/AuthContainer'
import Dashboard from './components/Dashboard/Dashboard'
import { 
  Brain, 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp,
  ChevronRight,
  Play,
  Star,
  CheckCircle,
  Sparkles,
  Activity
} from 'lucide-react'

// Import images
import { 
  skateAdjustmentImage,
  skatePreparationImage,
  gracefulPoseImage
} from './assets/placeholder.js'

function App() {
  const [user, setUser] = useState(null)
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "AI Element Recognition",
      description: "Real-time detection and analysis of ice dance elements with 95% accuracy",
      details: [
        "Automated twizzle, lift, and spin detection",
        "Technical error identification and scoring",
        "Level of Difficulty (LoD) assessment",
        "Grade of Execution (GoE) predictions"
      ]
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Performance Analytics",
      description: "Advanced AI-powered assessment of skating skills and artistic expression",
      details: [
        "Edge quality and flow analysis",
        "Transition smoothness evaluation",
        "Artistic interpretation scoring",
        "Ice coverage optimization"
      ]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Feedback",
      description: "Instant visual and auditory guidance during training sessions",
      details: [
        "Live performance overlays",
        "Heat map visualization",
        "Audio coaching cues",
        "Progress tracking dashboard"
      ]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Progress Intelligence",
      description: "Data-driven insights and personalized training recommendations",
      details: [
        "Historical performance trends",
        "AI-powered improvement suggestions",
        "Competition readiness assessment",
        "Personalized training plans"
      ]
    }
  ]

  const stats = [
    { number: "95%", label: "Element Recognition Accuracy", icon: <Target className="h-5 w-5" /> },
    { number: "10x", label: "Faster Analysis Speed", icon: <Zap className="h-5 w-5" /> },
    { number: "50+", label: "Professional Athletes", icon: <Trophy className="h-5 w-5" /> },
    { number: "24/7", label: "AI Coaching Available", icon: <Brain className="h-5 w-5" /> }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Olympic Ice Dancer",
      content: "AI Ice Dancer transformed my training. The real-time feedback helped me perfect my twizzles in weeks, not months.",
      avatar: "SC"
    },
    {
      name: "Coach Michael Rodriguez",
      role: "ISU Certified Judge",
      content: "The objective data analysis has revolutionized how I coach. My athletes improve faster with precise, actionable feedback.",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Junior Champion",
      content: "Finally, I can see exactly what I'm doing right and wrong. The AI insights are like having a world-class coach 24/7.",
      avatar: "ET"
    }
  ]

  const handleLogin = (authData) => {
    setUser(authData.user)
    // In a real app, you'd store the token in localStorage or secure storage
    localStorage.setItem('authToken', authData.token)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }

  // Check if user is authenticated
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  // Show landing page or auth based on route
  const path = window.location.pathname
  
  if (path === '/login' || path === '/signup') {
    return <AuthContainer onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">AI Ice Dancer</span>
            </div>
                          <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
                <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.location.href = '/login'}
                >
                  Sign In
                </Button>
              </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI-Powered Innovation
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Revolutionize Your
                  <span className="block text-blue-600">Ice Dance Training</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Experience the future of ice dance with AI-powered analysis, real-time feedback, and personalized coaching that accelerates your journey to excellence.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  onClick={() => window.location.href = '/demo'}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try AI Demo
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  Watch Video
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={skateAdjustmentImage} 
                  alt="Skater adjusting skate with focus and preparation" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-800">Live AI Analysis Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Brain className="h-3 w-3 mr-1" />
              AI Technology
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our cutting-edge artificial intelligence provides unprecedented insights into ice dance performance, 
              helping athletes and coaches achieve new levels of excellence.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-300 border-0 shadow-lg hover:shadow-xl ${
                    activeFeature === index ? 'ring-2 ring-blue-500 bg-white' : 'bg-white/80 hover:bg-white'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${
                        activeFeature === index ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-slate-600">{feature.description}</CardDescription>
                  </CardHeader>
                  {activeFeature === index && (
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-slate-600">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={gracefulPoseImage} 
                  alt="Graceful extended pose showcasing flexibility and balance" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-800">Real-time Analysis</div>
                        <div className="text-xs text-slate-600">Processing 60fps video feed</div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
              <Star className="h-3 w-3 mr-1" />
              Trusted by Champions
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Athletes & Coaches Say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join hundreds of ice dancers who have transformed their training with AI-powered insights.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <Trophy className="h-3 w-3 mr-1" />
              Choose Your Plan
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Start with our free trial and scale up as your training needs grow. No hidden fees, no surprises.
            </p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Free Trial */}
            <Card className="relative border-2 border-blue-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <Badge className="bg-green-100 text-green-700 border-green-200 mb-2">Most Popular</Badge>
                <CardTitle className="text-2xl font-bold text-slate-900">Free Trial</CardTitle>
                <div className="text-4xl font-bold text-slate-900">$0</div>
                <CardDescription className="text-slate-600">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">1–3 video analyses</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Basic feedback (rhythm, posture)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Watermarked videos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">7-day access</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  onClick={() => window.location.href = '/login'}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Basic */}
            <Card className="relative border-2 border-slate-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900">Basic</CardTitle>
                <div className="text-4xl font-bold text-slate-900">$29</div>
                <div className="text-sm text-slate-500">per month</div>
                <CardDescription className="text-slate-600">For serious athletes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">5–10 video uploads/month</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">AI breakdown of timing, edges, and flow</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Progress tracking</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Sync with mobile app</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  onClick={() => window.location.href = '/login'}
                >
                  Choose Basic
                </Button>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="relative border-2 border-purple-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-2">Pro</Badge>
                <CardTitle className="text-2xl font-bold text-slate-900">Pro</CardTitle>
                <div className="text-4xl font-bold text-slate-900">$79</div>
                <div className="text-sm text-slate-500">per month</div>
                <CardDescription className="text-slate-600">For competitive athletes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Unlimited uploads</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Advanced AI analysis (edge depth, rotational alignment, pair spacing)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Frame-by-frame comparison to elite skaters</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Coach collaboration tools</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => window.location.href = '/login'}
                >
                  Choose Pro
                </Button>
              </CardContent>
            </Card>

            {/* Elite / Team */}
            <Card className="relative border-2 border-gold-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 mb-2">Elite</Badge>
                <CardTitle className="text-2xl font-bold text-slate-900">Elite / Team</CardTitle>
                <div className="text-4xl font-bold text-slate-900">Custom</div>
                <div className="text-sm text-slate-500">$200+/month</div>
                <CardDescription className="text-slate-600">For training centers & choreographers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Multi-skater accounts</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Integration with competition scoring standards (ISU)</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">Custom training center features</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
                  onClick={() => window.location.href = '/login'}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Preparation & Focus Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={skatePreparationImage} 
                  alt="Skater carefully preparing and lacing skates with focus" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-800">Preparation is Key</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Every detail matters in ice dance</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                <Target className="h-3 w-3 mr-1" />
                Attention to Detail
              </Badge>
              <h2 className="text-4xl font-bold text-slate-900">
                Excellence Begins with Preparation
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                Our AI system recognizes that every aspect of ice dance performance starts with meticulous preparation. 
                From equipment setup to mental focus, we help athletes develop the discipline needed for success.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-slate-900">Equipment Check</span>
                  </div>
                  <p className="text-sm text-slate-600">AI-powered skate and gear analysis</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-slate-900">Mental Preparation</span>
                  </div>
                  <p className="text-sm text-slate-600">Focus and concentration training</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-slate-900">Warm-up Routines</span>
                  </div>
                  <p className="text-sm text-slate-600">Personalized preparation sequences</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-slate-900">Performance Readiness</span>
                  </div>
                  <p className="text-sm text-slate-600">AI assessment of competition readiness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Ice Dance Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Experience the power of AI-driven coaching and take your performance to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                onClick={() => window.location.href = '/demo'}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Free Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Activity className="mr-2 h-5 w-5" />
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI Ice Dancer</span>
              </div>
              <p className="text-slate-400">
                Revolutionizing ice dance through artificial intelligence and advanced analytics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p>&copy; 2025 AI Ice Dancer. All rights reserved. Revolutionizing ice dance through AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

