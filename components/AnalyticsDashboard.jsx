import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import aiAnalysisService from '../services/aiAnalysisService'
import isuScoringService from '../services/isuScoringService'
import userDataService from '../services/userDataService'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Star, 
  Zap, 
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Loader,
  AlertCircle,
  Download,
  Upload
} from 'lucide-react'

const AnalyticsDashboard = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [currentSession, setCurrentSession] = useState(null)
  const [realTimeData, setRealTimeData] = useState(null)
  const [sessionHistory, setSessionHistory] = useState([])
  const [aiInitialized, setAiInitialized] = useState(false)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Initialize AI service
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const success = await aiAnalysisService.initialize()
        setAiInitialized(success)
        if (!success) {
          setError('Failed to initialize AI analysis')
        }
      } catch (err) {
        setError('AI initialization error: ' + err.message)
        console.error('AI initialization failed:', err)
      }
    }

    initializeAI()
    
    // Load session history from storage
    const history = userDataService.getSessions().slice(0, 10)
    setSessionHistory(history)
  }, [])

  // Calculate performance metrics from real AI data
  const calculatePerformanceMetrics = () => {
    if (!realTimeData) {
      return {
        technicalScore: 0,
        componentScore: 0,
        overallScore: 0,
        improvement: '+0.0',
        elements: [],
        components: []
      }
    }

    const analysis = realTimeData.analysis
    if (!analysis) return { technicalScore: 0, componentScore: 0, overallScore: 0, improvement: '+0.0', elements: [], components: [] }

    // Convert AI analysis to ISU-style scoring
    const technicalScore = ((analysis.balance?.score || 0) + (analysis.stability?.score || 0)) / 20 // Convert to 0-10 scale
    const componentScore = ((analysis.posture?.score || 0) + (analysis.armPosition?.score || 0)) / 20
    const overallScore = (technicalScore + componentScore) / 2

    const elements = [
      { 
        name: 'Balance Control', 
        score: (analysis.balance?.score || 0) / 10, 
        level: analysis.balance?.score > 80 ? 'Level 4' : analysis.balance?.score > 60 ? 'Level 3' : 'Level 2', 
        trend: 'up' 
      },
      { 
        name: 'Posture Quality', 
        score: (analysis.posture?.score || 0) / 10, 
        level: analysis.posture?.score > 80 ? 'Level 4' : analysis.posture?.score > 60 ? 'Level 3' : 'Level 2', 
        trend: 'up' 
      },
      { 
        name: 'Arm Position', 
        score: (analysis.armPosition?.score || 0) / 10, 
        level: analysis.armPosition?.score > 80 ? 'Level 4' : analysis.armPosition?.score > 60 ? 'Level 3' : 'Level 2', 
        trend: 'stable' 
      },
      { 
        name: 'Stability', 
        score: (analysis.stability?.score || 0) / 10, 
        level: analysis.stability?.score > 80 ? 'Level 4' : analysis.stability?.score > 60 ? 'Level 3' : 'Level 2', 
        trend: 'up' 
      }
    ]

    const components = [
      { name: 'Skating Skills', score: technicalScore, trend: 'up' },
      { name: 'Transitions', score: componentScore * 0.9, trend: 'up' },
      { name: 'Performance', score: componentScore * 1.1, trend: 'stable' },
      { name: 'Composition', score: technicalScore * 0.95, trend: 'up' }
    ]

    return {
      technicalScore: Math.round(technicalScore * 10) / 10,
      componentScore: Math.round(componentScore * 10) / 10,
      overallScore: Math.round(overallScore * 10) / 10,
      improvement: '+0.3',
      elements,
      components
    }
  }

  const performanceMetrics = calculatePerformanceMetrics()

  const startSession = async () => {
    if (!aiInitialized) {
      setError('AI service not initialized')
      return
    }

    try {
      // Get camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      })
      
      streamRef.current = stream
      const video = videoRef.current
      video.srcObject = stream
      video.play()

      setIsRecording(true)
      setCurrentSession({
        id: Date.now(),
        startTime: new Date(),
        duration: 0
      })
      setError(null)

      // Start real-time analysis
      const analyzeFrame = async () => {
        if (video.readyState === 4 && isRecording) {
          try {
            const analysis = await aiAnalysisService.analyzeFrame(video)
            if (analysis) {
              setRealTimeData(analysis)
            }
          } catch (error) {
            console.error('Real-time analysis error:', error)
          }
        }
        
        if (isRecording) {
          setTimeout(analyzeFrame, 100) // Analyze every 100ms
        }
      }

      analyzeFrame()
      
    } catch (error) {
      setError('Camera access denied: ' + error.message)
      console.error('Camera access error:', error)
    }
  }

  const stopSession = () => {
    setIsRecording(false)
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Save session to history
    if (currentSession && realTimeData) {
      const endTime = new Date()
      const duration = endTime - currentSession.startTime
      const metrics = calculatePerformanceMetrics()
      
      const sessionData = {
        ...currentSession,
        endTime,
        duration,
        metrics,
        finalAnalysis: realTimeData.analysis,
        elementsDetected: metrics.elements?.length || 0
      }
      
      // Save to user data service
      const savedSession = userDataService.saveSession(sessionData)
      if (savedSession) {
        setSessionHistory(prev => [savedSession, ...prev.slice(0, 9)]) // Keep last 10 sessions
      }
    }
    
    setCurrentSession(null)
    setRealTimeData(null)
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
    <div className="space-y-4 lg:space-y-6 px-2 lg:px-0">
      {/* Session Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Live Analysis Session
            {!aiInitialized && (
              <Badge variant="destructive" className="ml-2">
                <Loader className="h-3 w-3 mr-1 animate-spin" />
                Initializing AI
              </Badge>
            )}
            {aiInitialized && (
              <Badge variant="default" className="ml-2">
                <Activity className="h-3 w-3 mr-1" />
                AI Ready
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Start real-time analysis using your camera to analyze ice dance performance with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                {error}
              </div>
            )}
            
            {/* Camera Preview */}
            <div className="relative bg-gray-100 rounded-lg h-48 lg:h-64 overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ display: isRecording ? 'block' : 'none' }}
                autoPlay
                muted
              />
              {!isRecording && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2" />
                    <p>Camera feed will appear here during recording</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={startSession}
                disabled={isRecording || !aiInitialized}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isRecording ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRecording ? 'Recording...' : 'Start Recording'}
              </button>
              <button
                onClick={stopSession}
                disabled={!isRecording}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Pause className="h-4 w-4" />
                Stop Recording
              </button>
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
                onClick={() => {
                  setRealTimeData(null)
                  setSessionHistory([])
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
            
            {/* Real-time Analysis Display */}
            {isRecording && realTimeData && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Live AI Analysis Active</span>
                  <span className="text-sm">Confidence: {Math.round((realTimeData.confidence || 0) * 100)}%</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-sm">
                  <div>
                    <span className="text-green-600">Balance:</span>
                    <span className="ml-2 font-semibold">{realTimeData.analysis?.balance?.score || 0}%</span>
                  </div>
                  <div>
                    <span className="text-green-600">Posture:</span>
                    <span className="ml-2 font-semibold">{realTimeData.analysis?.posture?.score || 0}%</span>
                  </div>
                  <div>
                    <span className="text-green-600">Stability:</span>
                    <span className="ml-2 font-semibold">{realTimeData.analysis?.stability?.score || 0}%</span>
                  </div>
                  <div>
                    <span className="text-green-600">Arms:</span>
                    <span className="ml-2 font-semibold">{realTimeData.analysis?.armPosition?.score || 0}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
          <CardTitle>Real-time Technical Analysis</CardTitle>
          <CardDescription>
            AI-powered analysis of ice dance fundamentals and positioning
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
                    {element.score.toFixed(1)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                    {component.score.toFixed(1)}
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>
                Personalized suggestions based on your performance analysis and data history
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <button 
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                onClick={() => {
                  const report = userDataService.generatePerformanceReport()
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `ice_dance_report_${new Date().toISOString().split('T')[0]}.json`
                  a.click()
                }}
              >
                <Download className="h-3 w-3" />
                Export Report
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(() => {
              const recommendations = userDataService.getTrainingRecommendations()
              if (recommendations.length === 0) {
                return (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Getting Started</h4>
                    <p className="text-blue-700 text-sm">
                      Complete a few analysis sessions to receive personalized AI recommendations.
                    </p>
                  </div>
                )
              }
              
              return recommendations.slice(0, 5).map((rec, index) => {
                const bgColor = rec.type === 'improvement' ? 'bg-yellow-50 border-yellow-200' :
                               rec.type === 'strength' ? 'bg-green-50 border-green-200' :
                               'bg-blue-50 border-blue-200'
                
                const textColor = rec.type === 'improvement' ? 'text-yellow-800' :
                                 rec.type === 'strength' ? 'text-green-800' :
                                 'text-blue-800'
                
                return (
                  <div key={index} className={`p-3 ${bgColor} border rounded-lg`}>
                    <h4 className={`font-semibold ${textColor}`}>
                      {rec.element ? `${rec.element} Focus` : rec.message}
                    </h4>
                    <p className={`${textColor} text-sm`}>
                      {rec.suggestion}
                    </p>
                    {rec.priority === 'high' && (
                      <Badge variant="destructive" className="mt-2 text-xs">
                        High Priority
                      </Badge>
                    )}
                  </div>
                )
              })
            })()}
            
            {/* Performance Statistics */}
            {(() => {
              const stats = userDataService.getPerformanceStats()
              if (stats.totalSessions > 0) {
                return (
                  <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-2">Your Progress Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Total Sessions:</span>
                        <span className="ml-2 font-semibold">{stats.totalSessions}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Average Score:</span>
                        <span className="ml-2 font-semibold">{stats.averageScore}/10</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Best Score:</span>
                        <span className="ml-2 font-semibold">{stats.bestScore}/10</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Improvement:</span>
                        <span className={`ml-2 font-semibold ${
                          stats.improvement > 0 ? 'text-green-600' : 
                          stats.improvement < 0 ? 'text-red-600' : 'text-slate-600'
                        }`}>
                          {stats.improvement > 0 ? '+' : ''}{stats.improvement}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsDashboard