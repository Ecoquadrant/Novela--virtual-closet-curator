import { useState } from "react"
import { OutfitSuggestion } from "@/types/wardrobe"
import { SwipeCard } from "@/components/ui/swipe-card"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clothing3DViewer } from "@/components/ui/clothing-3d-viewer"
import { Heart, X, Shuffle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OutfitSwiperProps {
  suggestions: OutfitSuggestion[]
  onLike?: (suggestion: OutfitSuggestion) => void
  onDislike?: (suggestion: OutfitSuggestion) => void
  onShuffle?: () => void
}

export const OutfitSwiper = ({ 
  suggestions, 
  onLike, 
  onDislike, 
  onShuffle 
}: OutfitSwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSwipeRight = () => {
    const current = suggestions[currentIndex]
    onLike?.(current)
    setCurrentIndex((prev) => (prev + 1) % suggestions.length)
  }

  const handleSwipeLeft = () => {
    const current = suggestions[currentIndex]
    onDislike?.(current)
    setCurrentIndex((prev) => (prev + 1) % suggestions.length)
  }

  if (suggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-8">
        <div className="text-6xl mb-4">👗</div>
        <h3 className="text-xl font-semibold mb-2">No outfits yet</h3>
        <p className="text-muted-foreground mb-6">
          Add some clothing items to get personalized outfit suggestions
        </p>
      </div>
    )
  }

  const currentSuggestion = suggestions[currentIndex]

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Perfect for {currentSuggestion.outfit.occasion}
        </h2>
        <p className="text-muted-foreground mt-1">
          {currentIndex + 1} of {suggestions.length}
        </p>
      </div>

      <SwipeCard
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        className="w-full max-w-sm"
      >
        <Card className={cn(
          "overflow-hidden bg-gradient-to-br from-card via-card to-muted/30",
          "border-border/50 shadow-card"
        )}>
          <CardContent className="p-0">
            <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-secondary/20 to-accent/20">
              <div className="grid grid-cols-2 gap-2 p-4 h-full">
                {currentSuggestion.outfit.items.slice(0, 4).map((item, index) => (
                  <div 
                    key={item.id} 
                    className={cn(
                      "rounded-lg overflow-hidden bg-gradient-to-br from-background/30 to-muted/20",
                      index === 0 && currentSuggestion.outfit.items.length === 1 && "col-span-2"
                    )}
                  >
                    <Clothing3DViewer 
                      imageUrl={item.imageUrl}
                      className="w-full h-full"
                      autoRotate={true}
                      enableControls={false}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{currentSuggestion.outfit.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentSuggestion.reasoning}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {currentSuggestion.outfit.items.map((item) => (
                  <Badge 
                    key={item.id}
                    variant="secondary"
                    className="bg-secondary/60"
                  >
                    {item.name}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-center items-center gap-4 pt-4">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {Math.round(currentSuggestion.matchScore * 100)}% match
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </SwipeCard>

      <div className="flex justify-center items-center gap-6">
        <Button
          variant="outline"
          size="lg"
          onClick={handleSwipeLeft}
          className="rounded-full w-14 h-14 border-destructive/30 hover:bg-destructive/10"
        >
          <X className="w-6 h-6 text-destructive" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={onShuffle}
          className="rounded-full w-12 h-12"
        >
          <Shuffle className="w-5 h-5" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleSwipeRight}
          className="rounded-full w-14 h-14 border-accent/30 hover:bg-accent/10"
        >
          <Heart className="w-6 h-6 text-accent" />
        </Button>
      </div>
    </div>
  )
}