import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'rishisharma1707@gmail.com',
    href: 'mailto:rishisharma1707@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 876-435-8167',
    href: 'tel:+918764358167',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Jaipur, Rajasthan, India',
    href: null,
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:rishisharma1707@gmail.com?subject=Portfolio Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
    window.open(mailtoLink);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 md:py-44 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(99,102,241,0.06)_0%,_transparent_50%)]" />

      <motion.div style={{ scale, opacity }} className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          <p className="text-accent-light text-sm font-medium tracking-widest uppercase mb-3">
            Contact
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Let&apos;s work together
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            {contactInfo.map(({ icon: Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.15)' }}
                className="glass-card p-5 transition-all duration-300 cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                    <Icon size={16} className="text-accent-light" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-white text-sm hover:text-accent-light transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-white text-sm">{value}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.15)' }}
              className="glass-card p-5 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <p className="text-green-400 text-xs font-medium">Open for Freelance & Contract Work</p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Available for freelance projects, contract engagements, and consulting
                opportunities. Let&apos;s build something great together.
              </p>
            </motion.div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="md:col-span-3 glass-card p-6 md:p-8"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-500 text-xs block mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/30 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-gray-500 text-xs block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/30 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="text-gray-500 text-xs block mb-1.5">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent/30 transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-accent text-white text-sm font-medium hover:bg-indigo-500 hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {submitted ? 'Opening mail client...' : 'Send Message'}
              <Send size={14} />
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
