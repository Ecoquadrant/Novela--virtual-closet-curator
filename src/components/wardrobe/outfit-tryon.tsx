import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OutfitSuggestion } from '@/types/wardrobe'
import { Eye, EyeOff, Heart, X } from 'lucide-react'

interface OutfitTryOnProps {
  suggestion: OutfitSuggestion
  userPhoto: string | null
  onLike: () => void
  onDislike: () => void
}

export const OutfitTryOn = ({ suggestion, userPhoto, onLike, onDislike }: OutfitTryOnProps) => {
  const [showTryOn, setShowTryOn] = useState(true)
  const { outfit } = suggestion

  if (!userPhoto) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-lg">{outfit.name}</CardTitle>
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Match: {Math.round(suggestion.matchScore * 100)}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {outfit.items.map((item) => (
              <div key={item.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Upload a photo to see this outfit on you!
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDislike}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Pass
            </Button>
            <Button 
              size="sm" 
              onClick={onLike}
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-1" />
              Love It
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-lg">{outfit.name}</CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Match: {Math.round(suggestion.matchScore * 100)}%</span>
          <span>•</span>
          <span className="capitalize">{outfit.occasion}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
          {showTryOn ? (
            <div className="relative w-full h-full">
              {/* User's photo as background */}
              <img 
                src={userPhoto} 
                alt="Your photo"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay outfit items */}
              {outfit.items.map((item, index) => (
                <div 
                  key={item.id}
                  className={`absolute ${getItemPosition(item.category, index)}`}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-auto opacity-75 mix-blend-multiply"
                  />
                </div>
              ))}
              
              {/* Gradient overlay for better blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-4 h-full">
              {outfit.items.map((item) => (
                <div key={item.id} className="aspect-square bg-background rounded-lg overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant={showTryOn ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTryOn(!showTryOn)}
              className="flex-1"
            >
              {showTryOn ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Show Items
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Virtual Try-On
                </>
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            {suggestion.reasoning}
          </p>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDislike}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Pass
            </Button>
            <Button 
              size="sm" 
              onClick={onLike}
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
            >
              <Heart className="w-4 h-4 mr-1" />
              Love It
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to position items in outfit try-on
const getItemPosition = (category: string, index: number) => {
  switch (category) {
    case 'tops':
      return 'top-1/4 left-1/2 transform -translate-x-1/2 w-2/3'
    case 'bottoms':
      return 'bottom-1/3 left-1/2 transform -translate-x-1/2 w-2/3'
    case 'dresses':
      return 'top-1/4 left-1/2 transform -translate-x-1/2 w-3/4 h-2/3'
    case 'outerwear':
      return 'top-1/6 left-1/2 transform -translate-x-1/2 w-4/5'
    case 'accessories':
      return index === 0 ? 'top-2 left-1/2 transform -translate-x-1/2 w-1/3' : 'top-1/3 right-4 w-1/4'
    case 'shoes':
      return 'bottom-2 left-1/2 transform -translate-x-1/2 w-1/2'
    default:
      return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3'
  }
}