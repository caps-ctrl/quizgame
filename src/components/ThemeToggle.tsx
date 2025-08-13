import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
export default function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-800/40 shadow-lg backdrop-blur-lg border border-white/20 dark:border-gray-700/50 transition-transform active:scale-95 "
    >
      <AnimatePresence mode="wait" initial={false}>
        {dark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-yellow-400"
          >
            <Moon size={26} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-yellow-500"
          >
            <Sun size={28} />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
}
