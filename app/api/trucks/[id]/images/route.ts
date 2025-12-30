import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Read the HR folders mapping file
function getHRFolderImages() {
  try {
    const mappingPath = path.join(process.cwd(), 'hr-folders-upload-mapping.json')
    if (fs.existsSync(mappingPath)) {
      const fileContent = fs.readFileSync(mappingPath, 'utf-8')
      return JSON.parse(fileContent)
    }
  } catch (error) {
    console.error('Error reading HR folders mapping:', error)
  }
  return []
}

// Get folder name from truck name or image URL
function extractFolderName(truckName: string, imageUrl: string): string | null {
  // Normalize function to convert "HR-38-W-2162" or "HR 38 W 2162" to "HR 38 W 2162"
  const normalizeFolderName = (str: string): string => {
    return str
      .replace(/-/g, ' ')  // Replace hyphens with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .toUpperCase()
  }

  // Check image URL first (most reliable)
  if (imageUrl) {
    // Match patterns like "HR-38-W-2162" or "HR 38 W 2162" in the URL
    const urlMatch = imageUrl.match(/(HR[- ]?\d+[- ]?[A-Z][- ]?\d+)/i)
    if (urlMatch) {
      return normalizeFolderName(urlMatch[1])
    }
  }

  // Check truck name
  if (truckName) {
    // Match patterns like "HR-38-W-2162" or "HR 38 W 2162" in the name
    const nameMatch = truckName.match(/(HR[- ]?\d+[- ]?[A-Z][- ]?\d+)/i)
    if (nameMatch) {
      return normalizeFolderName(nameMatch[1])
    }
    
    // Also check if truck name starts with HR pattern (e.g., "HR 38 W 2162" is the full name)
    if (/^HR[- ]?\d+[- ]?[A-Z][- ]?\d+/i.test(truckName.trim())) {
      const directMatch = truckName.match(/^(HR[- ]?\d+[- ]?[A-Z][- ]?\d+)/i)
      if (directMatch) {
        return normalizeFolderName(directMatch[1])
      }
    }
  }

  return null
}

// Fetch images directly from Supabase Storage by folder name pattern
async function fetchImagesFromSupabaseStorage(
  supabase: any,
  folderName: string
): Promise<string[]> {
  try {
    const BUCKET_NAME = 'truck-images'
    
    // Normalize folder name for search (e.g., "HR 38 W 2162" -> "HR-38-W-2162")
    const searchPattern = folderName.replace(/\s+/g, '-').toUpperCase()
    
    // List all files in the bucket
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing Supabase Storage files:', error)
      return []
    }

    if (!files || files.length === 0) {
      return []
    }

    // Filter files that contain the folder name pattern
    const matchingFiles = files
      .filter((file: any) => {
        const fileName = file.name.toUpperCase()
        // Check if filename contains the folder pattern
        return fileName.includes(searchPattern) || 
               fileName.includes(folderName.replace(/\s+/g, '-').toUpperCase()) ||
               fileName.includes(folderName.replace(/\s+/g, '').toUpperCase())
      })
      .map((file: any) => {
        // Get public URL for each file
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name)
        return urlData.publicUrl
      })
      .filter((url: string) => url) // Remove any null/undefined URLs

    return matchingFiles
  } catch (error) {
    console.error('Error fetching images from Supabase Storage:', error)
    return []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const truckId = parseInt(id)

    if (isNaN(truckId)) {
      return NextResponse.json({ error: 'Invalid truck ID' }, { status: 400 })
    }

    // Fetch truck data from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase credentials not found in environment variables')
      return NextResponse.json({ images: [] })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: truck, error } = await supabase
      .from('trucks')
      .select('id, name, image_url')
      .eq('id', truckId)
      .single()

    if (error || !truck) {
      console.error(`Truck ${truckId} not found or error:`, error?.message)
      return NextResponse.json({ images: [] })
    }

    // Try to get images from HR folder mapping (if file exists)
    const folderName = extractFolderName(truck.name, truck.image_url || '')
    
    if (folderName) {
      // First, try to get images from mapping file (if available)
      const mapping = getHRFolderImages()
      if (mapping && mapping.length > 0) {
        const folderImages = mapping
          .filter((item: any) => {
            // Normalize folder names for comparison
            const itemFolder = item.folderName?.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase()
            const targetFolder = folderName.replace(/-/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase()
            return itemFolder === targetFolder
          })
          .map((item: any) => item.supabaseUrl)
          .filter((url: string) => url) // Remove any null/undefined URLs

        if (folderImages.length > 0) {
          console.log(`Found ${folderImages.length} images from mapping file for folder: ${folderName}`)
          return NextResponse.json({ images: folderImages })
        }
      }

      // If mapping file doesn't have images, fetch directly from Supabase Storage
      console.log(`Mapping file not available or empty, fetching from Supabase Storage for folder: ${folderName}`)
      const storageImages = await fetchImagesFromSupabaseStorage(supabase, folderName)
      
      if (storageImages.length > 0) {
        console.log(`Found ${storageImages.length} images from Supabase Storage for folder: ${folderName}`)
        return NextResponse.json({ images: storageImages })
      }
    }

    // Fallback: return single image
    console.log(`No folder match found, returning single image for truck ${truckId}`)
    return NextResponse.json({ images: truck.image_url ? [truck.image_url] : [] })
  } catch (error) {
    console.error('Error fetching truck images:', error)
    return NextResponse.json({ images: [] })
  }
}

