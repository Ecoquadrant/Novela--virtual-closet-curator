import * as React from "react"
import { Camera } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CameraButtonProps extends ButtonProps {
  onCapture?: (imageUrl: string) => void
}

const CameraButton = React.forwardRef<HTMLButtonElement, CameraButtonProps>(
  ({ className, onCapture, ...props }, ref) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleClick = () => {
      fileInputRef.current?.click()
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          onCapture?.(imageUrl)
        }
        reader.readAsDataURL(file)
      }
    }

    return (
      <>
        <Button
          ref={ref}
          onClick={handleClick}
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
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture
          className="hidden"
          onChange={handleFileChange}
        />
      </>
    )
  }
)
CameraButton.displayName = "CameraButton"

export { CameraButton }