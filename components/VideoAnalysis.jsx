import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import aiAnalysisService from '../services/aiAnalysisService'
import isuScoringService from '../services/isuScoringService'
import { 
  Camera, 
  Play, 
  Pause, 
  Square, 
  Upload, 
  Download,
  Eye,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Loader,
  Activity
} from 'lucide-react'

const VideoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentElement, setCurrentElement] = useState(null)
  const [detectedElements, setDetectedElements] = useState([])
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [aiInitialized, setAiInitialized] = useState(false)
  const [error, setError] = useState(null)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [isPinching, setIsPinching] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Initialize AI service on component mount
  useEffect(() => {
    const initializeAI = async () => {
      try {
        const success = await aiAnalysisService.initialize()
        setAiInitialized(success)
        if (!success) {
          setError('Failed to initialize AI analysis. Please refresh and try again.')
        }
      } catch (err) {
        setError('AI initialization error: ' + err.message)
        console.error('AI initialization failed:', err)
      }
    }

    initializeAI()
  }, [])

  // Real AI analysis functions
  const startAnalysis = async () => {
    if (!aiInitialized) {
      setError('AI service not initialized. Please wait and try again.')
      return
    }

    if (!videoFile) {
      setError('Please upload a video file first.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setDetectedElements([])
    setError(null)
    
    try {
      const video = videoRef.current
      video.src = URL.createObjectURL(videoFile)
      
      await new Promise((resolve) => {
        video.onloadeddata = resolve
      })

      // Analyze video with real AI
      const results = await aiAnalysisService.analyzeVideo(video, (progress) => {
        setAnalysisProgress(progress)
      })

      // Convert AI results to display format
      const elementsWithScores = results.elements.map(element => {
        const level = isuScoringService.determineLevelOfDifficulty(element.type, element.analysis || {})
        const goe = isuScoringService.calculateGOE(element.type, level, element.analysis || {})
        const score = isuScoringService.calculateTechnicalScore(element, level, goe)
        
        return {
          id: element.id || Date.now() + Math.random(),
          name: element.type.charAt(0).toUpperCase() + element.type.slice(1),
          timestamp: new Date(element.startTime).toISOString().substr(14, 5),
          confidence: Math.round(element.confidence * 100),
          level: level,
          score: score.totalScore,
          goe: goe.goe,
          issues: this.generateIssuesFromGOE(goe),
          recommendations: this.generateRecommendationsFromGOE(goe, element.type)
        }
      })

      setDetectedElements(elementsWithScores)
      setAnalysisProgress(100)
      
    } catch (error) {
      console.error('Analysis failed:', error)
      setError('Analysis failed: ' + error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Generate issues from GOE analysis
  const generateIssuesFromGOE = (goe) => {
    const issues = []
    if (goe.goe < 0) {
      Object.entries(goe.factors || {}).forEach(([factor, data]) => {
        if (data.score < 0) {
          issues.push(data.description || `${factor} needs improvement`)
        }
      })
    }
    return issues.length > 0 ? issues : ['Minor technical adjustments needed']
  }

  // Generate recommendations from GOE analysis
  const generateRecommendationsFromGOE = (goe, elementType) => {
    const recommendations = []
    Object.entries(goe.factors || {}).forEach(([factor, data]) => {
      if (data.recommendation && data.score < 2) {
        recommendations.push(data.recommendation)
      }
    })
    return recommendations.length > 0 ? recommendations : [`Continue practicing ${elementType} technique`]
  }

  // Mobile touch gesture handlers
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStartY(e.touches[0].clientY)
      setTouchStartX(e.touches[0].clientX)
    } else if (e.touches.length === 2) {
      setIsPinching(true)
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      setTouchStartY(distance)
    }
  }

  const handleTouchMove = (e) => {
    if (isPinching && e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const scale = distance / touchStartY
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * scale)))
      setTouchStartY(distance)
    }
  }

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setIsPinching(false)
    }
    
    if (e.changedTouches.length === 1 && !isPinching) {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY - touchEndY
      const deltaX = touchStartX - touchEndX
      
      // Swipe up to start analysis
      if (deltaY > 50 && Math.abs(deltaX) < 100) {
        if (!isAnalyzing && videoFile && aiInitialized) {
          startAnalysis()
        }
      }
      
      // Swipe down to stop analysis  
      if (deltaY < -50 && Math.abs(deltaX) < 100) {
        if (isAnalyzing) {
          setIsAnalyzing(false)
        }
      }
      
      // Double tap to toggle real-time analysis
      if (Math.abs(deltaY) < 20 && Math.abs(deltaX) < 20) {
        const now = Date.now()
        if (now - (handleTouchEnd.lastTap || 0) < 300) {
          if (!isAnalyzing && aiInitialized) {
            startRealTimeAnalysis()
          }
        }
        handleTouchEnd.lastTap = now
      }
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setVideoFile(file)
      setError(null)
      console.log('Video file uploaded:', file.name)
      
      // Create preview
      const video = videoRef.current
      if (video) {
        video.src = URL.createObjectURL(file)
      }
    }
  }

  // Real-time camera analysis
  const startRealTimeAnalysis = async () => {
    if (!aiInitialized) {
      setError('AI service not initialized')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      })
      
      const video = videoRef.current
      video.srcObject = stream
      video.play()

      // Start real-time analysis loop
      const analyzeFrame = async () => {
        if (video.readyState === 4) {
          try {
            const analysis = await aiAnalysisService.analyzeFrame(video)
            if (analysis) {
              setRealTimeAnalysis(analysis)
              drawPoseOverlay(analysis.pose)
            }
          } catch (error) {
            console.error('Real-time analysis error:', error)
          }
        }
        
        if (isAnalyzing) {
          requestAnimationFrame(analyzeFrame)
        }
      }

      setIsAnalyzing(true)
      analyzeFrame()
      
    } catch (error) {
      setError('Camera access denied: ' + error.message)
    }
  }

  // Draw pose overlay on canvas
  const drawPoseOverlay = (pose) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    
    if (!canvas || !video || !pose) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw keypoints
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath()
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = keypoint.score > 0.7 ? '#00ff00' : '#ffff00'
        ctx.fill()
      }
    })
    
    // Draw skeleton connections
    drawSkeleton(ctx, pose.keypoints)
  }

  // Draw skeleton connections
  const drawSkeleton = (ctx, keypoints) => {
    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle']
    ]

    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = 2

    connections.forEach(([pointA, pointB]) => {
      const keypointA = keypoints.find(kp => kp.name === pointA)
      const keypointB = keypoints.find(kp => kp.name === pointB)
      
      if (keypointA && keypointB && keypointA.score > 0.3 && keypointB.score > 0.3) {
        ctx.beginPath()
        ctx.moveTo(keypointA.x, keypointA.y)
        ctx.lineTo(keypointB.x, keypointB.y)
        ctx.stroke()
      }
    })
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreColor = (score) => {
    if (score >= 8.0) return 'text-green-600'
    if (score >= 7.0) return 'text-blue-600'
    if (score >= 6.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Video Upload and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Video Analysis
            {!aiInitialized && (
              <Badge variant="destructive" className="ml-2">
                <Loader className="h-3 w-3 mr-1 animate-spin" />
                Initializing AI
              </Badge>
            )}
            {aiInitialized && (
              <Badge variant="default" className="ml-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                AI Ready
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Upload your ice dance performance video for real AI-powered analysis using TensorFlow.js
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
            
            {/* Video Preview Area */}
            <div 
              className="relative bg-gray-100 rounded-lg h-48 lg:h-64 flex items-center justify-center overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove} 
              onTouchEnd={handleTouchEnd}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
            >
              <video
                ref={videoRef}
                className="max-w-full max-h-full"
                controls={videoFile}
                style={{ display: videoFile ? 'block' : 'none' }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 pointer-events-none"
                style={{ display: realTimeAnalysis ? 'block' : 'none' }}
              />
              {!videoFile && (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload your ice dance performance video</p>
                  <div className="text-xs text-gray-500 mb-4 md:hidden">
                    <p>Touch gestures:</p>
                    <p>• Swipe up: Start analysis</p>
                    <p>• Swipe down: Stop analysis</p> 
                    <p>• Double tap: Live camera</p>
                    <p>• Pinch: Zoom video</p>
                  </div>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!aiInitialized}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Video File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Analysis Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                onClick={startAnalysis}
                disabled={isAnalyzing || !videoFile || !aiInitialized}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
              </Button>
              
              <Button 
                onClick={startRealTimeAnalysis}
                disabled={isAnalyzing || !aiInitialized}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
              >
                <Activity className="h-4 w-4 mr-2" />
                Live Camera Analysis
              </Button>
              
              <Button 
                variant="outline" 
                disabled={!isAnalyzing}
                className="w-full sm:w-auto"
                onClick={() => {
                  setIsAnalyzing(false)
                  if (videoRef.current && videoRef.current.srcObject) {
                    videoRef.current.srcObject.getTracks().forEach(track => track.stop())
                  }
                }}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
              
              {videoFile && (
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setVideoFile(null)
                    setDetectedElements([])
                    if (videoRef.current) {
                      videoRef.current.src = ''
                    }
                  }}
                >
                  Clear Video
                </Button>
              )}
            </div>

            {/* Real-time Analysis Display */}
            {realTimeAnalysis && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Live Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Balance:</span>
                    <span className="ml-2 font-semibold">{realTimeAnalysis.analysis?.balance?.score || 0}%</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Posture:</span>
                    <span className="ml-2 font-semibold">{realTimeAnalysis.analysis?.posture?.score || 0}%</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Stability:</span>
                    <span className="ml-2 font-semibold">{realTimeAnalysis.analysis?.stability?.score || 0}%</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Confidence:</span>
                    <span className="ml-2 font-semibold">{Math.round((realTimeAnalysis.confidence || 0) * 100)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Progress */}
            {isAnalyzing && analysisProgress < 100 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing video with AI...</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Analysis Overlay */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Real-time Analysis Overlay
          </CardTitle>
          <CardDescription>
            AI-powered motion tracking and element detection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-900 rounded-lg h-80 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="mb-4">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <p className="text-blue-400">Motion Tracking Active</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Tracking skater position</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Analyzing body posture</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Detecting technical elements</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Elements */}
      {detectedElements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detected Elements</CardTitle>
            <CardDescription>
              AI-identified technical elements with analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detectedElements.map((element) => (
                <div key={element.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{element.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{element.level}</Badge>
                          <span className="text-sm text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {element.timestamp}
                          </span>
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
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Confidence</h5>
                      <div className={`text-lg font-semibold ${getConfidenceColor(element.confidence)}`}>
                        {element.confidence}%
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Issues Detected</h5>
                      <div className="space-y-1">
                        {element.issues.map((issue, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle className="h-3 w-3" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h5 className="font-medium text-gray-700 mb-2">Recommendations</h5>
                    <div className="space-y-1">
                      {element.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Analysis Settings
          </CardTitle>
          <CardDescription>
            Configure AI analysis parameters for optimal results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Detection Sensitivity</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="sensitivity" value="high" className="mr-2" />
                  High (More elements detected)
                </label>
                <label className="flex items-center">
                  <input type="radio" name="sensitivity" value="medium" className="mr-2" defaultChecked />
                  Medium (Balanced detection)
                </label>
                <label className="flex items-center">
                  <input type="radio" name="sensitivity" value="low" className="mr-2" />
                  Low (Only clear elements)
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Analysis Focus</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Technical Elements
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Program Components
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Artistic Expression
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Ice Coverage
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VideoAnalysis