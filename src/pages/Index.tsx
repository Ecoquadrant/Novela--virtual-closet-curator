import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CameraButton } from "@/components/ui/camera-button"
import { WardrobeGrid } from "@/components/wardrobe/wardrobe-grid"
import { OutfitSwiper } from "@/components/wardrobe/outfit-swiper"
import { SavedOutfitModal } from "@/components/wardrobe/saved-outfit-modal"
import { useWardrobe } from "@/hooks/use-wardrobe"
import { useAuth } from "@/contexts/AuthContext"
import { useProfile } from "@/hooks/use-profile"
import { Occasion, OutfitSuggestion, Outfit } from "@/types/wardrobe"
import { Sparkles, Shirt, Heart, LogOut, User, Eye } from "lucide-react"
import heroImage from "@/assets/wardrobe-hero.jpg"
import { toast } from "sonner"

const Index = () => {
  const { items, outfits, addItem, generateOutfitSuggestions, saveOutfit, deleteOutfit, toggleFavoriteOutfit } = useWardrobe()
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const [activeTab, setActiveTab] = useState("discover")
  const [occasionPrompt, setOccasionPrompt] = useState("")
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([])
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null)
  const [showOutfitModal, setShowOutfitModal] = useState(false)

  const handleImageCapture = (imageUrl: string) => {
    // In a real app, this would also analyze the image and extract details
    addItem({
      name: "New Item",
      imageUrl,
      category: "tops",
      occasions: ["casual"],
      colors: [],
      tags: []
    })
  }

  const handleGenerateOutfits = () => {
    if (!occasionPrompt.trim()) {
      toast.warning("Please describe the occasion or vibe you're going for!")
      return
    }

    // Simple keyword matching for occasion
    let occasion: Occasion = "casual"
    const prompt = occasionPrompt.toLowerCase()
    
    if (prompt.includes("work") || prompt.includes("office") || prompt.includes("professional")) {
      occasion = "work"
    } else if (prompt.includes("formal") || prompt.includes("elegant") || prompt.includes("fancy")) {
      occasion = "formal"
    } else if (prompt.includes("party") || prompt.includes("night") || prompt.includes("club")) {
      occasion = "party"
    } else if (prompt.includes("date") || prompt.includes("romantic")) {
      occasion = "date"
    }

    const newSuggestions = generateOutfitSuggestions(occasion, occasionPrompt)
    setSuggestions(newSuggestions)
    
    if (newSuggestions.length > 0) {
      setActiveTab("swipe")
      toast.success(`Found ${newSuggestions.length} perfect outfits for you!`)
    } else {
      toast.warning("Add more items to your wardrobe to get better suggestions!")
    }
  }

  const handleLikeOutfit = (suggestion: OutfitSuggestion) => {
    saveOutfit(suggestion.outfit)
    setSelectedOutfit(suggestion.outfit)
    setShowOutfitModal(true)
  }

  const handleDislikeOutfit = (suggestion: OutfitSuggestion) => {
    toast("Thanks for the feedback!")
  }

  const handleLogout = async () => {
    await signOut()
    toast.success("Signed out successfully")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Luxury wardrobe" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        </div>
        
        <div className="relative px-6 py-12">
          {/* User Profile Header */}
          <div className="absolute top-4 right-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || user?.email || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={() => window.location.href = '/profile-setup'}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Your Virtual Wardrobe
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Capture your style, discover perfect outfits, and never wonder what to wear again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <CameraButton onCapture={handleImageCapture} size="lg" />
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setActiveTab("wardrobe")}
                className="border-primary/30 hover:bg-primary/10"
              >
                <Shirt className="w-5 h-5 mr-2" />
                View Wardrobe ({items.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="discover" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="wardrobe" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shirt className="w-4 h-4 mr-2" />
              Wardrobe
            </TabsTrigger>
            <TabsTrigger value="swipe" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="w-4 h-4 mr-2" />
              Outfits
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Eye className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-8">
            <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  What's the vibe?
                </CardTitle>
                <CardDescription>
                  Describe the occasion, mood, or style you're going for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Input
                    placeholder="e.g., 'Casual coffee date', 'Professional meeting', 'Night out with friends'"
                    value={occasionPrompt}
                    onChange={(e) => setOccasionPrompt(e.target.value)}
                    className="text-center bg-background/50 border-border/50"
                  />
                  <Button 
                    onClick={handleGenerateOutfits}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Find Perfect Outfits
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Work Meeting", "Date Night", "Casual Hangout", "Special Event"].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      onClick={() => setOccasionPrompt(preset)}
                      className="text-xs border-primary/20 hover:bg-primary/10"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wardrobe">
            <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Wardrobe</CardTitle>
                  <CardDescription>{items.length} items in your collection</CardDescription>
                </div>
                <CameraButton onCapture={handleImageCapture} />
              </CardHeader>
              <CardContent className="p-0">
                {items.length === 0 ? (
                  <div className="text-center py-12 px-6">
                    <div className="text-6xl mb-4">👕</div>
                    <h3 className="text-xl font-semibold mb-2">Your wardrobe is empty</h3>
                    <p className="text-muted-foreground mb-6">
                      Start by adding your favorite clothing items!
                    </p>
                    <CameraButton onCapture={handleImageCapture} size="lg" />
                  </div>
                ) : (
                  <WardrobeGrid items={items} userPhoto={profile?.avatar_url} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swipe">
            <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-card">
              <CardContent className="p-6">
                <OutfitSwiper
                  suggestions={suggestions}
                  userPhoto={profile?.avatar_url}
                  onLike={handleLikeOutfit}
                  onDislike={handleDislikeOutfit}
                  onShuffle={() => setSuggestions(prev => [...prev].sort(() => Math.random() - 0.5))}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-card">
              <CardHeader>
                <CardTitle>Saved Outfits</CardTitle>
                <CardDescription>{outfits.length} outfits in your collection</CardDescription>
              </CardHeader>
              <CardContent>
                {outfits.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💫</div>
                    <h3 className="text-xl font-semibold mb-2">No saved outfits yet</h3>
                    <p className="text-muted-foreground">
                      Like some outfit suggestions to save them here!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {outfits.map((outfit) => (
                      <Card 
                        key={outfit.id}
                        className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setSelectedOutfit(outfit)
                          setShowOutfitModal(true)
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                            <div className="grid grid-cols-2 gap-1 p-2 h-full">
                              {outfit.items.slice(0, 4).map((item) => (
                                <div key={item.id} className="aspect-square bg-background rounded overflow-hidden">
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <h3 className="font-semibold text-sm mb-1 truncate">{outfit.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize">{outfit.occasion}</p>
                          <Button 
                            size="sm" 
                            className="w-full mt-2 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOutfit(outfit)
                              setShowOutfitModal(true)
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Virtual Try-On
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SavedOutfitModal
        outfit={selectedOutfit}
        userPhoto={profile?.avatar_url}
        isOpen={showOutfitModal}
        onClose={() => setShowOutfitModal(false)}
        onDelete={(outfit) => {
          deleteOutfit(outfit.id)
          setShowOutfitModal(false)
        }}
        onToggleFavorite={(outfit) => toggleFavoriteOutfit(outfit.id)}
      />
    </div>
  )
}

export default Index;
