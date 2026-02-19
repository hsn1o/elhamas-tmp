"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}
