-- Fix RLS for mortgage_products table (needs explicit RLS enable and proper policy)
ALTER TABLE mortgage_products ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the policy with proper structure
DROP POLICY IF EXISTS "Anyone can read active products" ON mortgage_products;
CREATE POLICY "Anyone can read active products" ON mortgage_products FOR SELECT USING (is_active = true);