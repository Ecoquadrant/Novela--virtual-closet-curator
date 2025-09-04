import { ClothingItem } from "@/types/wardrobe"
import { VirtualTryOn } from "./virtual-tryon"

interface WardrobeGridProps {
  items: ClothingItem[]
  userPhoto?: string | null
  onItemClick?: (item: ClothingItem) => void
}

export const WardrobeGrid = ({ items, userPhoto, onItemClick }: WardrobeGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {items.map((item) => (
        <VirtualTryOn
          key={item.id}
          item={item}
          userPhoto={userPhoto}
          className={`group cursor-pointer hover:shadow-lg transition-all duration-200 ${
            onItemClick ? 'hover:scale-105' : ''
          }`}
        />
      ))}
    </div>
  )
}