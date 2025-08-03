import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { iceDanceGallery, midjourneyIceDanceImages } from '../assets/midjourney-ice-dance.js'
import { 
  Sparkles, 
  Camera, 
  Star, 
  Heart, 
  Share2, 
  Download,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause
} from 'lucide-react'

const MidjourneyShowcase = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [favorites, setFavorites] = useState([])

  const toggleFavorite = (imageId) => {
    setFavorites(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    )
  }

  const nextImage = () => {
    setSelectedImage(prev => prev < iceDanceGallery.length - 1 ? prev + 1 : 0)
  }

  const prevImage = () => {
    setSelectedImage(prev => prev > 0 ? prev - 1 : iceDanceGallery.length - 1)
  }

  const startSlideshow = () => {
    setIsPlaying(true)
    const interval = setInterval(() => {
      setSelectedImage(prev => {
        if (prev >= iceDanceGallery.length - 1) {
          setIsPlaying(false)
          clearInterval(interval)
          return 0
        }
        return prev + 1
      })
    }, 3000)
  }

  const stopSlideshow = () => {
    setIsPlaying(false)
  }

  const currentImage = iceDanceGallery[selectedImage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Midjourney Ice Dance Collection
            </h1>
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-generated artistic ice dance photography showcasing the beauty, grace, and technical excellence of the sport
          </p>
        </div>

        {/* Main Image Display */}
        <div className="max-w-6xl mx-auto mb-8">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="relative group">
                <img 
                  src={currentImage.image} 
                  alt={currentImage.title}
                  className="w-full h-[600px] object-cover rounded-t-lg"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{currentImage.title}</h3>
                        <p className="text-gray-200 mb-3">{currentImage.description}</p>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {currentImage.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => toggleFavorite(currentImage.id)}
                          variant="outline"
                          size="sm"
                          className={`border-white/30 text-white hover:bg-white/10 ${
                            favorites.includes(currentImage.id) ? 'bg-red-500/20 border-red-400' : ''
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(currentImage.id) ? 'fill-red-400' : ''}`} />
                        </Button>
                        <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ArrowRight className="h-6 w-6" />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            onClick={isPlaying ? stopSlideshow : startSlideshow}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? 'Stop Slideshow' : 'Start Slideshow'}
          </Button>
          <div className="text-center">
            <span className="text-sm text-gray-400">Image {selectedImage + 1} of {iceDanceGallery.length}</span>
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {iceDanceGallery.map((image, index) => (
              <Card 
                key={image.id} 
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedImage === index 
                    ? 'border-yellow-400 bg-yellow-400/10' 
                    : 'border-white/10 bg-black/20 hover:border-white/30'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={image.image} 
                      alt={image.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-lg"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-xs font-semibold text-white truncate">{image.title}</h4>
                      <Badge className="text-xs bg-white/20 text-white border-white/30 mt-1">
                        {image.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Image Information */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-yellow-400" />
                About This Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-400">Artistic Vision</h4>
                  <p className="text-gray-300 leading-relaxed">
                    This collection showcases the intersection of human artistry and AI creativity, 
                    capturing the essence of ice dance through Midjourney's unique artistic lens. 
                    Each image represents the perfect blend of technical precision and emotional expression.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-yellow-400">Technical Excellence</h4>
                  <p className="text-gray-300 leading-relaxed">
                    From elegant twizzles to powerful lifts, these images highlight the technical 
                    mastery required in ice dance while maintaining the artistic beauty that makes 
                    this sport so captivating to audiences worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MidjourneyShowcase 