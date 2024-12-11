'use client'

import { FC, ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMediaQuery } from "react-responsive"
import { Button } from "@/components/ui/button"
import { MessageSquare } from 'lucide-react'
import AIChatbot from './AIChatBot'

interface ResizableChatLayoutProps {
  children: ReactNode
}

const ResizableChatLayout: FC<ResizableChatLayoutProps> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1024px)' })

  return (
    <div className="flex h-screen overflow-hidden">
      <motion.main
        className={`flex-grow overflow-auto transition-all duration-300 ease-in-out ${
          isChatOpen
            ? isLargeScreen
              ? 'w-3/4'
              : 'w-0'
            : 'w-full'
        }`}
      >
        {children}
      </motion.main>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="border-l overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: isLargeScreen ? '25%' : '100%' }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <AIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 z-50 shadow-lg rounded-full h-14 w-14"
              size="icon"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResizableChatLayout
