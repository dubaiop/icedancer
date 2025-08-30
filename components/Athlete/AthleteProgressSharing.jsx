import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useAuth } from '../../src/contexts/AuthContext'
import authService from '../../services/authService'
import userDataService from '../../services/userDataService'
import { 
  Share2, 
  Eye, 
  Download, 
  Calendar, 
  Trophy, 
  TrendingUp,
  BarChart3,
  MessageSquare,
  Clock,
  Target,
  Star,
  Activity,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react'

const AthleteProgressSharing = () => {
  const { user } = useAuth()
  const [coaches, setCoaches] = useState([])
  const [shareableReports, setShareableReports] = useState([])
  const [selectedSessions, setSelectedSessions] = useState([])
  const [shareSettings, setShareSettings] = useState({
    includeVideo: true,
    includeScores: true,
    includeAIAnalysis: true,
    includeRecommendations: true,
    privacy: 'coach-only'
  })
  const [shareLink, setShareLink] = useState('')

  useEffect(() => {
    if (user && user.role === 'athlete') {
      loadAthleteData()
    }
  }, [user])

  const loadAthleteData = () => {
    // Load assigned coaches
    const athleteCoaches = authService.getAthleteCoaches(user.id)
    setCoaches(athleteCoaches)
    
    // Load previous shareable reports
    const reports = userDataService.getSharedReports(user.id)
    setShareableReports(reports)
  }

  const generateShareableReport = () => {
    if (selectedSessions.length === 0) return

    const sessions = userDataService.getUserSessions(user.id)
      .filter(session => selectedSessions.includes(session.id))

    const report = {
      id: Date.now(),
      athleteId: user.id,
      athleteName: user.name,
      athleteLevel: user.level || 'Intermediate',
      generatedAt: new Date(),
      sessions: sessions.map(session => ({
        ...session,
        video: shareSettings.includeVideo ? session.video : null,
        scores: shareSettings.includeScores ? session.scores : null,
        aiAnalysis: shareSettings.includeAIAnalysis ? session.aiAnalysis : null,
        recommendations: shareSettings.includeRecommendations ? session.recommendations : null
      })),
      settings: shareSettings,
      statistics: userDataService.getUserStats(user.id),
      privacy: shareSettings.privacy
    }

    // Generate shareable link (in real app, this would create a secure token)
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const link = `${window.location.origin}/shared-report/${reportId}`
    
    const savedReport = {
      ...report,
      id: reportId,
      shareLink: link,
      accessCount: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }

    userDataService.saveSharedReport(savedReport)
    setShareableReports(prev => [savedReport, ...prev])
    setShareLink(link)
    setSelectedSessions([])
    
    return savedReport
  }

  const copyShareLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Share link copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy link. Please copy manually.')
    })
  }

  const sendToCoach = (reportId, coachId) => {
    const message = {
      id: Date.now(),
      from: user.id,
      to: coachId,
      message: `Hi! I've shared my latest progress report with you. You can view it here: ${window.location.origin}/shared-report/${reportId}`,
      timestamp: new Date(),
      fromRole: 'athlete',
      type: 'progress-report',
      reportId: reportId,
      read: false
    }

    userDataService.saveMessage(message)
    alert('Report shared with coach successfully!')
  }

  const getSessionStats = () => {
    const sessions = userDataService.getUserSessions(user.id)
    if (sessions.length === 0) {
      return {
        total: 0,
        recent: 0,
        averageScore: 0,
        bestScore: 0,
        improvement: 0
      }
    }

    const recentSessions = sessions.filter(session => {
      const sessionDate = new Date(session.endTime)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return sessionDate > thirtyDaysAgo
    })

    const scores = sessions.map(s => s.metrics?.overallScore || 0).filter(s => s > 0)
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0

    let improvement = 0
    if (sessions.length >= 2) {
      const recent = sessions.slice(0, Math.ceil(sessions.length / 2))
      const older = sessions.slice(Math.ceil(sessions.length / 2))
      
      const recentAvg = recent.reduce((sum, s) => sum + (s.metrics?.overallScore || 0), 0) / recent.length
      const olderAvg = older.reduce((sum, s) => sum + (s.metrics?.overallScore || 0), 0) / older.length
      
      improvement = recentAvg - olderAvg
    }

    return {
      total: sessions.length,
      recent: recentSessions.length,
      averageScore,
      bestScore,
      improvement
    }
  }

  const sessionStats = getSessionStats()
  const recentSessions = userDataService.getUserSessions(user.id).slice(0, 10)

  if (!user || user.role !== 'athlete') {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <Share2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Athlete Access Required</h2>
          <p className="text-gray-600">
            This feature is only available for athlete accounts. Log in as an athlete to share progress with coaches.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:space-y-6 px-2 lg:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Progress Sharing</h1>
          <p className="text-gray-600">Share your training progress and performance with coaches</p>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Your Training Overview
          </CardTitle>
          <CardDescription>
            Summary of your recent training sessions and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sessionStats.total}</div>
              <div className="text-sm text-blue-800">Total Sessions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sessionStats.averageScore.toFixed(1)}</div>
              <div className="text-sm text-green-800">Average Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{sessionStats.bestScore.toFixed(1)}</div>
              <div className="text-sm text-purple-800">Best Score</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className={`text-2xl font-bold ${sessionStats.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {sessionStats.improvement > 0 ? '+' : ''}{sessionStats.improvement.toFixed(1)}
              </div>
              <div className="text-sm text-orange-800">Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create New Share */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Create Progress Report
          </CardTitle>
          <CardDescription>
            Select sessions and settings to generate a shareable progress report
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Session Selection */}
            <div>
              <h4 className="font-semibold mb-3">Select Training Sessions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p>No training sessions found. Complete some sessions first!</p>
                  </div>
                ) : (
                  recentSessions.map((session) => (
                    <label
                      key={session.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(session.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSessions(prev => [...prev, session.id])
                          } else {
                            setSelectedSessions(prev => prev.filter(id => id !== session.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {new Date(session.endTime).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Score: {session.metrics?.overallScore?.toFixed(1) || 'N/A'} • 
                              Duration: {Math.round((session.duration || 0) / 60000)}min
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {session.elementsDetected || 0} elements
                          </Badge>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Share Settings */}
            <div>
              <h4 className="font-semibold mb-3">Share Settings</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareSettings.includeScores}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, includeScores: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span>Include performance scores</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareSettings.includeAIAnalysis}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, includeAIAnalysis: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span>Include AI analysis details</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareSettings.includeRecommendations}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, includeRecommendations: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span>Include training recommendations</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shareSettings.includeVideo}
                      onChange={(e) => setShareSettings(prev => ({ ...prev, includeVideo: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <span>Include video analysis (premium)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Report Button */}
            <div className="flex gap-3">
              <Button
                onClick={generateShareableReport}
                disabled={selectedSessions.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Generate Share Link
              </Button>
              
              {shareLink && (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button
                    onClick={() => copyShareLink(shareLink)}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Coaches */}
      {coaches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Connected Coaches
            </CardTitle>
            <CardDescription>
              Send progress reports directly to your coaches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {coaches.map((coach) => (
                <div key={coach.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{coach.name}</h4>
                      <p className="text-sm text-gray-600">{coach.email}</p>
                      <p className="text-xs text-gray-500">
                        Specialization: {coach.specialization || 'Ice Dance'}
                      </p>
                    </div>
                    <Button
                      onClick={() => shareableReports.length > 0 && sendToCoach(shareableReports[0].id, coach.id)}
                      disabled={shareableReports.length === 0}
                      variant="outline"
                      size="sm"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share Latest
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shared Reports History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Shared Reports History
          </CardTitle>
          <CardDescription>
            View and manage your previously shared progress reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {shareableReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Share2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No shared reports yet. Create your first progress report above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shareableReports.map((report) => (
                <div key={report.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          Report from {new Date(report.generatedAt).toLocaleDateString()}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {report.sessions.length} sessions
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Views: {report.accessCount || 0} • Privacy: {report.privacy}</p>
                        <p>Expires: {new Date(report.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyShareLink(report.shareLink)}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Link
                      </Button>
                      <Button
                        onClick={() => window.open(report.shareLink, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AthleteProgressSharing