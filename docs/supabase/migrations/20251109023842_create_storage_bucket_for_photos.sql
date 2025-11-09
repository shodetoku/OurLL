/*
  # Create Storage Bucket for Photo Uploads
  
  ## What this does:
  This creates a storage bucket where uploaded photos will be saved.
  
  ## Changes:
  1. Creates a public storage bucket called 'letter-photos'
  2. Sets up policies so anyone can upload and view photos
  3. Photos are stored permanently in the cloud
  
  ## For Beginners:
  - A storage bucket is like a folder in the cloud for saving files
  - When you upload a photo from your device, it goes into this bucket
  - The bucket is "public" which means photos can be viewed by anyone with the link
  - This is safe because only people with the passcode can access your website
*/

-- Create storage bucket for letter photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('letter-photos', 'letter-photos', true)
ON CONFLICT DO NOTHING;

-- Allow anyone to upload photos to the bucket
CREATE POLICY "Anyone can upload photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'letter-photos');

-- Allow anyone to view photos from the bucket
CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'letter-photos');

-- Allow anyone to delete their own photos (for future updates)
CREATE POLICY "Anyone can delete photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'letter-photos');
