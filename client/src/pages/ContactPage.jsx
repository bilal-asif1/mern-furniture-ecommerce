import { useState } from 'react';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { Field, TextArea, TextInput } from '../components/Field';
import { apiClient, unwrapApiError } from '../lib/apiClient';
import contactHero from '../assets/images/contact/contact-hero.jpg';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setSuccess('');
    setError('');

    try {
      const { data } = await apiClient.post('/contact', form);
      setSuccess(data?.message || 'Your message has been sent successfully.');
      setForm({ name: '', email: '', message: '' });
    } catch (submissionError) {
      setError(unwrapApiError(submissionError) || 'We could not send your message right now. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        kicker="Contact"
        title="Talk to our team about products, delivery, or custom orders."
        description="Reach out for support, collaborations, or assistance with your furniture purchase."
        image={contactHero}
        imageClassName="!object-[50%_55%]"
      />
      <PageSection>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <div className="space-y-4">
            {[
              ['Email', 'usmanasif859@gmail.com'],
              ['Phone', '+92 3063400146'],
              ['Showroom', '14 Narwala Rd, Jinnah Colony, Faisalabad, Punjab'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-white p-4 shadow-card sm:p-6">
                <p className="text-xs font-semibold text-primary sm:text-sm">{label}</p>
                <p className="mt-1.5 break-words text-base text-text sm:mt-2 sm:text-lg">{value}</p>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="rounded-[2rem] bg-white p-5 shadow-card sm:p-6">
            <SectionTitle eyebrow="Get In Touch" title="Send a Message" />
            {success ? <div className="mt-4 rounded-3xl bg-green-50 px-4 py-3 text-sm text-green-700 sm:mt-5 sm:px-5 sm:py-4">{success}</div> : null}
            {error ? <div className="mt-4 rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:mt-5 sm:px-5 sm:py-4">{error}</div> : null}
            <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-2">
              <Field label="Name"><TextInput value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Your name" required /></Field>
              <Field label="Email"><TextInput value={form.email} onChange={(event) => setField('email', event.target.value)} type="email" placeholder="you@example.com" required /></Field>
            </div>
            <div className="mt-4 sm:mt-5">
              <Field label="Message"><TextArea value={form.message} onChange={(event) => setField('message', event.target.value)} placeholder="Tell us more..." rows={5} sm:rows={6} required /></Field>
            </div>
            <Button className="mt-5 w-full sm:mt-6 sm:w-auto" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</Button>
          </form>
        </div>
      </PageSection>
    </>
  );
}
