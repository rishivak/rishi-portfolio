import { ExternalLink, Globe, Mail, Heart } from 'lucide-react';

const socialLinks = [
  { icon: ExternalLink, href: 'https://github.com/rishivak', label: 'GitHub' },
  { icon: Globe, href: 'https://www.linkedin.com/in/rishivak02/', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:rishisharma1707@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <span>&copy; {new Date().getFullYear()} Rishi Sharma</span>
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-1">
            Built with <Heart size={12} className="text-red-400/60" />
          </span>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-white transition-colors duration-200"
              aria-label={label}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
