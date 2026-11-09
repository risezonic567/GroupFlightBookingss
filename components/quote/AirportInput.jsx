'use client'

import { useEffect, useRef, useState } from 'react'
import { Plane } from 'lucide-react'

const defaultInputClass =
  'h-[52px] w-full rounded-2xl border border-ink-200 bg-white pl-10 pr-3 text-sm font-medium text-ink-900 outline-none transition placeholder:text-ink-400 hover:border-ink-300 focus:border-skyline-500 focus:ring-2 focus:ring-skyline-500/20'

export default function AirportInput({
  name,
  value = '',
  onChange,
  placeholder = 'City or airport',
  required = false,
  className,
  showPin = true,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const listRef = useRef(null)
  const abortControllerRef = useRef(null)
  const hasSelectedRef = useRef(false)

  function selectAirport(airport) {
    const namePart = (airport.name || '').trim()
    const codePart = (airport.iataCode || '').trim()
    const display = namePart ? (codePart ? `${namePart} (${codePart})` : namePart) : codePart
    hasSelectedRef.current = true
    setIsOpen(false)
    setActiveIndex(-1)
    setResults([])
    onChange?.({ target: { name, value: display } })
  }

  function handleInputChange(e) {
    hasSelectedRef.current = false
    const nextVal = e.target.value
    if (nextVal.trim().length < 2) {
      abortControllerRef.current?.abort()
      abortControllerRef.current = null
      setResults([])
      setIsLoading(false)
      setIsOpen(false)
      setActiveIndex(-1)
    }
    onChange?.(e)
  }

  function handleKeyDown(e) {
    if (!isOpen) {
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && results.length > 0) {
        e.preventDefault()
        setIsOpen(true)
        setActiveIndex(0)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (results.length === 0 ? -1 : prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (results.length === 0 ? -1 : prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault()
      selectAirport(results[activeIndex])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  useEffect(() => {
    if (hasSelectedRef.current) return
    const query = (value || '').trim()
    if (query.length < 2) return

    const timer = setTimeout(async () => {
      setIsLoading(true)
      setIsOpen(true)
      setActiveIndex(-1)
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller
      try {
        const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setResults(Array.isArray(data?.results) ? data.results : [])
      } catch (err) {
        if (err.name !== 'AbortError') setResults([])
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex]
      activeEl?.scrollIntoView?.({ block: 'nearest' })
    }
  }, [activeIndex])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => () => abortControllerRef.current?.abort(), [])

  return (
    <div ref={containerRef} className={`relative ${isOpen ? 'z-40' : 'z-10'}`}>
      {showPin && <Plane className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 -rotate-45 text-ink-400" />}
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className={className || defaultInputClass}
        {...rest}
      />
      {isOpen && (
        <div
          ref={listRef}
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1.5 max-h-80 w-[min(420px,calc(100vw-2.5rem))] overflow-y-auto rounded-2xl border border-ink-200 bg-white py-1.5 shadow-2xl"
        >
          {isLoading ? (
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-ink-500">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-skyline-600 border-t-transparent" />
              Searching airports...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-ink-500">No airports found</div>
          ) : (
            results.map((airport, index) => {
              const isSelected = index === activeIndex
              const location = [airport.cityName, airport.countryName].filter(Boolean).join(', ')
              return (
                <div
                  key={airport.id || `${airport.iataCode}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    selectAirport(airport)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-skyline-500/10 text-skyline-700' : 'text-ink-800 hover:bg-ink-50'
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isSelected ? 'bg-skyline-500/15 text-skyline-700' : 'bg-ink-100 text-ink-500'}`}>
                    <Plane className="h-4 w-4 -rotate-45" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold" title={airport.name}>{airport.name}</span>
                      {airport.iataCode && (
                        <span className="shrink-0 rounded-md bg-ink-100 px-2 py-0.5 text-xs font-bold text-ink-700">{airport.iataCode}</span>
                      )}
                    </div>
                    {location && <div className="mt-0.5 truncate text-xs text-ink-500">{location}</div>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
