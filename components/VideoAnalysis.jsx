import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
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
  Settings
} from 'lucide-react'

const VideoAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentElement, setCurrentElement] = useState(null)
  const [detectedElements, setDetectedElements] = useState([])
  const fileInputRef = useRef(null)

  const mockElements = [
    {
      id: 1,
      name: 'Twizzle Sequence',
      timestamp: '00:15.3',
      confidence: 94,
      level: 'Level 4',
      score: 8.5,
      issues: ['Slight wobble in final rotation'],
      recommendations: ['Maintain consistent rotation speed']
    },
    {
      id: 2,
      name: 'Lift Element',
      timestamp: '00:32.1',
      confidence: 97,
      level: 'Level 3',
      score: 7.9,
      issues: ['Entry could be smoother'],
      recommendations: ['Practice entry technique']
    },
    {
      id: 3,
      name: 'Step Sequence',
      timestamp: '00:48.7',
      confidence: 91,
      level: 'Level 4',
      score: 8.1,
      issues: ['Edge quality varies'],
      recommendations: ['Focus on edge consistency']
    }
  ]

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setDetectedElements([])
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setDetectedElements(mockElements)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      console.log('File uploaded:', file.name)
      // Here you would typically upload the file and start analysis
    }
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
          </CardTitle>
          <CardDescription>
            Upload your ice dance performance video for AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video Preview Area */}
            <div className="relative bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Upload your ice dance performance video</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
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
            </div>

            {/* Analysis Controls */}
            <div className="flex gap-4">
              <Button 
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Analysis
              </Button>
              <Button variant="outline" disabled={!isAnalyzing}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button variant="outline" disabled={!isAnalyzing}>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing video...</span>
                  <span>{analysisProgress}%</span>
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