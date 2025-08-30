import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useAuth } from '../../src/contexts/AuthContext'
import authService from '../../services/authService'
import userDataService from '../../services/userDataService'
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  MessageSquare,
  Eye,
  Send,
  UserPlus,
  BarChart3,
  Target,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Star,
  Activity
} from 'lucide-react'

const CoachDashboard = () => {
  const { user } = useAuth()
  const [athletes, setAthletes] = useState([])
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [inviteCode, setInviteCode] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(false)

  useEffect(() => {
    if (user && user.role === 'coach') {
      loadCoachData()
    }
  }, [user])

  const loadCoachData = () => {
    // Load athletes assigned to this coach
    const coachAthletes = authService.getCoachAthletes(user.id)
    setAthletes(coachAthletes)
    
    if (coachAthletes.length > 0 && !selectedAthlete) {
      setSelectedAthlete(coachAthletes[0])
      loadAthleteMessages(coachAthletes[0].id)
    }
  }

  const loadAthleteMessages = (athleteId) => {
    // Load messages between coach and athlete
    const athleteMessages = userDataService.getCoachAthleteMessages(user.id, athleteId)
    setMessages(athleteMessages)
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedAthlete) return

    const message = {
      id: Date.now(),
      from: user.id,
      to: selectedAthlete.id,
      message: newMessage,
      timestamp: new Date(),
      fromRole: 'coach',
      read: false
    }

    userDataService.saveMessage(message)
    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  const sendInvitation = () => {
    if (!inviteCode.trim()) return

    // In a real app, this would send an email invitation
    // For demo, we'll simulate finding and connecting the athlete
    const athlete = authService.findUserByEmail(inviteCode)
    if (athlete && athlete.role === 'athlete') {
      authService.assignCoachToAthlete(user.id, athlete.id)
      loadCoachData()
      setInviteCode('')
      setShowInviteForm(false)
      alert(`Successfully connected with ${athlete.name}!`)
    } else {
      alert('Athlete not found or invalid email address.')
    }
  }

  const getPerformanceOverview = (athlete) => {
    const sessions = userDataService.getUserSessions(athlete.id)
    const stats = userDataService.getUserStats(athlete.id)
    
    return {
      totalSessions: sessions.length,
      averageScore: stats.averageScore || 0,
      improvement: stats.improvement || 0,
      lastActive: sessions.length > 0 ? new Date(sessions[0].endTime).toLocaleDateString() : 'Never',
      strengths: ['Twizzles', 'Lifts'],
      needsWork: ['Spins', 'Transitions']
    }
  }

  if (!user || user.role !== 'coach') {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coach Access Required</h2>
          <p className="text-gray-600">
            This dashboard is only available for coach accounts. Please log in with a coach account to access athlete management features.
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Coach Dashboard</h1>
          <p className="text-gray-600">Manage your athletes and track their progress</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => setShowInviteForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Athlete
          </Button>
        </div>
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Invite New Athlete</CardTitle>
            <CardDescription>
              Enter the athlete's email address to send an invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="athlete@example.com"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex gap-2">
                <Button onClick={sendInvitation} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowInviteForm(false)
                    setInviteCode('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {athletes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Athletes Yet</h3>
            <p className="text-gray-600 mb-6">
              Start by inviting athletes to connect with you for training and progress tracking.
            </p>
            <Button 
              onClick={() => setShowInviteForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Your First Athlete
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Athletes List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Athletes ({athletes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {athletes.map((athlete) => {
                    const overview = getPerformanceOverview(athlete)
                    return (
                      <div
                        key={athlete.id}
                        onClick={() => {
                          setSelectedAthlete(athlete)
                          loadAthleteMessages(athlete.id)
                        }}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAthlete?.id === athlete.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{athlete.name}</h4>
                            <p className="text-sm text-gray-600">{athlete.level || 'Intermediate'}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Avg: {overview.averageScore.toFixed(1)}</span>
                              <span>Sessions: {overview.totalSessions}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              variant={overview.improvement > 0 ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {overview.improvement > 0 ? '+' : ''}{overview.improvement.toFixed(1)}
                            </Badge>
                            <span className="text-xs text-gray-500">{overview.lastActive}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Athlete Details */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {selectedAthlete && (
              <>
                {/* Athlete Performance Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {selectedAthlete.name} - Performance Overview
                    </CardTitle>
                    <CardDescription>
                      Real-time progress tracking and analysis insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const overview = getPerformanceOverview(selectedAthlete)
                      return (
                        <div className="space-y-4">
                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">{overview.totalSessions}</div>
                              <div className="text-sm text-blue-800">Sessions</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">{overview.averageScore.toFixed(1)}</div>
                              <div className="text-sm text-green-800">Avg Score</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className={`text-2xl font-bold ${overview.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {overview.improvement > 0 ? '+' : ''}{overview.improvement.toFixed(1)}
                              </div>
                              <div className="text-sm text-purple-800">Improvement</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-bold text-gray-600">{overview.lastActive}</div>
                              <div className="text-sm text-gray-800">Last Active</div>
                            </div>
                          </div>

                          {/* Strengths and Areas for Improvement */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                Strengths
                              </h4>
                              <div className="space-y-1">
                                {overview.strengths.map((strength, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                                    <CheckCircle className="h-3 w-3" />
                                    {strength}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Focus Areas
                              </h4>
                              <div className="space-y-1">
                                {overview.needsWork.map((area, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-yellow-700">
                                    <Target className="h-3 w-3" />
                                    {area}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>

                {/* Coaching Communication */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Coaching Notes & Communication
                    </CardTitle>
                    <CardDescription>
                      Send feedback and track communication with {selectedAthlete.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Message History */}
                      <div className="h-48 overflow-y-auto bg-gray-50 border rounded-lg p-4 space-y-3">
                        {messages.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p>No messages yet. Start the conversation!</p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.fromRole === 'coach' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                  message.fromRole === 'coach'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-200'
                                }`}
                              >
                                <p>{message.message}</p>
                                <p className={`text-xs mt-1 ${
                                  message.fromRole === 'coach' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Send New Message */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your coaching feedback..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Button 
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CoachDashboard