import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import AnalyticsDashboard from './AnalyticsDashboard'
import VideoAnalysis from './VideoAnalysis'
import ImageGallery from './ImageGallery'
import { 
  BarChart3, 
  Camera, 
  Trophy, 
  Target, 
  TrendingUp,
  Brain,
  Play,
  Award,
  Clock,
  CheckCircle,
  Image,
  Sparkles,
  Settings
} from 'lucide-react'

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [demoMode, setDemoMode] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'video', label: 'Video Analysis', icon: <Camera className="h-4 w-4" /> },
    { id: 'training', label: 'Training Tools', icon: <Target className="h-4 w-4" /> },
    { id: 'gallery', label: 'Image Gallery', icon: <Image className="h-4 w-4" /> }
  ]

  const quickStats = [
    { label: 'Sessions Analyzed', value: '1,247', change: '+12%', icon: <Camera className="h-5 w-5" /> },
    { label: 'Average Score', value: '8.2', change: '+0.3', icon: <Trophy className="h-5 w-5" /> },
    { label: 'Elements Detected', value: '3,891', change: '+8%', icon: <Target className="h-5 w-5" /> },
    { label: 'Improvement Rate', value: '15%', change: '+2%', icon: <TrendingUp className="h-5 w-5" /> }
  ]

  const recentSessions = [
    { date: '2024-01-15', program: 'Free Dance', score: 8.4, elements: 12, duration: '4:32' },
    { date: '2024-01-14', program: 'Rhythm Dance', score: 7.9, elements: 8, duration: '3:15' },
    { date: '2024-01-13', program: 'Free Dance', score: 8.1, elements: 11, duration: '4:28' },
    { date: '2024-01-12', program: 'Rhythm Dance', score: 7.7, elements: 7, duration: '3:08' }
  ]

  const trainingModules = [
    {
      title: 'Twizzle Mastery',
      description: 'Advanced twizzle technique and execution',
      difficulty: 'Advanced',
      duration: '45 min',
      progress: 75,
      completed: true
    },
    {
      title: 'Lift Fundamentals',
      description: 'Basic lift techniques and safety',
      difficulty: 'Intermediate',
      duration: '30 min',
      progress: 100,
      completed: true
    },
    {
      title: 'Edge Quality',
      description: 'Improving edge control and flow',
      difficulty: 'Intermediate',
      duration: '40 min',
      progress: 60,
      completed: false
    },
    {
      title: 'Performance Expression',
      description: 'Artistic interpretation and musicality',
      difficulty: 'Advanced',
      duration: '50 min',
      progress: 25,
      completed: false
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />
      case 'video':
        return <VideoAnalysis />
      case 'training':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Modules</CardTitle>
                <CardDescription>
                  AI-powered training programs tailored to your skill level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {trainingModules.map((module, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <Badge variant={module.difficulty === 'Advanced' ? 'destructive' : 'secondary'}>
                            {module.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{module.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              {module.duration}
                            </div>
                            {module.completed && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'gallery':
        return <ImageGallery />
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change} from last month</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Training Sessions</CardTitle>
                <CardDescription>
                  Your latest performance analysis and scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Trophy className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{session.program}</h4>
                          <p className="text-sm text-gray-500">{session.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Score</p>
                          <p className="text-xl font-bold text-blue-600">{session.score}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Elements</p>
                          <p className="text-xl font-bold">{session.elements}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="text-xl font-bold">{session.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights & Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized suggestions based on your performance data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li>• Excellent twizzle execution (94% accuracy)</li>
                        <li>• Strong edge control in step sequences</li>
                        <li>• Consistent lift technique</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Spin stability needs work</li>
                        <li>• Transitions could be smoother</li>
                        <li>• Artistic expression scoring</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Next Steps</h4>
                      <ul className="space-y-1 text-sm text-purple-700">
                        <li>• Focus on spin practice (30 min daily)</li>
                        <li>• Work on transition drills</li>
                        <li>• Review artistic interpretation videos</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">Competition Readiness</h4>
                      <p className="text-sm text-yellow-700">
                        Based on your recent performances, you&apos;re 85% ready for competition. 
                        Focus on the recommended areas to reach 95% readiness.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
                  AI Ice Dancer Demo
                </h1>
                <p className="text-slate-600">Experience the future of ice dance training</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setDemoMode(!demoMode)}
                variant={demoMode ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  demoMode 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Play className="h-4 w-4" />
                {demoMode ? 'Demo Active' : 'Start Demo'}
              </Button>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </div>

      {/* Demo Mode Indicator */}
      {demoMode && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Demo Mode Active</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoPage 