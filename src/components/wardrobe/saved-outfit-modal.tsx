import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Outfit } from '@/types/wardrobe'
import { Eye, EyeOff, Trash2, Star } from 'lucide-react'

interface SavedOutfitModalProps {
  outfit: Outfit | null
  userPhoto: string | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (outfit: Outfit) => void
  onToggleFavorite?: (outfit: Outfit) => void
}

export const SavedOutfitModal = ({ 
  outfit, 
  userPhoto, 
  isOpen, 
  onClose, 
  onDelete,
  onToggleFavorite 
}: SavedOutfitModalProps) => {
  const [showTryOn, setShowTryOn] = useState(true)

  if (!outfit) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{outfit.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite?.(outfit)}
              >
                <Star className={`w-4 h-4 ${outfit.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(outfit)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            {userPhoto && showTryOn ? (
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

          {!userPhoto && (
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Eye className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload a profile photo to see virtual try-on
              </p>
              <p className="text-xs text-muted-foreground">
                Go to Profile tab → Camera button to add your photo
              </p>
            </div>
          )}

          {userPhoto && (
            <Button
              variant={showTryOn ? "default" : "outline"}
              onClick={() => setShowTryOn(!showTryOn)}
              className="w-full"
            >
              {showTryOn ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Show Items Separately
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Virtual Try-On
                </>
              )}
            </Button>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground capitalize">
              Perfect for {outfit.occasion} occasions
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {outfit.items.map((item) => (
                <span 
                  key={item.id}
                  className="text-xs bg-secondary/60 text-secondary-foreground px-2 py-1 rounded-full"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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