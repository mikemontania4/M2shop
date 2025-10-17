"use client"

import React, { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import productService, { type Category } from "../services/productService"
import DepartmentsMenu from "./DepartmentsMenu"
import HeaderLogo from "./header/HeaderLogo"
import SearchBar from "./header/SearchBar"
import HeaderUser from "./header/HeaderUser"
import CartButton from "./header/CartButton"

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [navCategories, setNavCategories] = useState<Category[]>([])
  const [isStuck, setIsStuck] = useState(false)

  console.log("[v0] isStuck state:", isStuck, "scrollY:", typeof window !== "undefined" ? window.scrollY : 0)

  // Load categories for nav
  React.useEffect(() => {
    setNavCategories(productService.getCategories())
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail
      setShowMobileMenu(detail)
    }
    window.addEventListener("nav-toggle", handler as EventListener)
    return () => window.removeEventListener("nav-toggle", handler as EventListener)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const shouldStick = window.scrollY > 50
      console.log("[v0] Scroll event - scrollY:", window.scrollY, "shouldStick:", shouldStick)
      setIsStuck(shouldStick)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    const next = !showMobileMenu
    setShowMobileMenu(next)
    window.dispatchEvent(new CustomEvent("nav-toggle", { detail: next }))
  }

  return (
    <>
      <header className="header">
        <div className="header-main">
          <div className="container">
            <div className="header-main-content">
              <div className="header-left">
                <HeaderLogo />
                <DepartmentsMenu categories={navCategories} />
              </div>

              <SearchBar />

              <div className="header-actions">
                <HeaderUser />
                <CartButton />
              </div>
            </div>
          </div>
        </div>

        <div className="header-mobile-line2">
          <div className="container">
            <HeaderLogo />
            <HeaderUser />
          </div>
        </div>
      </header>

      <div className={`header-search-sticky ${isStuck ? "stuck" : ""}`}>
        <div className="container">
          <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
          <SearchBar />
          <CartButton />
        </div>
      </div>
    </>
  )
}

export default Header
