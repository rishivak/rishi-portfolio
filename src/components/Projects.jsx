import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Brain, Building2, HeartPulse, ChevronLeft, ChevronRight } from 'lucide-react';
import foreseerImg from '../assets/foreseer.png';
import foreseer2Img from '../assets/foreseer2.png';
import doeImg from '../assets/DOE.png';
import doe1Img from '../assets/DOE1.png';
import doe2Img from '../assets/doe2.png';
import healthcareImg from '../assets/plan4healthcare.png';
import healthcare2Img from '../assets/plan4healthcare2.png';

const projects = [
  {
    icon: Brain,
    title: 'Foreseer - AI',
    company: 'S&P Global',
    description:
      'Enterprise platform leveraging AI and NLP to extract information from unstructured financial documents at mass level. Analytical tool built with Java, Spring Boot, and microservices architecture.',
    tags: ['Java', 'Spring Boot', 'NLP', 'ActiveMQ', 'AWS', 'Docker'],
    images: [foreseerImg, foreseer2Img],
    highlight: true,
  },
  {
    icon: Building2,
    title: 'DOE - Abu Dhabi',
    company: 'Department of Energy',
    description:
      'Government licensing platform with robust securities and authentication. Established B2B network for licensing of energy plants with complex data exchange mechanisms.',
    tags: ['Java', 'J2EE', 'Spring Security', 'REST APIs', 'XML/EDI'],
    images: [doeImg, doe1Img, doe2Img],
  },
  {
    icon: HeartPulse,
    title: 'Plan4HealthCare',
    company: 'Govt. Healthcare Platform',
    description:
      'Government healthcare financial and budgeting platform. Budgeting software for government medical hospitals to estimate and maintain budget in real time.',
    tags: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'Angular'],
    images: [healthcareImg, healthcare2Img],
  },
];

function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-5 group/carousel">
      <img
        src={images[current]}
        alt="Project screenshot"
        className="w-full h-full object-cover transition-transform duration-500 group-hover/carousel:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent" />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((p) => (p - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-950/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCurrent((p) => (p + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-dark-950/60 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
          >
            <ChevronRight size={14} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === current ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="py-28 md:py-36 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.04)_0%,_transparent_60%)]" />

      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Projects
          </p>
          <h2 className="section-heading">What I&apos;ve built</h2>
          <p className="section-subheading">
            Enterprise-grade platforms powering government and financial operations.
          </p>
        </motion.div>

        {/* Featured project — full width */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-14 glass-card p-6 md:p-8 hover:border-white/10 transition-all duration-300 group"
        >
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ImageCarousel images={projects[0].images} />
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-accent/10">
                  <Brain size={20} className="text-accent-light" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{projects[0].title}</h3>
                  <p className="text-accent-light/70 text-xs">{projects[0].company}</p>
                </div>
                <span className="ml-auto text-[10px] px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                  CURRENT
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">
                {projects[0].description}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {projects[0].tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other projects — grid */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {projects.slice(1).map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + 0.1 * i }}
                className="glass-card p-6 md:p-8 hover:border-white/10 transition-all duration-300 group flex flex-col"
              >
                {project.images.length > 0 && (
                  <ImageCarousel images={project.images} />
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-accent/10">
                    <Icon size={20} className="text-accent-light" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">{project.title}</h3>
                    <p className="text-accent-light/70 text-xs">{project.company}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] text-gray-500 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
