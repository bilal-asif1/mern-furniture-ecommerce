import { useState } from 'react';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import { Field, TextArea, TextInput } from '../components/Field';
import { apiClient, unwrapApiError } from '../lib/apiClient';

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
        image="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80"
      />
      <PageSection>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {[
              ['Email', 'usmanasif859@gmail.com'],
              ['Phone', '+92 3063400146'],
              ['Showroom', '14 Narwala Rd, Jinnah Colony, Faisalabad, Punjab'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-white p-6 shadow-card">
                <p className="text-sm font-semibold text-primary">{label}</p>
                <p className="mt-2 text-lg text-text">{value}</p>
              </div>
            ))}
          </div>
          <form onSubmit={submit} className="rounded-[2rem] bg-white p-6 shadow-card">
            <SectionTitle eyebrow="Get In Touch" title="Send a Message" />
            {success ? <div className="mt-5 rounded-3xl bg-green-50 px-5 py-4 text-sm text-green-700">{success}</div> : null}
            {error ? <div className="mt-5 rounded-3xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Name"><TextInput value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Your name" required /></Field>
              <Field label="Email"><TextInput value={form.email} onChange={(event) => setField('email', event.target.value)} type="email" placeholder="you@example.com" required /></Field>
            </div>
            <div className="mt-5">
              <Field label="Message"><TextArea value={form.message} onChange={(event) => setField('message', event.target.value)} placeholder="Tell us more..." rows={6} required /></Field>
            </div>
            <Button className="mt-6" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</Button>
          </form>
        </div>
      </PageSection>
    </>
  );
}
