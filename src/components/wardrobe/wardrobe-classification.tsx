import { useState } from "react"
import { ClothingItem } from "@/types/wardrobe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WardrobeGrid } from "./wardrobe-grid"
import { Crown, DollarSign, Filter, TrendingUp, Sparkles } from "lucide-react"

interface WardrobeClassificationProps {
  items: ClothingItem[]
  userPhoto?: string | null
}

export const WardrobeClassification = ({ items, userPhoto }: WardrobeClassificationProps) => {
  const [sortBy, setSortBy] = useState<"brand" | "price" | "category">("brand")
  const [priceFilter, setPriceFilter] = useState<string>("all")

  // Get unique brands
  const brands = [...new Set(items.filter(item => item.brand).map(item => item.brand!))]
    .sort((a, b) => a.localeCompare(b))

  // Price ranges
  const priceRanges = [
    { label: "Budget ($0-$50)", min: 0, max: 50, key: "budget" },
    { label: "Mid-Range ($51-$200)", min: 51, max: 200, key: "midrange" },
    { label: "Premium ($201-$500)", min: 201, max: 500, key: "premium" },
    { label: "Luxury ($500+)", min: 501, max: Infinity, key: "luxury" }
  ]

  // Filter items by price range
  const getItemsByPriceRange = (range: typeof priceRanges[0]) => {
    return items.filter(item => {
      if (!item.price) return false
      return item.price >= range.min && item.price <= range.max
    })
  }

  // Get items by brand
  const getItemsByBrand = (brand: string) => {
    return items.filter(item => item.brand === brand)
  }

  // Sort items by price
  const sortItemsByPrice = (ascending = true) => {
    return [...items]
      .filter(item => item.price !== undefined)
      .sort((a, b) => ascending ? (a.price! - b.price!) : (b.price! - a.price!))
  }

  // Get total wardrobe value
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0)

  // Get most expensive item
  const mostExpensive = items.reduce((max, item) => 
    (item.price || 0) > (max.price || 0) ? item : max, 
    items[0]
  )

  // Brand statistics
  const brandStats = brands.map(brand => {
    const brandItems = getItemsByBrand(brand)
    const avgPrice = brandItems.reduce((sum, item) => sum + (item.price || 0), 0) / brandItems.length
    const totalValue = brandItems.reduce((sum, item) => sum + (item.price || 0), 0)
    
    return {
      brand,
      count: brandItems.length,
      avgPrice,
      totalValue,
      items: brandItems
    }
  }).sort((a, b) => b.totalValue - a.totalValue)

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Most Valuable</p>
                <p className="text-lg font-bold truncate">{mostExpensive?.brand || "N/A"}</p>
                <p className="text-sm text-muted-foreground">${mostExpensive?.price?.toFixed(2) || "0"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-muted/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-secondary-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Unique Brands</p>
                <p className="text-2xl font-bold">{brands.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classification Tabs */}
      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50">
          <TabsTrigger value="brand" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            By Brand
          </TabsTrigger>
          <TabsTrigger value="price" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            By Price Range
          </TabsTrigger>
          <TabsTrigger value="sorted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Price Sorted
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="space-y-6">
          <div className="space-y-6">
            {brandStats.map(({ brand, count, avgPrice, totalValue, items: brandItems }) => (
              <Card key={brand} className="bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {brand}
                      </Badge>
                      <span className="text-sm font-normal text-muted-foreground">
                        {count} items • Avg: ${avgPrice.toFixed(2)}
                      </span>
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="text-lg font-bold text-primary">${totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 pb-4">
                  <WardrobeGrid items={brandItems} userPhoto={userPhoto} />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="price" className="space-y-6">
          <div className="space-y-6">
            {priceRanges.map((range) => {
              const rangeItems = getItemsByPriceRange(range)
              const rangeTotal = rangeItems.reduce((sum, item) => sum + (item.price || 0), 0)
              
              if (rangeItems.length === 0) return null

              const getBadgeVariant = () => {
                switch (range.key) {
                  case "budget": return "secondary"
                  case "midrange": return "outline"  
                  case "premium": return "default"
                  case "luxury": return "destructive"
                  default: return "secondary"
                }
              }

              return (
                <Card key={range.key} className="bg-gradient-to-br from-card to-muted/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge variant={getBadgeVariant()}>
                          {range.label}
                        </Badge>
                        <span className="text-sm font-normal text-muted-foreground">
                          {rangeItems.length} items
                        </span>
                      </CardTitle>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-lg font-bold text-primary">${rangeTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pb-4">
                    <WardrobeGrid items={rangeItems} userPhoto={userPhoto} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="sorted" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("price")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Highest to Lowest
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortBy("brand")}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Lowest to Highest
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-0 pt-4">
              <WardrobeGrid 
                items={sortBy === "price" ? sortItemsByPrice(false) : sortItemsByPrice(true)} 
                userPhoto={userPhoto} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}