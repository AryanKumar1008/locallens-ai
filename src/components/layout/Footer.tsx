import Container from '@/components/layout/Container';
import { APP_NAME } from '@/lib/constants';

/**
 * Minimal site footer with branding and links.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto" role="contentinfo">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
          {/* Brand */}
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>🔭</span>
            <span className="font-medium text-foreground">{APP_NAME}</span>
            <span className="hidden sm:inline">·</span>
            <span>© {currentYear}</span>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-6 text-sm text-muted" role="list">
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors duration-200"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
