import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { iceDanceGallery } from '../assets/midjourney-ice-dance.js'

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0)

  const images = iceDanceGallery.map(item => ({
    src: item.image,
    alt: item.title,
    title: item.title,
    description: item.description,
    category: item.category
  }))

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <Card>
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={images[selectedImage].src} 
              alt={images[selectedImage].alt}
              className="w-full h-96 object-cover rounded-t-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-xl font-semibold">
                {images[selectedImage].title}
              </h3>
              <p className="text-white/80 text-sm mt-1">
                {images[selectedImage].description}
              </p>
              <Badge className="mt-2 bg-white/20 text-white border-white/30">
                {images[selectedImage].category}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedImage === index ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <CardContent className="p-0">
              <img 
                src={image.src} 
                alt={image.alt}
                className="w-full h-24 object-cover rounded-lg"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Image Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Previous
        </button>
        <span className="text-gray-600">
          {selectedImage + 1} of {images.length}
        </span>
        <button
          onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ImageGallery 