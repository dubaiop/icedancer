import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Star, 
  Zap, 
  BarChart3,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

const AnalyticsDashboard = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)

  const performanceMetrics = {
    technicalScore: 8.2,
    componentScore: 7.8,
    overallScore: 8.0,
    improvement: '+0.3',
    elements: [
      { name: 'Twizzles', score: 8.5, level: 'Level 4', trend: 'up' },
      { name: 'Lifts', score: 7.9, level: 'Level 3', trend: 'up' },
      { name: 'Step Sequences', score: 8.1, level: 'Level 4', trend: 'stable' },
      { name: 'Spins', score: 7.6, level: 'Level 3', trend: 'down' }
    ],
    components: [
      { name: 'Skating Skills', score: 8.0, trend: 'up' },
      { name: 'Transitions', score: 7.5, trend: 'up' },
      { name: 'Performance', score: 8.2, trend: 'stable' },
      { name: 'Composition', score: 7.8, trend: 'up' }
    ]
  }

  const startSession = () => {
    setIsRecording(true)
    setCurrentSession({
      id: Date.now(),
      startTime: new Date(),
      duration: 0
    })
  }

  const stopSession = () => {
    setIsRecording(false)
    setCurrentSession(null)
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8.0) return 'text-green-600'
    if (score >= 7.0) return 'text-blue-600'
    if (score >= 6.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Live Analysis Session
          </CardTitle>
          <CardDescription>
            Start recording to analyze your ice dance performance in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              onClick={startSession}
              disabled={isRecording}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="h-4 w-4" />
              Start Recording
            </button>
            <button
              onClick={stopSession}
              disabled={!isRecording}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pause className="h-4 w-4" />
              Stop Recording
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          {isRecording && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Recording in progress... Analyzing performance data
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Performance */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Technical Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {performanceMetrics.technicalScore}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +0.2 from last session
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Component Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {performanceMetrics.componentScore}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +0.1 from last session
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600">
              {performanceMetrics.overallScore}
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              {performanceMetrics.improvement} from last session
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Elements Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Elements Analysis</CardTitle>
          <CardDescription>
            AI-powered analysis of individual technical elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceMetrics.elements.map((element, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{element.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{element.level}</Badge>
                      {getTrendIcon(element.trend)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(element.score)}`}>
                    {element.score}
                  </div>
                  <div className="text-sm text-gray-500">Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Components */}
      <Card>
        <CardHeader>
          <CardTitle>Program Components</CardTitle>
          <CardDescription>
            Assessment of skating skills, transitions, performance, and composition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {performanceMetrics.components.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{component.name}</h4>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(component.trend)}
                      <span className="text-sm text-gray-500">Trend</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${getScoreColor(component.score)}`}>
                    {component.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>
            Personalized suggestions based on your performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800">Focus on Spin Quality</h4>
              <p className="text-blue-700 text-sm">
                Your spins showed slight instability. Practice maintaining center position and consistent rotation speed.
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800">Excellent Twizzle Execution</h4>
              <p className="text-green-700 text-sm">
                Your twizzles are consistently strong. Consider increasing difficulty to Level 4+ for higher scores.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800">Transitions Improvement</h4>
              <p className="text-yellow-700 text-sm">
                Work on smoother transitions between elements to enhance flow and artistic impression.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard 