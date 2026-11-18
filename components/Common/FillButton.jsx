'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

function isInternalHref(href) {
  return typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')
}

export default function FillButton({
  href,
  className = '',
  contentClassName = '',
  children,
  type = 'button',
  variant = 'ink',
  ...props
}) {
  const btnRef = useRef(null)
  const circleRef = useRef(null)
  const enabledRef = useRef(false)

  const invert = variant === 'invert'
  const fillClass = invert ? 'bg-white' : 'bg-[#0b1623]'
  const hoverTextClass = invert
    ? '[@media(hover:hover)_and_(pointer:fine)]:hover:text-[#0b1623]'
    : '[@media(hover:hover)_and_(pointer:fine)]:hover:text-white'

  useEffect(() => {
    const mqHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      enabledRef.current = mqHover.matches && !mqMotion.matches
    }

    sync()
    mqHover.addEventListener('change', sync)
    mqMotion.addEventListener('change', sync)
    return () => {
      mqHover.removeEventListener('change', sync)
      mqMotion.removeEventListener('change', sync)
    }
  }, [])

  function placeCircle(x, y, scale) {
    const circle = circleRef.current
    const btn = btnRef.current
    if (!circle || !btn) return

    const { width, height } = btn.getBoundingClientRect()
    const size = Math.hypot(width, height) * 2

    circle.style.width = `${size}px`
    circle.style.height = `${size}px`
    circle.style.left = `${x}px`
    circle.style.top = `${y}px`
    circle.style.transform = `translate(-50%, -50%) scale(${scale})`
  }

  function onMouseEnter(e) {
    if (!enabledRef.current) return
    const btn = btnRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    placeCircle(x, y, 0)
    void circleRef.current?.offsetHeight
    placeCircle(x, y, 1)
  }

  function onMouseLeave(e) {
    if (!enabledRef.current) return
    const btn = btnRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    placeCircle(x, y, 0)
  }

  const sharedClassName = ['relative overflow-hidden transition-colors duration-500', hoverTextClass, className]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      <span
        ref={circleRef}
        aria-hidden
        className={`pointer-events-none absolute rounded-full transition-transform duration-500 ease-out ${fillClass}`}
        style={{
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          transform: 'translate(-50%, -50%) scale(0)',
        }}
      />
      <span className={`relative z-10 inline-flex items-center gap-2 transition-colors duration-500 ${contentClassName}`}>
        {children}
      </span>
    </>
  )

  const sharedProps = {
    ref: btnRef,
    className: sharedClassName,
    onMouseEnter,
    onMouseLeave,
    ...props,
  }

  if (href) {
    if (isInternalHref(href)) {
      return (
        <Link href={href} {...sharedProps}>
          {content}
        </Link>
      )
    }

    return (
      <a href={href} {...sharedProps}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} {...sharedProps}>
      {content}
    </button>
  )
}
