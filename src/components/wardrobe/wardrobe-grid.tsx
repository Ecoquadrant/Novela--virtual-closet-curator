import { ClothingItem } from "@/types/wardrobe"
import { VirtualTryOn } from "./virtual-tryon"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WardrobeGridProps {
  items: ClothingItem[]
  userPhoto?: string | null
  onItemClick?: (item: ClothingItem) => void
}

export const WardrobeGrid = ({ items, userPhoto, onItemClick }: WardrobeGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-6">
      {items.map((item) => (
        <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-4">
            <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-muted">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
              {(item.brand || item.price) && (
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {item.brand && <span className="font-medium">{item.brand}</span>}
                  {item.price && <span>${item.price.toFixed(2)}</span>}
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {item.occasions.slice(0, 2).map((occasion) => (
                  <Badge key={occasion} variant="secondary" className="text-xs px-2 py-0.5">
                    {occasion}
                  </Badge>
                ))}
                {item.occasions.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{item.occasions.length - 2}
                  </Badge>
                )}
              </div>
              <VirtualTryOn 
                item={item} 
                userPhoto={userPhoto}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}