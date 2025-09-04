import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Upload, User, Ruler } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

const ProfileSetup = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  
  // Profile data
  const [gender, setGender] = useState('')
  const [height, setHeight] = useState('')
  const [chestBust, setChestBust] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')
  const [bodyShape, setBodyShape] = useState('')
  const [topSize, setTopSize] = useState('')
  const [bottomSize, setBottomSize] = useState('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) return null

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      let avatarUrl = ''
      
      // Upload avatar if one was selected
      if (uploadedFile) {
        const uploadedUrl = await uploadAvatar(uploadedFile)
        if (uploadedUrl) {
          avatarUrl = uploadedUrl
        }
      }

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: avatarUrl || null,
          gender: gender || null,
          height: height ? parseFloat(height) : null,
          chest_bust: chestBust ? parseFloat(chestBust) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null,
          body_shape: bodyShape || null,
          preferred_top_size: topSize || null,
          preferred_bottom_size: bottomSize || null
        })
        .eq('user_id', user.id)

      if (error) {
        throw error
      }

      toast.success('Profile setup complete!')
      navigate('/')
    } catch (error: any) {
      console.error('Profile setup error:', error)
      toast.error('Failed to save profile. Please try again.')
    }

    setLoading(false)
  }

  const handleSkip = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground">
            Help us create the perfect virtual try-on experience for you
          </p>
        </div>

        <Card className="bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Setup
            </CardTitle>
            <CardDescription>
              Upload your photo and measurements for personalized outfit recommendations
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo Section */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Profile Photo</Label>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="text-lg">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => cameraInputRef.current?.click()}
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-primary/30 hover:bg-primary/10"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Body Information
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 165"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Body Measurements (cm)</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="chest-bust">Chest/Bust</Label>
                    <Input
                      id="chest-bust"
                      type="number"
                      placeholder="e.g., 88"
                      value={chestBust}
                      onChange={(e) => setChestBust(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waist">Waist</Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="e.g., 70"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hips">Hips</Label>
                    <Input
                      id="hips"
                      type="number"
                      placeholder="e.g., 95"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>

                {gender === 'female' && (
                  <div className="space-y-2">
                    <Label htmlFor="body-shape">Body Shape</Label>
                    <Select value={bodyShape} onValueChange={setBodyShape}>
                      <SelectTrigger className="bg-background/50 border-border/50">
                        <SelectValue placeholder="Select body shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourglass">Hourglass</SelectItem>
                        <SelectItem value="pear">Pear</SelectItem>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="inverted_triangle">Inverted Triangle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Size Preferences */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Size Preferences</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="top-size">Top Size</Label>
                    <Input
                      id="top-size"
                      placeholder="e.g., M, L, XL"
                      value={topSize}
                      onChange={(e) => setTopSize(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bottom-size">Bottom Size</Label>
                    <Input
                      id="bottom-size"
                      placeholder="e.g., 30, 32, L"
                      value={bottomSize}
                      onChange={(e) => setBottomSize(e.target.value)}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProfileSetup