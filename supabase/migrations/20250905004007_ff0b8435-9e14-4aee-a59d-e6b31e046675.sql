-- Create wardrobe_items table
CREATE TABLE public.wardrobe_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'bags')),
  image_url TEXT,
  colors TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  occasions TEXT[] DEFAULT '{}',
  brand TEXT,
  price NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wardrobe_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own items" 
ON public.wardrobe_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own items" 
ON public.wardrobe_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" 
ON public.wardrobe_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items" 
ON public.wardrobe_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_wardrobe_items_updated_at
BEFORE UPDATE ON public.wardrobe_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create outfits table
CREATE TABLE public.outfits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for outfits
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for outfits
CREATE POLICY "Users can view their own outfits" 
ON public.outfits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outfits" 
ON public.outfits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits" 
ON public.outfits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits" 
ON public.outfits 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create outfit_items junction table
CREATE TABLE public.outfit_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES public.outfits(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.wardrobe_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for outfit_items
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for outfit_items (users can access if they own the outfit)
CREATE POLICY "Users can view outfit items for their own outfits" 
ON public.outfit_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.outfits 
    WHERE outfits.id = outfit_items.outfit_id 
    AND outfits.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create outfit items for their own outfits" 
ON public.outfit_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.outfits 
    WHERE outfits.id = outfit_items.outfit_id 
    AND outfits.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete outfit items for their own outfits" 
ON public.outfit_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.outfits 
    WHERE outfits.id = outfit_items.outfit_id 
    AND outfits.user_id = auth.uid()
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_outfits_updated_at
BEFORE UPDATE ON public.outfits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();