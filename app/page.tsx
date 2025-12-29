import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import TrustBar from '@/components/TrustBar'
import CertifiedTrucks from '@/components/CertifiedTrucks'
import AboutUs from '@/components/AboutUs'
import ContactUs from '@/components/ContactUs'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrustBar />
      <CertifiedTrucks />
      <AboutUs />
      <ContactUs />
      <FinalCTA />
      <Footer />
      
      {/* Bottom Navigation Bar - Car24 Style */}
      <nav className="mobile-bottom-nav">
        <Link href="/" className="bottom-nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </Link>
        <Link href="/browse-trucks" className="bottom-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <span>Buy</span>
        </Link>
        <Link href="/sell-truck" className="bottom-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Sell</span>
        </Link>
        <Link href="/services" className="bottom-nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </Link>
      </nav>
    </>
  )
}
