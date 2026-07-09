import { Link } from 'react-router-dom';
import PageSection from '../components/PageSection';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <PageSection className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-text">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-text/65">The page you requested does not exist or may have moved.</p>
        <Button to="/" className="mt-8">Go Home</Button>
      </div>
    </PageSection>
  );
}
