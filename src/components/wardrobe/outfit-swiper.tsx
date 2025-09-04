import { useState } from "react"
import { OutfitSuggestion } from "@/types/wardrobe"
import { SwipeCard } from "@/components/ui/swipe-card"
import { OutfitTryOn } from "./outfit-tryon"
import { Button } from "@/components/ui/button"
import { Shuffle, Sparkles } from "lucide-react"

interface OutfitSwiperProps {
  suggestions: OutfitSuggestion[]
  userPhoto?: string | null
  onLike?: (suggestion: OutfitSuggestion) => void
  onDislike?: (suggestion: OutfitSuggestion) => void
  onShuffle?: () => void
}

export const OutfitSwiper = ({ 
  suggestions, 
  userPhoto,
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

      <div className="relative max-w-md mx-auto">
        <SwipeCard
          onSwipeLeft={() => handleSwipeLeft()}
          onSwipeRight={() => handleSwipeRight()}
        >
          <OutfitTryOn
            suggestion={currentSuggestion}
            userPhoto={userPhoto}
            onLike={() => handleSwipeRight()}
            onDislike={() => handleSwipeLeft()}
          />
        </SwipeCard>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onShuffle}
          className="rounded-full border-primary/30 hover:bg-primary/10"
        >
          <Shuffle className="w-5 h-5 mr-2" />
          Shuffle
        </Button>
      </div>
    </div>
  )
}