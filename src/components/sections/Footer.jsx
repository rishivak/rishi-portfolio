import { profile } from '../../data/profile';

/** One hairline row. The page has already said everything it needs to. */
export function Footer() {
  return (
    <footer className="border-t border-hair">
      <div className="shell flex flex-wrap items-center justify-between gap-4 py-8">
        <p className="meta">
          © {new Date().getFullYear()} {profile.first} {profile.last}
        </p>
        <p className="meta">Built with React · No template</p>
      </div>
    </footer>
  );
}
