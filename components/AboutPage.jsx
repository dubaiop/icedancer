import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { 
  Sparkles, 
  Target, 
  Users, 
  Trophy, 
  Brain, 
  Camera, 
  BarChart3, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Globe,
  Heart,
  Lightbulb
} from 'lucide-react'

// Import images
import { 
  iceDancingImage, 
  competitionImage, 
  aiSportsImage, 
  motionCaptureImage, 
  analyticsImage,
  trainingImage,
  performanceImage,
  coachingImage
} from '../assets/placeholder.js'

function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former Olympic ice dancer with 15+ years in sports technology. PhD in Computer Science from MIT.",
      avatar: "SC",
      expertise: ["AI/ML", "Sports Analytics", "Product Strategy"]
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder", 
      bio: "Computer vision expert with experience at Google and NVIDIA. Specializes in real-time video analysis.",
      avatar: "MR",
      expertise: ["Computer Vision", "Real-time Systems", "AI Engineering"]
    },
    {
      name: "Elena Petrov",
      role: "Head of Sports Science",
      bio: "Former ISU judge and sports scientist. 20+ years analyzing ice dance performance and technique.",
      avatar: "EP",
      expertise: ["Sports Science", "Judging Standards", "Performance Analysis"]
    },
    {
      name: "David Kim",
      role: "Lead AI Engineer",
      bio: "Machine learning specialist focused on pose estimation and movement analysis in sports applications.",
      avatar: "DK",
      expertise: ["Machine Learning", "Pose Estimation", "Sports AI"]
    }
  ]

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our technology and service, mirroring the dedication of ice dancers themselves."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion",
      description: "Our team shares the same passion for ice dance as the athletes we serve, driving us to create the best possible tools."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "We continuously push the boundaries of AI and computer vision to unlock new possibilities in sports training."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "We believe in building a supportive community of athletes, coaches, and technology enthusiasts."
    }
  ]

  const milestones = [
    {
      year: "2023",
      title: "Company Founded",
      description: "Started with a vision to revolutionize ice dance training through AI"
    },
    {
      year: "2024",
      title: "First AI Model",
      description: "Developed initial computer vision model for element recognition"
    },
    {
      year: "2024",
      title: "Beta Launch",
      description: "Launched beta version with 50+ professional athletes"
    },
    {
      year: "2025",
      title: "Public Launch",
      description: "Making AI-powered coaching accessible to all ice dancers"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">AI Ice Dancer</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/login'}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-6">
              <Sparkles className="h-3 w-3 mr-1" />
              Our Story
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Revolutionizing Ice Dance
              <span className="block text-blue-600">Through AI Innovation</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              We&apos;re a team of former athletes, engineers, and sports scientists passionate about pushing the boundaries 
              of what&apos;s possible in ice dance training. Our mission is to democratize elite-level coaching through 
              cutting-edge artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                onClick={() => window.location.href = '/demo'}
              >
                Try Our Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Target className="h-3 w-3 mr-1" />
                Our Mission
              </Badge>
              <h2 className="text-4xl font-bold text-slate-900">
                Empowering Every Ice Dancer
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                We believe that every ice dancer deserves access to the same level of analysis and feedback that 
                Olympic athletes receive. Our AI technology makes elite coaching accessible, affordable, and 
                available 24/7.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg text-slate-700">Democratize elite coaching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg text-slate-700">Provide objective, data-driven feedback</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg text-slate-700">Accelerate skill development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg text-slate-700">Build a global ice dance community</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={performanceImage} 
                  alt="Ice dancer in performance" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-800">AI Analysis in Action</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Real-time performance feedback</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-4">
              <Heart className="h-3 w-3 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What Drives Us Forward
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our core values guide everything we do, from product development to customer support.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                      {value.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
              <Users className="h-3 w-3 mr-1" />
              Meet Our Team
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              The Minds Behind the Magic
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our diverse team combines expertise in ice dance, artificial intelligence, and sports science 
              to create the most advanced coaching platform available.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {member.avatar}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 mb-4">
              <Trophy className="h-3 w-3 mr-1" />
              Our Journey
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Key Milestones
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From concept to reality, here&apos;s how we&apos;ve grown and evolved.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                  <CardTitle className="text-lg font-bold text-slate-900">{milestone.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">{milestone.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Join Us in Revolutionizing Ice Dance
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Be part of the future of ice dance training. Experience the power of AI-driven coaching today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                onClick={() => window.location.href = '/demo'}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Try Free Demo
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Globe className="mr-2 h-5 w-5" />
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

export default AboutPage
