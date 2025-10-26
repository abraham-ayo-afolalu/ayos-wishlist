-- Fix the created_at column to have a default value
-- Run this in your Supabase SQL Editor

ALTER TABLE public.wishlist_items 
ALTER COLUMN created_at SET DEFAULT NOW();

-- Or if you prefer, make it nullable (though default is better)
-- ALTER TABLE public.wishlist_items 
-- ALTER COLUMN created_at DROP NOT NULL;
