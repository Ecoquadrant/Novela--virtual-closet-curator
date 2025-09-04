import * as React from "react"
import { cn } from "@/lib/utils"

interface SwipeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  children: React.ReactNode
}

const SwipeCard = React.forwardRef<HTMLDivElement, SwipeCardProps>(
  ({ className, onSwipeLeft, onSwipeRight, children, ...props }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [startX, setStartX] = React.useState(0)
    const [currentX, setCurrentX] = React.useState(0)
    const [rotation, setRotation] = React.useState(0)

    const handleStart = (clientX: number) => {
      setIsDragging(true)
      setStartX(clientX)
    }

    const handleMove = (clientX: number) => {
      if (!isDragging) return
      
      const deltaX = clientX - startX
      setCurrentX(deltaX)
      setRotation(deltaX * 0.1)
    }

    const handleEnd = () => {
      setIsDragging(false)
      
      const threshold = 100
      if (Math.abs(currentX) > threshold) {
        if (currentX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
      
      setCurrentX(0)
      setRotation(0)
    }

    const cardStyle = {
      transform: `translateX(${currentX}px) rotate(${rotation}deg)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm mx-auto cursor-grab active:cursor-grabbing",
          "touch-none select-none",
          className
        )}
        style={cardStyle}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SwipeCard.displayName = "SwipeCard"

export { SwipeCard }