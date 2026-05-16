import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Mail, Download, X } from 'lucide-react';
import { useState, useRef } from 'react';
import profileImg from '../assets/profile.png';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function Hero() {
  const [showLightbox, setShowLightbox] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const nameWords = ['Rishi', 'Sharma'];

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[120vh] flex items-center px-6 overflow-hidden"
    >
      {/* Animated background orbs */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.05)_0%,_transparent_40%)]" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-5 gap-12 md:gap-16 items-center pt-24 md:pt-0">
        {/* Left: Text content with scroll parallax */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="md:col-span-3 text-center md:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-accent-light text-xs font-medium tracking-wide">
                Available for Freelance & Contract Work
              </span>
            </div>
          </motion.div>

          {/* Word-by-word reveal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08]">
            {nameWords.map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`block ${i === 1 ? 'bg-gradient-to-r from-white via-accent-light to-accent bg-clip-text text-transparent' : ''}`}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-2 text-accent-light/80 text-sm font-medium tracking-wide uppercase"
          >
            Senior Software Engineer
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-5 text-gray-400 text-base md:text-lg max-w-lg leading-relaxed font-light"
          >
            Certified Fullstack Developer with 6+ years building highly scalable
            microservices with Java, Spring Boot &amp; React.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3"
          >
            <a
              href="#contact"
              className="px-7 py-3 rounded-full bg-accent text-white text-sm font-medium hover:bg-indigo-500 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="px-7 py-3 rounded-full border border-white/10 text-gray-300 text-sm font-medium hover:border-white/25 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              View Work
            </a>
            <a
              href="/rishi-portfolio/Rishi_Sharma_Senior_Software_Engineer.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full text-gray-400 text-sm font-medium hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Download size={15} />
              Resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex items-center justify-center md:justify-start gap-4"
          >
            <a
              href="https://github.com/rishivak"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-white hover:border-white/15 hover:scale-110 transition-all duration-300"
              aria-label="GitHub"
            >
              <GithubIcon width={16} height={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/rishivak02/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-white hover:border-white/15 hover:scale-110 transition-all duration-300"
              aria-label="LinkedIn"
            >
              <LinkedinIcon width={16} height={16} />
            </a>
            <a
              href="mailto:rishisharma1707@gmail.com"
              className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-white hover:border-white/15 hover:scale-110 transition-all duration-300"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Profile photo with scroll zoom */}
        <motion.div
          style={{ scale: photoScale, opacity: photoOpacity }}
          className="md:col-span-2 flex justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative cursor-pointer"
            onClick={() => setShowLightbox(true)}
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-transparent to-accent/10 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-accent/10 hover:border-accent/30 transition-all duration-300 hover:shadow-accent/20">
              <img
                src={profileImg}
                alt="Rishi Sharma"
                className="w-full h-full object-cover object-[center_5%] scale-[1.15]"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-2 -right-2 bg-dark-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs"
            >
              <span className="text-gray-400">6+ years</span>
              <span className="text-accent-light font-semibold ml-1">exp.</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/90 backdrop-blur-md"
            onClick={() => setShowLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={profileImg}
                alt="Rishi Sharma"
                className="w-full h-auto rounded-2xl shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute -top-3 -right-3 p-2 rounded-full bg-dark-800 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="text-gray-600 hover:text-gray-400 transition-colors">
          <ArrowDown size={18} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
