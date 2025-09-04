import { ClothingItem } from "@/types/wardrobe"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clothing3DViewer } from "@/components/ui/clothing-3d-viewer"
import { cn } from "@/lib/utils"

interface WardrobeGridProps {
  items: ClothingItem[]
  onItemClick?: (item: ClothingItem) => void
}

export const WardrobeGrid = ({ items, onItemClick }: WardrobeGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {items.map((item) => (
        <Card 
          key={item.id}
          className={cn(
            "group cursor-pointer overflow-hidden",
            "bg-gradient-to-br from-card to-muted/50",
            "border-border/50 hover:border-primary/50",
            "shadow-soft hover:shadow-card",
            "transition-all duration-300"
          )}
          onClick={() => onItemClick?.(item)}
        >
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-background/50 to-muted/30">
              <Clothing3DViewer 
                imageUrl={item.imageUrl}
                category={item.category}
                className="w-full h-full"
                autoRotate={true}
                enableControls={false}
              />
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-medium text-sm text-card-foreground truncate">
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-secondary/80 text-secondary-foreground"
                >
                  {item.category}
                </Badge>
                {item.occasions.slice(0, 1).map((occasion) => (
                  <Badge 
                    key={occasion}
                    variant="outline" 
                    className="text-xs border-primary/30 text-primary"
                  >
                    {occasion}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}