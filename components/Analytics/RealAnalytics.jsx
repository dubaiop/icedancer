import { useState, useEffect, useCallback } from 'react'
import analyticsService from '../../services/analyticsService'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Trophy, 
  BarChart3,
  LineChart,
  Activity,
  Calendar,
  Award,
  Star,
  Zap,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react'

const RealAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overall')
  const [isLoading, setIsLoading] = useState(false)
  const [performanceData, setPerformanceData] = useState({})
  const [historicalData, setHistoricalData] = useState([])
  const [elementData, setElementData] = useState([])
  const [recentSessions, setRecentSessions] = useState([])
  const [aiInsights, setAiInsights] = useState([])

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange, loadAnalyticsData])

  const loadAnalyticsData = useCallback(() => {
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      setPerformanceData(analyticsService.getCurrentMetrics())
      setHistoricalData(analyticsService.getPerformanceData(timeRange))
      setElementData(analyticsService.getElementPerformance())
      setRecentSessions(analyticsService.getRecentSessions())
      setAiInsights(analyticsService.getAIInsights())
      setIsLoading(false)
    }, 500)
  }, [timeRange])





  const renderPerformanceChart = () => {
    const data = historicalData
    const maxValue = 10
    const chartHeight = 200
    const chartWidth = 600
    const padding = 40
    const usableWidth = chartWidth - (padding * 2)
    const usableHeight = chartHeight - (padding * 2)
    
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * usableWidth
      const y = padding + usableHeight - (point[selectedMetric] / maxValue) * usableHeight
      return { x, y, value: point[selectedMetric] }
    })

    return (
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map((value) => {
            const y = padding + usableHeight - (value / maxValue) * usableHeight
            return (
              <line
                key={value}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            )
          })}
          
          {/* Performance line */}
          <path
            d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              className="hover:r-6 transition-all"
            />
          ))}
        </svg>
      </div>
    )
  }

  const renderElementChart = () => {
    return (
      <div className="space-y-4">
        {elementData.map((element, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-24 text-sm font-medium">{element.element}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">{element.score}/10</span>
                <span className="text-xs text-green-600">{element.improvement}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(element.score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
            <Badge variant={element.difficulty === 'Advanced' ? 'destructive' : 'secondary'}>
              {element.difficulty}
            </Badge>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>
          <p className="text-slate-600">Track your progress and identify areas for improvement</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {Object.entries(performanceData).map(([key, data]) => (
          <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 capitalize">{key} Score</p>
                  <p className="text-3xl font-bold text-slate-900">{data.current}</p>
                  <div className="flex items-center mt-2">
                    {data.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {data.change} from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  {key === 'overall' && <Trophy className="h-6 w-6 text-blue-600" />}
                  {key === 'technical' && <Target className="h-6 w-6 text-blue-600" />}
                  {key === 'artistic' && <Star className="h-6 w-6 text-blue-600" />}
                  {key === 'components' && <Award className="h-6 w-6 text-blue-600" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Track your performance over time across different metrics
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {Object.keys(performanceData).map((metric) => (
                <Button
                  key={metric}
                  variant={selectedMetric === metric ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedMetric(metric)}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderPerformanceChart()}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Element Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Element Performance
            </CardTitle>
            <CardDescription>
              Detailed breakdown of individual element scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderElementChart()}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>
              Your latest training and performance sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{session.program}</h4>
                      <p className="text-sm text-slate-600">{session.date}</p>
                      <p className="text-sm text-slate-500">{session.duration} • {session.elements} elements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{session.score}</div>
                    <Badge variant="outline" className="text-xs">
                      {session.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Personalized analysis and improvement suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge 
                      variant={
                        insight.type === 'strength' ? 'default' :
                        insight.type === 'improvement' ? 'destructive' : 'secondary'
                      }
                    >
                      {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Confidence</div>
                      <div className="text-lg font-bold text-blue-600">{insight.confidence}%</div>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-2">{insight.title}</h4>
                  <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Impact: {insight.impact}</span>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics</CardTitle>
          <CardDescription>
            Download your performance data for further analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV Data
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Share Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RealAnalytics 