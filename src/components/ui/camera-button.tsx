import * as React from "react"
import { Camera, Upload, Image } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface CameraButtonProps extends ButtonProps {
  onCapture?: (imageUrl: string) => void
}

const CameraButton = React.forwardRef<HTMLButtonElement, CameraButtonProps>(
  ({ className, onCapture, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const cameraInputRef = React.useRef<HTMLInputElement>(null)
    const galleryInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          onCapture?.(imageUrl)
          setOpen(false)
        }
        reader.readAsDataURL(file)
      }
    }

    const handleCameraClick = () => {
      cameraInputRef.current?.click()
    }

    const handleGalleryClick = () => {
      galleryInputRef.current?.click()
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            ref={ref}
            className={cn(
              "bg-gradient-to-r from-primary to-primary-glow",
              "hover:from-primary-glow hover:to-primary",
              "shadow-elegant border-0",
              "transition-all duration-300",
              className
            )}
            {...props}
          >
            <Camera className="w-5 h-5 mr-2" />
            Add Item
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Add New Item</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={handleCameraClick}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20"
              variant="outline"
            >
              <Camera className="w-8 h-8" />
              <span>Take Photo</span>
            </Button>
            <Button
              onClick={handleGalleryClick}
              className="h-24 flex-col gap-2 bg-gradient-to-br from-secondary/10 to-muted/20 hover:from-secondary/20 hover:to-muted/30 border border-secondary/20"
              variant="outline"
            >
              <Image className="w-8 h-8" />
              <span>From Gallery</span>
            </Button>
          </div>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </DialogContent>
      </Dialog>
    )
  }
)
CameraButton.displayName = "CameraButton"

export { CameraButton }