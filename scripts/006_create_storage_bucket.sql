-- Criar bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Política para permitir upload de imagens (apenas admins)
CREATE POLICY "Admin can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  )
);

-- Política para permitir leitura pública das imagens
CREATE POLICY "Public can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Política para permitir admins deletarem imagens
CREATE POLICY "Admin can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  )
);
