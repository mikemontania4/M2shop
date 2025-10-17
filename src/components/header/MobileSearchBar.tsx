"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import SearchBar from "./SearchBar"
import CartButton from "./CartButton"

const MobileSearchBar: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  useEffect(() => {
    console.log("[v0] MobileSearchBar mounted")

    const checkSticky = () => {
      const element = document.querySelector(".mobile-search-bar")
      if (element) {
        const styles = window.getComputedStyle(element)
        console.log("[v0] MobileSearchBar styles:", {
          display: styles.display,
          position: styles.position,
          top: styles.top,
          zIndex: styles.zIndex,
          background: styles.background,
        })
      }
    }

    // Check styles after a short delay to ensure CSS is loaded
    setTimeout(checkSticky, 100)

    // Check on scroll to see if sticky is working
    const handleScroll = () => {
      const element = document.querySelector(".mobile-search-bar")
      if (element) {
        const rect = element.getBoundingClientRect()
        console.log("[v0] MobileSearchBar scroll position:", {
          top: rect.top,
          scrollY: window.scrollY,
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail
      setShowMobileMenu(detail)
    }
    window.addEventListener("nav-toggle", handler as EventListener)
    return () => window.removeEventListener("nav-toggle", handler as EventListener)
  }, [])

  const toggleMobileMenu = () => {
    const next = !showMobileMenu
    setShowMobileMenu(next)
    window.dispatchEvent(new CustomEvent("nav-toggle", { detail: next }))
  }

  return (
    <div className="mobile-search-bar">
      <div className="container">
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <Menu size={24} />
        </button>
        <SearchBar />
        <CartButton />
      </div>
    </div>
  )
}

export default MobileSearchBar
