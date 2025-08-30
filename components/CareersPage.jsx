import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { 
  Sparkles, 
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
  Lightbulb,
  MapPin,
  Clock,
  DollarSign,
  Briefcase
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

function CareersPage() {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      description: "Lead the development of advanced computer vision models for ice dance analysis.",
      requirements: [
        "5+ years experience in computer vision and deep learning",
        "Expertise in PyTorch/TensorFlow",
        "Experience with pose estimation and motion analysis",
        "PhD in Computer Science or related field preferred"
      ],
      benefits: ["Competitive salary", "Equity", "Health insurance", "Flexible work"]
    },
    {
      title: "Sports Science Researcher",
      department: "Research",
      location: "Remote",
      type: "Full-time",
      salary: "$80k - $120k",
      description: "Research and develop new methodologies for ice dance performance analysis.",
      requirements: [
        "PhD in Sports Science or Biomechanics",
        "Experience with motion capture systems",
        "Knowledge of ice dance technique and judging",
        "Strong analytical and research skills"
      ],
      benefits: ["Competitive salary", "Research budget", "Conference attendance", "Health insurance"]
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "New York, NY",
      type: "Full-time",
      salary: "$90k - $140k",
      description: "Build beautiful, responsive user interfaces for our AI coaching platform.",
      requirements: [
        "3+ years experience with React/TypeScript",
        "Experience with modern CSS frameworks",
        "Understanding of UX/UI principles",
        "Passion for sports technology"
      ],
      benefits: ["Competitive salary", "Equity", "Health insurance", "Professional development"]
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$100k - $150k",
      description: "Drive product strategy and roadmap for our AI coaching platform.",
      requirements: [
        "3+ years in product management",
        "Experience with B2B SaaS products",
        "Background in sports or fitness technology",
        "Strong analytical and communication skills"
      ],
      benefits: ["Competitive salary", "Equity", "Health insurance", "Flexible work"]
    }
  ]

  const benefits = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Competitive Compensation",
      description: "Above-market salaries with equity packages and performance bonuses."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision coverage for you and your family."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Learning & Growth",
      description: "Professional development budget, conference attendance, and mentorship programs."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Flexible Work",
      description: "Remote work options, flexible hours, and unlimited PTO."
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Sports Culture",
      description: "Regular team activities, gym memberships, and sports event tickets."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Great Team",
      description: "Work with passionate, talented people who love sports and technology."
    }
  ]

  const values = [
    {
      title: "Innovation First",
      description: "We push boundaries and embrace new technologies to solve complex problems."
    },
    {
      title: "Athlete Focused",
      description: "Everything we build is designed to help athletes achieve their full potential."
    },
    {
      title: "Collaboration",
      description: "We believe the best solutions come from diverse teams working together."
    },
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from code to customer service."
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
              <Users className="h-3 w-3 mr-1" />
              Join Our Team
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
              Build the Future of
              <span className="block text-blue-600">Ice Dance Technology</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Join our mission to revolutionize ice dance training through AI. We&apos;re looking for passionate 
              engineers, researchers, and sports enthusiasts who want to make a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                onClick={() => document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' })}
              >
                View Open Positions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                Learn About Culture
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-4">
              <Heart className="h-3 w-3 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our values guide everything we do, from how we build products to how we treat each other.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
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

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
              <Award className="h-3 w-3 mr-1" />
              Benefits & Perks
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Work With Us
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We believe in taking care of our team so they can do their best work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                      {benefit.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 text-center">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 text-center">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="open-positions" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
              <Briefcase className="h-3 w-3 mr-1" />
              Open Positions
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ready to help us revolutionize ice dance training? Check out our current openings.
            </p>
          </div>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-900 mb-2">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{position.salary}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-2 lg:mt-0">
                      {position.department}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-700">{position.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {position.benefits.map((benefit, benefitIndex) => (
                        <Badge key={benefitIndex} variant="outline" className="text-sm">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
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
              Don&apos;t See the Right Role?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              We&apos;re always looking for talented people. Send us your resume and let&apos;s talk about how you can 
              contribute to our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Send Resume
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Globe className="mr-2 h-5 w-5" />
                Contact Us
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

export default CareersPage
