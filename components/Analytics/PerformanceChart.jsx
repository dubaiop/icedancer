import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Calendar,
  Target,
  Star,
  Award
} from 'lucide-react'

const PerformanceChart = ({ data, timeRange, selectedMetric }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  const renderLineChart = () => {
    const maxValue = 10
    const chartHeight = 300
    const chartWidth = 800
    const padding = 50
    const usableWidth = chartWidth - (padding * 2)
    const usableHeight = chartHeight - (padding * 2)
    
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * usableWidth
      const y = padding + usableHeight - (point[selectedMetric] / maxValue) * usableHeight
      return { x, y, value: point[selectedMetric], date: point.date }
    })

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ')

    return (
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map((value) => {
            const y = padding + usableHeight - (value / maxValue) * usableHeight
            return (
              <g key={value}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-slate-500"
                >
                  {value}
                </text>
              </g>
            )
          })}
          
          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={chartHeight - 10}
              textAnchor="middle"
              className="text-xs fill-slate-500"
            >
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          ))}
          
          {/* Performance line */}
          <path
            d={pathData}
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
            className="transition-all duration-300"
          />
          
          {/* Gradient fill */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <path
            d={`${pathData} L ${points[points.length - 1].x},${chartHeight - padding} L ${points[0].x},${chartHeight - padding} Z`}
            fill="url(#chartGradient)"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === index ? "6" : "4"}
              fill="#3b82f6"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}
          
          {/* Hover tooltip */}
          {hoveredPoint !== null && (
            <g>
              <rect
                x={points[hoveredPoint].x - 40}
                y={points[hoveredPoint].y - 60}
                width="80"
                height="40"
                fill="#1f2937"
                rx="4"
              />
              <text
                x={points[hoveredPoint].x}
                y={points[hoveredPoint].y - 45}
                textAnchor="middle"
                className="text-xs fill-white font-medium"
              >
                {points[hoveredPoint].value}
              </text>
              <text
                x={points[hoveredPoint].x}
                y={points[hoveredPoint].y - 30}
                textAnchor="middle"
                className="text-xs fill-gray-300"
              >
                {new Date(points[hoveredPoint].date).toLocaleDateString()}
              </text>
            </g>
          )}
        </svg>
      </div>
    )
  }

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d[selectedMetric]))
    const chartHeight = 300
    const chartWidth = 800
    const padding = 50
    const barWidth = (chartWidth - (padding * 2)) / data.length - 10
    const usableHeight = chartHeight - (padding * 2)

    return (
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10].map((value) => {
            const y = padding + usableHeight - (value / maxValue) * usableHeight
            return (
              <g key={value}>
                <line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-slate-500"
                >
                  {value}
                </text>
              </g>
            )
          })}
          
          {/* Bars */}
          {data.map((point, index) => {
            const barHeight = (point[selectedMetric] / maxValue) * usableHeight
            const x = padding + index * ((chartWidth - (padding * 2)) / data.length) + 5
            const y = padding + usableHeight - barHeight
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#3b82f6"
                  className="transition-all duration-300 hover:fill-blue-700"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className="text-xs fill-slate-500"
                >
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-slate-700 font-medium"
                >
                  {point[selectedMetric]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    )
  }

  const renderRadarChart = () => {
    const metrics = ['overall', 'technical', 'artistic', 'components']
    const currentData = data[data.length - 1] || {}
    const chartSize = 300
    const centerX = chartSize / 2
    const centerY = chartSize / 2
    const radius = 100

    const points = metrics.map((metric, index) => {
      const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2
      const value = currentData[metric] || 0
      const pointRadius = (value / 10) * radius
      const x = centerX + pointRadius * Math.cos(angle)
      const y = centerY + pointRadius * Math.sin(angle)
      return { x, y, metric, value, angle }
    })

    const pathData = `${points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`
    ).join(' ')} Z`

    return (
      <div className="relative">
        <svg width={chartSize} height={chartSize} className="w-full">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((percent) => (
            <circle
              key={percent}
              cx={centerX}
              cy={centerY}
              r={(percent / 100) * radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis lines */}
          {points.map((point, index) => (
            <line
              key={index}
              x1={centerX}
              y1={centerY}
              x2={centerX + radius * Math.cos(point.angle)}
              y2={centerY + radius * Math.sin(point.angle)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Data area */}
          <path
            d={pathData}
            fill="#3b82f6"
            fillOpacity="0.3"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
              />
              <text
                x={centerX + (radius + 20) * Math.cos(point.angle)}
                y={centerY + (radius + 20) * Math.sin(point.angle)}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs fill-slate-700 font-medium"
              >
                {`${point.metric.charAt(0).toUpperCase()}${point.metric.slice(1)}`}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Performance Visualization
            </CardTitle>
            <CardDescription>
              Interactive charts showing your performance trends
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <LineChart className="h-4 w-4 mr-1" />
              Line
            </Button>
            <Button size="sm" variant="outline">
              <BarChart3 className="h-4 w-4 mr-1" />
              Bar
            </Button>
            <Button size="sm" variant="outline">
              <PieChart className="h-4 w-4 mr-1" />
              Radar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderLineChart()}
      </CardContent>
    </Card>
  )
}

export default PerformanceChart 