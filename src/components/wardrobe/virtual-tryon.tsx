import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClothingItem } from '@/types/wardrobe'
import { Eye, EyeOff } from 'lucide-react'

interface VirtualTryOnProps {
  userPhoto: string | null
  item: ClothingItem
  className?: string
}

export const VirtualTryOn = ({ userPhoto, item, className }: VirtualTryOnProps) => {
  const [showTryOn, setShowTryOn] = useState(false)

  if (!userPhoto) {
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center">
          <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <h3 className="font-semibold mb-1">{item.name}</h3>
          <p className="text-sm text-muted-foreground capitalize mb-2">{item.category}</p>
          <p className="text-xs text-muted-foreground">Upload a photo to see virtual try-on</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="relative aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
          {showTryOn ? (
            <div className="relative w-full h-full">
              {/* User's photo as background */}
              <img 
                src={userPhoto} 
                alt="Your photo"
                className="w-full h-full object-cover rounded-lg"
              />
              {/* Clothing item overlay with blend mode */}
              <div 
                className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60 mix-blend-multiply"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
              {/* Clothing item positioned based on category */}
              <div className={`absolute ${getClothingPosition(item.category)}`}>
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-auto opacity-80 mix-blend-overlay"
                />
              </div>
            </div>
          ) : (
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
          <div className="flex flex-wrap gap-1">
            {item.occasions.map((occasion) => (
              <span 
                key={occasion} 
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {occasion}
              </span>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTryOn(!showTryOn)}
            className="w-full mt-2"
          >
            {showTryOn ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Show Item Only
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Virtual Try-On
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to position clothing items on the user's photo
const getClothingPosition = (category: string) => {
  switch (category) {
    case 'tops':
      return 'top-1/4 left-1/2 transform -translate-x-1/2 w-3/4'
    case 'bottoms':
      return 'bottom-1/4 left-1/2 transform -translate-x-1/2 w-3/4'
    case 'dresses':
      return 'top-1/4 left-1/2 transform -translate-x-1/2 w-3/4 h-3/4'
    case 'outerwear':
      return 'top-1/6 left-1/2 transform -translate-x-1/2 w-4/5'
    case 'accessories':
      return 'top-1/8 left-1/2 transform -translate-x-1/2 w-1/2'
    case 'shoes':
      return 'bottom-2 left-1/2 transform -translate-x-1/2 w-1/2'
    default:
      return 'top-1/4 left-1/2 transform -translate-x-1/2 w-3/4'
  }
}