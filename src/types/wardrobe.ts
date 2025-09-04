export interface ClothingItem {
  id: string
  name: string
  category: ClothingCategory
  imageUrl: string
  colors: string[]
  tags: string[]
  occasions: Occasion[]
  createdAt: Date
}

export type ClothingCategory = 
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'bags'

export type Occasion = 
  | 'casual'
  | 'work'
  | 'formal'
  | 'party'
  | 'date'
  | 'workout'
  | 'vacation'
  | 'special-event'

export interface Outfit {
  id: string
  name: string
  items: ClothingItem[]
  occasion: Occasion
  createdAt: Date
  isFavorite: boolean
}

export interface OutfitSuggestion {
  id: string
  outfit: Outfit
  matchScore: number
  reasoning: string
}