import { useState, useCallback } from "react"
import { ClothingItem, Outfit, OutfitSuggestion, Occasion } from "@/types/wardrobe"
import { toast } from "sonner"

// Sample data for demo
const sampleItems: ClothingItem[] = [
  {
    id: "1",
    name: "Classic White Button-up",
    category: "tops",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    colors: ["white"],
    tags: ["professional", "versatile"],
    occasions: ["work", "formal", "casual"],
    createdAt: new Date()
  },
  {
    id: "2", 
    name: "Black Tailored Trousers",
    category: "bottoms",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
    colors: ["black"],
    tags: ["professional", "elegant"],
    occasions: ["work", "formal"],
    createdAt: new Date()
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    category: "dresses", 
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
    colors: ["pink", "green"],
    tags: ["feminine", "summer"],
    occasions: ["casual", "date", "party"],
    createdAt: new Date()
  }
]

export const useWardrobe = () => {
  const [items, setItems] = useState<ClothingItem[]>(sampleItems)
  const [outfits, setOutfits] = useState<Outfit[]>([])

  const addItem = useCallback((newItem: Partial<ClothingItem>) => {
    const item: ClothingItem = {
      id: Date.now().toString(),
      name: newItem.name || "New Item",
      category: newItem.category || "tops",
      imageUrl: newItem.imageUrl || "",
      colors: newItem.colors || [],
      tags: newItem.tags || [],
      occasions: newItem.occasions || ["casual"],
      createdAt: new Date()
    }
    
    setItems(prev => [...prev, item])
    toast.success("Item added to your wardrobe!")
    return item
  }, [])

  const generateOutfitSuggestions = useCallback((occasion: Occasion, vibe?: string): OutfitSuggestion[] => {
    // Simple outfit generation logic
    const relevantItems = items.filter(item => 
      item.occasions.includes(occasion)
    )

    if (relevantItems.length < 2) {
      return []
    }

    // Create sample outfit combinations
    const suggestions: OutfitSuggestion[] = []
    
    for (let i = 0; i < Math.min(5, relevantItems.length); i++) {
      const outfit: Outfit = {
        id: `outfit-${Date.now()}-${i}`,
        name: `${occasion} Outfit ${i + 1}`,
        items: relevantItems.slice(i, i + 2),
        occasion,
        createdAt: new Date(),
        isFavorite: false
      }

      suggestions.push({
        id: `suggestion-${Date.now()}-${i}`,
        outfit,
        matchScore: 0.8 + Math.random() * 0.2,
        reasoning: `Perfect for ${occasion} occasions${vibe ? ` with ${vibe} vibes` : ""}`
      })
    }

    return suggestions
  }, [items])

  const saveOutfit = useCallback((outfit: Outfit) => {
    setOutfits(prev => [...prev, outfit])
    toast.success("Outfit saved to your collection!")
  }, [])

  return {
    items,
    outfits,
    addItem,
    generateOutfitSuggestions,
    saveOutfit
  }
}