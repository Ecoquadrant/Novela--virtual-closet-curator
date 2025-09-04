import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ClothingCategory, Occasion } from "@/types/wardrobe"
import { Shirt, DollarSign, Tag } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.enum(["tops", "bottoms", "dresses", "outerwear", "shoes", "accessories", "bags"] as const),
  brand: z.string().optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  occasions: z.array(z.enum(["casual", "work", "formal", "party", "date", "workout", "vacation", "special-event"] as const)).min(1, "Select at least one occasion"),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
})

type FormData = z.infer<typeof formSchema>

interface ItemCategorizationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl: string
  onSubmit: (data: FormData & { imageUrl: string }) => void
}

const occasions: { value: Occasion; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "work", label: "Work" },
  { value: "formal", label: "Formal" },
  { value: "party", label: "Party" },
  { value: "date", label: "Date" },
  { value: "workout", label: "Workout" },
  { value: "vacation", label: "Vacation" },
  { value: "special-event", label: "Special Event" }
]

const categories: { value: ClothingCategory; label: string }[] = [
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "dresses", label: "Dresses" },
  { value: "outerwear", label: "Outerwear" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
  { value: "bags", label: "Bags" }
]

export const ItemCategorizationForm = ({ open, onOpenChange, imageUrl, onSubmit }: ItemCategorizationFormProps) => {
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>(["casual"])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "tops",
      brand: "",
      price: undefined,
      occasions: ["casual"],
      colors: [],
      tags: []
    }
  })

  const handleSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      occasions: selectedOccasions,
      imageUrl
    })
    onOpenChange(false)
    form.reset()
    setSelectedOccasions(["casual"])
  }

  const handleOccasionChange = (occasion: Occasion, checked: boolean) => {
    if (checked) {
      setSelectedOccasions(prev => [...prev, occasion])
    } else {
      setSelectedOccasions(prev => prev.filter(o => o !== occasion))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shirt className="w-5 h-5" />
            Categorize Your Item
          </DialogTitle>
        </DialogHeader>

        {/* Preview Image */}
        <div className="flex justify-center mb-4">
          <img 
            src={imageUrl} 
            alt="Captured item" 
            className="w-32 h-32 object-cover rounded-lg border border-border shadow-sm"
          />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Item Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blue Cotton T-Shirt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand */}
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Brand (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Nike, Zara, H&M" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Occasions */}
            <div className="space-y-3">
              <Label>Occasions</Label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map((occasion) => (
                  <div key={occasion.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={occasion.value}
                      checked={selectedOccasions.includes(occasion.value)}
                      onCheckedChange={(checked) => 
                        handleOccasionChange(occasion.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={occasion.value} className="text-sm">
                      {occasion.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedOccasions.length === 0 && (
                <p className="text-sm text-destructive">Select at least one occasion</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={selectedOccasions.length === 0}
              >
                Add to Wardrobe
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}