import { useState, useCallback, useEffect } from "react"
import { ClothingItem, Outfit, OutfitSuggestion, Occasion } from "@/types/wardrobe"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"

export const useWardrobe = () => {
  const { user } = useAuth()
  const [items, setItems] = useState<ClothingItem[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)

  // Load wardrobe items from Supabase
  const loadItems = useCallback(async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('wardrobe_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedItems: ClothingItem[] = data?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category as ClothingItem['category'],
        imageUrl: item.image_url || '',
        colors: item.colors || [],
        tags: item.tags || [],
        occasions: (item.occasions || ['casual']) as Occasion[],
        brand: item.brand,
        price: item.price ? Number(item.price) : undefined,
        createdAt: new Date(item.created_at)
      })) || []

      setItems(formattedItems)

      // Add sample data if user has no items
      if (formattedItems.length === 0) {
        await addSampleData()
      }
    } catch (error) {
      console.error('Error loading wardrobe:', error)
      toast.error('Failed to load your wardrobe')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Add sample data with brand and price
  const addSampleData = useCallback(async () => {
    if (!user) return

    const sampleItems = [
      {
        name: "Classic White Button-up",
        category: "tops" as const,
        image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
        colors: ["white"],
        tags: ["professional", "versatile"],
        occasions: ["work", "formal", "casual"],
        brand: "Ralph Lauren",
        price: 89.99,
        user_id: user.id
      },
      {
        name: "Black Tailored Trousers",
        category: "bottoms" as const,
        image_url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop",
        colors: ["black"],
        tags: ["professional", "elegant"],
        occasions: ["work", "formal"],
        brand: "Hugo Boss",
        price: 149.99,
        user_id: user.id
      },
      {
        name: "Floral Summer Dress",
        category: "dresses" as const,
        image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
        colors: ["pink", "green"],
        tags: ["feminine", "summer"],
        occasions: ["casual", "date", "party"],
        brand: "Zara",
        price: 59.99,
        user_id: user.id
      },
      {
        name: "Designer Leather Handbag",
        category: "bags" as const,
        image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
        colors: ["brown"],
        tags: ["luxury", "versatile"],
        occasions: ["work", "formal", "casual"],
        brand: "Gucci",
        price: 1299.99,
        user_id: user.id
      },
      {
        name: "Casual Denim Jacket",
        category: "outerwear" as const,
        image_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
        colors: ["blue"],
        tags: ["casual", "trendy"],
        occasions: ["casual", "date"],
        brand: "Levi's",
        price: 79.99,
        user_id: user.id
      },
      {
        name: "Black High Heels",
        category: "shoes" as const,
        image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop",
        colors: ["black"],
        tags: ["formal", "elegant"],
        occasions: ["work", "formal", "party"],
        brand: "Christian Louboutin",
        price: 695.00,
        user_id: user.id
      }
    ]

    try {
      const { error } = await supabase
        .from('wardrobe_items')
        .insert(sampleItems)

      if (error) throw error
      
      toast.success("Sample wardrobe items added!")
      loadItems() // Reload items
    } catch (error) {
      console.error('Error adding sample data:', error)
    }
  }, [user, loadItems])

  // Load items when user changes
  useEffect(() => {
    if (user) {
      loadItems()
    }
  }, [user, loadItems])

  const addItem = useCallback(async (newItem: Partial<ClothingItem>) => {
    if (!user) return

    const itemData = {
      user_id: user.id,
      name: newItem.name || "New Item",
      category: newItem.category || "tops",
      image_url: newItem.imageUrl || "",
      colors: newItem.colors || [],
      tags: newItem.tags || [],
      occasions: newItem.occasions || ["casual"],
      brand: newItem.brand,
      price: newItem.price
    }
    
    try {
      const { data, error } = await supabase
        .from('wardrobe_items')
        .insert([itemData])
        .select()
        .single()

      if (error) throw error

      const item: ClothingItem = {
        id: data.id,
        name: data.name,
        category: data.category as ClothingItem['category'],
        imageUrl: data.image_url || '',
        colors: data.colors || [],
        tags: data.tags || [],
        occasions: (data.occasions || ['casual']) as Occasion[],
        brand: data.brand,
        price: data.price ? Number(data.price) : undefined,
        createdAt: new Date(data.created_at)
      }

      setItems(prev => [item, ...prev])
      toast.success("Item added to your wardrobe!")
      return item
    } catch (error) {
      console.error('Error adding item:', error)
      toast.error('Failed to add item')
    }
  }, [user])

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

  const deleteOutfit = useCallback((outfitId: string) => {
    setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId))
    toast.success("Outfit removed from collection!")
  }, [])

  const toggleFavoriteOutfit = useCallback((outfitId: string) => {
    setOutfits(prev => prev.map(outfit => 
      outfit.id === outfitId 
        ? { ...outfit, isFavorite: !outfit.isFavorite }
        : outfit
    ))
  }, [])

  return {
    items,
    outfits,
    loading,
    addItem,
    generateOutfitSuggestions,
    saveOutfit,
    deleteOutfit,
    toggleFavoriteOutfit,
    reload: loadItems
  }
}