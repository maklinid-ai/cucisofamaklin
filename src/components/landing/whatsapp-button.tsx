'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

const WHATSAPP_NUMBER = '6285793676315'
const WHATSAPP_MESSAGE = 'Halo MAKLIN, saya ingin konsultasi tentang jasa cuci sofa.'

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPulsing, setIsPulsing] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    const pulseTimer = setTimeout(() => setIsPulsing(false), 8000)
    return () => {
      clearTimeout(timer)
      clearTimeout(pulseTimer)
    }
  }, [])

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            onClick={handleClick}
            className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Hubungi kami via WhatsApp"
          >
            {isPulsing && (
              <motion.span
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}