import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import all logo options
import novelaLogo from '@/assets/novela-logo.png'
import novelaLogoOption1 from '@/assets/novela-logo-option1.png'
import novelaLogoOption2 from '@/assets/novela-logo-option2.png'
import novelaLogoOption3 from '@/assets/novela-logo-option3.png'
import novelaLogoOption4 from '@/assets/novela-logo-option4.png'

const logoOptions = [
  { id: 'current', src: novelaLogo, title: 'Current Logo', description: 'Professional modern design' },
  { id: 'option1', src: novelaLogoOption1, title: 'Elegant Serif', description: 'Luxury typography with gold accents' },
  { id: 'option2', src: novelaLogoOption2, title: 'Fashion Forward', description: 'Gradient colors with hanger icon' },
  { id: 'option3', src: novelaLogoOption3, title: 'Minimalist', description: 'Clean geometric design' },
  { id: 'option4', src: novelaLogoOption4, title: 'Boutique Style', description: 'Vintage-inspired elegance' },
]

interface LogoSelectorProps {
  onSelect: (logoSrc: string) => void
  currentLogo?: string
}

export const LogoSelector = ({ onSelect, currentLogo }: LogoSelectorProps) => {
  const [selectedLogo, setSelectedLogo] = useState(currentLogo || novelaLogo)

  const handleSelect = (logoSrc: string) => {
    setSelectedLogo(logoSrc)
    onSelect(logoSrc)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Logo</h2>
        <p className="text-muted-foreground">Select your preferred logo design for Novela</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {logoOptions.map((option) => (
          <Card 
            key={option.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg border-2",
              selectedLogo === option.src 
                ? "border-primary shadow-md" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleSelect(option.src)}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-white rounded-lg p-3 shadow-sm">
                  <img 
                    src={option.src} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                {selectedLogo === option.src && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{option.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
        >
          Apply Selected Logo
        </Button>
      </div>
    </div>
  )
}