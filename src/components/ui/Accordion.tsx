'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'

export interface AccordionItem {
  question: string
  answer: string
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className = '' }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div
            key={index}
            className="border border-white/5 bg-secondary-dark/40 rounded-xl overflow-hidden backdrop-blur-md transition-all duration-200 hover:border-primary/20"
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left font-heading font-semibold text-sm md:text-base text-white hover:text-primary transition-colors focus:outline-none"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${index}`}
              id={`accordion-button-${index}`}
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              id={`accordion-content-${index}`}
              aria-labelledby={`accordion-button-${index}`}
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-[300px] border-t border-white/5 opacity-100 p-4 md:p-5' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <p className="text-sm text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
