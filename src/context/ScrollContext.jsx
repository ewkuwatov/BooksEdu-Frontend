import { createContext, useContext, useEffect, useState } from 'react'

const ScrollContext = createContext()

export const ScrollProvider = ({ children }) => {
  const [isScrolledPastHeader, setIsScrolledPastHeader] = useState(false)

  useEffect(() => {
    const header = document.querySelector('.header')
    const headerHeight = header ? header.offsetHeight : 0

    const handleScroll = () => {
      setIsScrolledPastHeader(window.scrollY > headerHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ScrollContext.Provider value={{ isScrolledPastHeader }}>
      {children}
    </ScrollContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useScroll = () => useContext(ScrollContext)
