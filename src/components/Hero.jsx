import { motion } from 'framer-motion';
import { ArrowDown, ExternalLink, Globe, Mail, Download } from 'lucide-react';
import profileImg from '../assets/profile.png';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.05)_0%,_transparent_40%)]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-5 gap-12 md:gap-16 items-center pt-24 md:pt-0">
        {/* Left: Text content */}
        <div className="md:col-span-3 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-accent-light text-xs font-medium tracking-wide">
                Available for opportunities
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08]"
          >
            Rishi
            <br />
            <span className="bg-gradient-to-r from-white via-accent-light to-accent bg-clip-text text-transparent">
              Sharma
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2 text-accent-light/80 text-sm font-medium tracking-wide uppercase"
          >
            Senior Software Engineer
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 text-gray-400 text-base md:text-lg max-w-lg leading-relaxed font-light"
          >
            Certified Fullstack Developer with 6+ years building highly scalable
            microservices with Java, Spring Boot &amp; React.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3"
          >
            <a
              href="#contact"
              className="px-7 py-3 rounded-full bg-accent text-white text-sm font-medium hover:bg-indigo-500 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
            >
              Get in Touch
            </a>
            <a
              href="#projects"
              className="px-7 py-3 rounded-full border border-white/10 text-gray-300 text-sm font-medium hover:border-white/25 hover:text-white transition-all duration-300"
            >
              View Work
            </a>
            <a
              href="/rishi-portfolio/Rishi_Sharma_Senior_Software_Engineer.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full text-gray-400 text-sm font-medium hover:text-white transition-all duration-300"
            >
              <Download size={15} />
              Resume
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-8 flex items-center justify-center md:justify-start gap-4"
          >
            {[
              { icon: ExternalLink, href: 'https://github.com/rishivak', label: 'GitHub' },
              { icon: Globe, href: 'https://www.linkedin.com/in/rishivak02/', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:rishisharma1707@gmail.com', label: 'Email' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-white hover:border-white/15 transition-all duration-300"
                aria-label={label}
              >
                <Icon size={16} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right: Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="md:col-span-2 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-accent/20 via-transparent to-accent/10 rounded-full blur-2xl" />
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl shadow-accent/10">
              <img
                src={profileImg}
                alt="Rishi Sharma"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-dark-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-gray-400">6+ years</span>
              <span className="text-accent-light font-semibold ml-1">exp.</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="text-gray-600 hover:text-gray-400 transition-colors">
          <ArrowDown size={18} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
