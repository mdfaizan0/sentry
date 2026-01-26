import { motion } from "framer-motion"

const Loading = () => {
  const layerTransition = (delay) => ({
    y: {
      duration: 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
      times: [0, 0.2, 0.8, 1]
    },
    opacity: {
      duration: 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
      times: [0, 0.2, 0.8, 1]
    }
  })

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top Layer */}
          <motion.path
            animate={{ y: [-20, 0, 0, 20], opacity: [0, 1, 1, 0] }}
            transition={layerTransition(0)}
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="currentColor"
            className="text-primary"
          />
          {/* Middle Layer */}
          <motion.path
            animate={{ y: [-20, 0, 0, 20], opacity: [0, 1, 1, 0] }}
            transition={layerTransition(0.2)}
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary/80"
          />
          {/* Bottom Layer */}
          <motion.path
            animate={{ y: [-20, 0, 0, 20], opacity: [0, 1, 1, 0] }}
            transition={layerTransition(0.4)}
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary/60"
          />
        </svg>

        {/* Subtle outer glow that pulses */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-primary blur-3xl rounded-full -z-10"
        />
      </div>
    </div>
  )
}

export default Loading
