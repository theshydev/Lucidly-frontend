import React from 'react';
import { BookOpen, Save, Search } from 'lucide-react';

export default function JournalPage({ authFetch }) {
  const [entries, setEntries] = React.useState([]);
  const [content, setContent] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [message, setMessage] = React.useState('');

  const load = React.useCallback(async () => {
    const res = await authFetch('/api/journal');
    if (!res.ok) throw new Error('Could not load your journal.');
    const data = await res.json();
    setEntries(data.entries || (data.entry ? [data.entry] : []));
  }, [authFetch]);

  React.useEffect(() => { load().catch((error) => setMessage(error.message)); }, [load]);

  const save = async () => {
    if (!content.trim()) return setMessage('Write literally anything. Even one sentence.');
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/journal', { method: 'POST', body: JSON.stringify({ content: content.trim() }) });
      if (!res.ok) throw new Error('Could not save this entry.');
      const data = await res.json();
      setEntries((current) => [data.entry, ...current.filter((entry) => entry.id !== data.entry.id)]);
      setContent('');
      setMessage('Saved to your little archive.');
    } catch (error) { setMessage(error.message); }
    finally { setSaving(false); }
  };

  const filtered = entries.filter((entry) => entry.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="lucidly-page">
      <div className="lucidly-page-kicker"><BookOpen size={14} /> JOURNAL / PRIVATE</div>
      <div className="lucidly-page-title"><h1>Dump the brain.</h1><p>No streaks. No perfect paragraphs. Just somewhere to put the thing.</p></div>

      <section className="lucidly-editor-card">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Dear future me..." rows={10} maxLength={12000} />
        <div className="lucidly-editor-footer"><span>{content.length.toLocaleString()} characters</span><button className="lucidly-primary-button" onClick={save} disabled={saving}><Save size={16} /> {saving ? 'saving...' : 'Save entry'}</button></div>
      </section>

      <div className="lucidly-history-heading"><div><span>your archive</span><h2>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</h2></div><label className="lucidly-search"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search your thoughts" /></label></div>
      {message && <p className="lucidly-form-message">{message}</p>}

      <section className="lucidly-entry-grid">
        {filtered.length ? filtered.map((entry) => (
          <article className="lucidly-entry-card" key={entry.id}>
            <time>{new Date(entry.updated_at || entry.created_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</time>
            <p>{entry.content}</p>
          </article>
        )) : <div className="lucidly-empty-state">Nothing here yet. Your future archive starts with one tiny entry.</div>}
      </section>
    </div>
  );
}
