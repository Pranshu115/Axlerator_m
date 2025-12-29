'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Truck models available for each brand (from your verified list)
const brandModels: Record<string, string[]> = {
  'Tata Motors': [
    'Tata 1512 LPT',
    'Tata Motors 3518',
    'Tata Motors Ultra T16',
    'Tata LPT 1109 HEX 2',
    'Tata LPT 3118',
    'Tata 1613 CRi6',
    'Tata 610',
    'Tata 709 LPT',
    'Tata 709 G LPT',
    'Tata 1109 G LPT',
  ],
  'Eicher Motors': [
    'Eicher Pro 2110 LCV',
    'Eicher Motors 1059 XP',
    'Eicher Pro 3015',
    'Eicher Pro 3019',
    'Eicher Pro 2110 XP',
    'Eicher Pro 2118',
    'Eicher Pro 2114 XP',
    'Eicher Pro 2059 XP',
    'Eicher Pro 3015 XP',
  ],
  'Ashok Leyland': [
    'Ashok Leyland Partner 1114',
    'Ashok Leyland Partner 1615',
    'Ashok Leyland Ecomet 1214',
    'Ashok Leyland Ecomet 1212',
  ],
  'SML Isuzu': [
    'SML Isuzu Samrat GS',
  ],
}

export default function HeroSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'brand' | 'body' | 'budget'>('brand')
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build search params so browse page can filter to a single truck
    const params = new URLSearchParams()

    // If a model is selected, search by model (most specific)
    if (selectedModel) {
      params.set('search', selectedModel)
    } else if (selectedBrand) {
      // Fallback: filter by brand only
      params.set('search', selectedBrand)
    }

    const query = params.toString()
    router.push(query ? `/browse-trucks?${query}` : '/browse-trucks')
  }

  return (
    <section id="home" className="hero-section">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="hero-video"
      >
        <source src="/herovideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Search The Right Truck
        </h1>
        <p className="hero-subtitle">
          Find certified used trucks by brand, body type or budget in just a few taps.
        </p>

        {/* TruckJunction / Spinny-style search card */}
        <div className="hero-search-card">
          <div className="hero-search-tabs">
            <button
              type="button"
              className={`hero-search-tab ${activeTab === 'brand' ? 'active' : ''}`}
              onClick={() => setActiveTab('brand')}
            >
              BRAND
            </button>
            <button
              type="button"
              className={`hero-search-tab ${activeTab === 'body' ? 'active' : ''}`}
              onClick={() => setActiveTab('body')}
            >
              BODY TYPE
            </button>
            <button
              type="button"
              className={`hero-search-tab ${activeTab === 'budget' ? 'active' : ''}`}
              onClick={() => setActiveTab('budget')}
            >
              BUDGET
            </button>
          </div>

          <form className="hero-search-form" onSubmit={handleSearch}>
            {activeTab === 'brand' && (
              <>
                <div className="hero-search-field">
                  <label className="hero-search-label">Select Brand</label>
                  <select
                    className="hero-search-select"
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value)
                      setSelectedModel('')
                    }}
                  >
                    <option value="">
                      Select Brand
                    </option>
                    <option value="Tata Motors">TATA Motors</option>
                    <option value="Mahindra Trucks">Mahindra Trucks</option>
                    <option value="Ashok Leyland">Ashok Leyland</option>
                    <option value="Eicher Motors">Eicher Motors</option>
                    <option value="Bharat Benz">Bharat Benz</option>
                    <option value="SML Isuzu">SML Isuzu</option>
                    <option value="Force Motors">Force Motors</option>
                    <option value="Volvo Trucks">Volvo Trucks</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Toyota Kirloskar">Toyota Kirloskar</option>
                  </select>
                </div>
                <div className="hero-search-field">
                  <label className="hero-search-label">Select Model</label>
                  <select
                    className="hero-search-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedBrand || !brandModels[selectedBrand]}
                  >
                    <option value="">
                      {selectedBrand && brandModels[selectedBrand]?.length
                        ? 'Select Model'
                        : 'Select brand first'}
                    </option>
                    {selectedBrand &&
                      brandModels[selectedBrand]?.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                  </select>
                </div>
              </>
            )}

            {activeTab === 'body' && (
              <>
                <div className="hero-search-field">
                  <label className="hero-search-label">Select Body Type</label>
                  <select className="hero-search-select" defaultValue="">
                    <option value="" disabled>
                      Select Body Type
                    </option>
                    <option value="tipper">Tipper</option>
                    <option value="tractor">Tractor Trailer</option>
                    <option value="container">Container</option>
                    <option value="open-body">Open Body</option>
                  </select>
                </div>
                <div className="hero-search-field">
                  <label className="hero-search-label">Select Axle / Tonnes</label>
                  <select className="hero-search-select" defaultValue="">
                    <option value="" disabled>
                      Select Capacity
                    </option>
                    <option value="light">Light (0–9 Ton)</option>
                    <option value="medium">Medium (10–19 Ton)</option>
                    <option value="heavy">Heavy (20+ Ton)</option>
                  </select>
                </div>
              </>
            )}

            {activeTab === 'budget' && (
              <>
                <div className="hero-search-field">
                  <label className="hero-search-label">Select Budget</label>
                  <select className="hero-search-select" defaultValue="">
                    <option value="" disabled>
                      Select Budget
                    </option>
                    <option value="0-10">₹0–10 Lakh</option>
                    <option value="10-20">₹10–20 Lakh</option>
                    <option value="20-30">₹20–30 Lakh</option>
                    <option value="30+">₹30 Lakh+</option>
                  </select>
                </div>
                <div className="hero-search-field">
                  <label className="hero-search-label">Select Year</label>
                  <select className="hero-search-select" defaultValue="">
                    <option value="" disabled>
                      Select Year
                    </option>
                    <option value="2022-2024">2022–2024</option>
                    <option value="2018-2021">2018–2021</option>
                    <option value="before-2018">Before 2018</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="hero-search-submit">
              Search
            </button>
            <Link href="/browse-trucks" className="hero-search-link">
              Find All Trucks →
          </Link>
          </form>
        </div>
      </div>
    </section>
  )
}
