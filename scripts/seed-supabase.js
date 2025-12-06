// Script to seed Supabase database with truck data
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found!')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Seed data - trucks from seed-data.ts
const trucks = [
  {
    name: 'Tata Prima',
    manufacturer: 'Tata Motors',
    model: 'Prima',
    year: 2023,
    kilometers: 15000,
    horsepower: 380,
    price: 2850000,
    image_url: '/Gemini_Generated_Image_189xp8189xp8189x.png',
    subtitle: 'Premium heavy-duty truck with advanced features.',
    certified: true,
  },
  {
    name: 'Tata Signa',
    manufacturer: 'Tata Motors',
    model: 'Signa',
    year: 2022,
    kilometers: 22000,
    horsepower: 350,
    price: 3275000,
    image_url: '/Gemini_Generated_Image_6gr84a6gr84a6gr8.png',
    subtitle: 'Powerful and fuel-efficient tipper truck.',
    certified: true,
  },
  {
    name: 'Ashok Leyland 2820',
    manufacturer: 'Ashok Leyland',
    model: '2820',
    year: 2021,
    kilometers: 35000,
    horsepower: 200,
    price: 2480000,
    image_url: '/Gemini_Generated_Image_6q2b966q2b966q2b-2.png',
    subtitle: 'Reliable and durable for long hauls.',
    certified: false,
  },
  {
    name: 'BharatBenz 1617R',
    manufacturer: 'BharatBenz',
    model: '1617R',
    year: 2023,
    kilometers: 18000,
    horsepower: 170,
    price: 2690000,
    image_url: '/Gemini_Generated_Image_6q2b966q2b966q2b-3.png',
    subtitle: 'German engineering for Indian roads.',
    certified: true,
  },
  {
    name: 'Mahindra Bolero Pik-Up',
    manufacturer: 'Mahindra',
    model: 'Bolero Pik-Up',
    year: 2022,
    kilometers: 12000,
    horsepower: 75,
    price: 895000,
    image_url: '/Gemini_Generated_Image_6q2b966q2b966q2b.png',
    subtitle: 'Perfect for last-mile delivery.',
    certified: true,
  },
  {
    name: 'Mahindra Bolero Camper',
    manufacturer: 'Mahindra',
    model: 'Bolero Camper',
    year: 2023,
    kilometers: 8000,
    horsepower: 80,
    price: 945000,
    image_url: '/Gemini_Generated_Image_ex5b2aex5b2aex5b.png',
    subtitle: 'Versatile pickup for all terrains.',
    certified: true,
  },
  {
    name: 'Mahindra Pickup',
    manufacturer: 'Mahindra',
    model: 'Pickup',
    year: 2020,
    kilometers: 45000,
    horsepower: 70,
    price: 725000,
    image_url: '/Gemini_Generated_Image_azvzznazvzznazvz.png',
    subtitle: 'Economical and robust.',
    certified: false,
  },
  {
    name: 'Eicher Pro 6025T',
    manufacturer: 'Eicher Motors',
    model: 'Pro 6025T',
    year: 2022,
    kilometers: 32000,
    horsepower: 250,
    price: 1975000,
    image_url: '/Gemini_Generated_Image_f5675rf5675rf567.png',
    subtitle: 'High payload capacity truck.',
    certified: true,
  },
  {
    name: 'Force Urbania',
    manufacturer: 'Force Motors',
    model: 'Urbania',
    year: 2021,
    kilometers: 25000,
    horsepower: 115,
    price: 2850000,
    image_url: '/Gemini_Generated_Image_o2qgpno2qgpno2qg.png',
    subtitle: 'Premium passenger and cargo vehicle.',
    certified: false,
  },
  {
    name: 'Isuzu D-MAX',
    manufacturer: 'Isuzu',
    model: 'D-MAX',
    year: 2023,
    kilometers: 10000,
    horsepower: 150,
    price: 1890000,
    image_url: '/Gemini_Generated_Image_tywt8qtywt8qtywt.png',
    subtitle: 'Japanese quality pickup truck.',
    certified: true,
  },
  {
    name: 'Tata LPT 1613',
    manufacturer: 'Tata Motors',
    model: 'LPT 1613',
    year: 2022,
    kilometers: 20000,
    horsepower: 130,
    price: 2250000,
    image_url: '/Gemini_Generated_Image_wyesgowyesgowyes.png',
    subtitle: 'Versatile medium duty truck.',
    certified: true,
  },
  {
    name: 'SML Isuzu S7',
    manufacturer: 'SML Isuzu',
    model: 'S7',
    year: 2021,
    kilometers: 12000,
    horsepower: 92,
    price: 4290000,
    image_url: '/Gemini_Generated_Image_6q2b966q2b966q2b.png',
    subtitle: 'Heavy-duty tipper for mining.',
    certified: false,
  },
]

async function seedSupabase() {
  console.log('🌱 Starting Supabase seed...')
  console.log(`📋 Project URL: ${supabaseUrl}`)
  console.log(`📦 Seeding ${trucks.length} trucks...\n`)

  try {
    // Check if trucks already exist
    const { data: existingTrucks, error: checkError } = await supabase
      .from('trucks')
      .select('id')
      .limit(1)

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingTrucks && existingTrucks.length > 0) {
      console.log('⚠️  Trucks already exist in database.')
      console.log('   Do you want to clear and reseed? (This will delete all existing trucks)')
      console.log('   To reseed, delete trucks manually in Supabase dashboard or run:')
      console.log('   DELETE FROM trucks;')
      return
    }

    // Insert trucks
    const { data, error } = await supabase
      .from('trucks')
      .insert(trucks)
      .select()

    if (error) {
      throw error
    }

    console.log(`✅ Successfully seeded ${data.length} trucks into Supabase!`)
    console.log('\n📊 Trucks added:')
    data.forEach((truck, index) => {
      console.log(`   ${index + 1}. ${truck.name} (ID: ${truck.id})`)
    })
    console.log('\n🎉 Your website should now show all trucks!')
  } catch (error) {
    console.error('❌ Error seeding Supabase:', error.message)
    if (error.code === 'PGRST116') {
      console.error('\n💡 Tip: Make sure you have run the SQL migration in Supabase first!')
      console.error('   Go to Supabase Dashboard → SQL Editor → Run COPY_THIS_SQL.sql')
    }
    process.exit(1)
  }
}

seedSupabase()

