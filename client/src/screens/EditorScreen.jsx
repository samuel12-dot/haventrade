import { useRef, useState } from 'react';
import ListingCard from '../components/ListingCard.jsx';
import { api } from '../api/index.js';

function Section({ title, sub, num, children }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-[22px]">
      <div className="flex items-baseline gap-3.5 mb-4">
        <span className="font-mono text-[11px] text-hearth">{num}</span>
        <div>
          <div className="font-serif text-[22px] leading-[1.05]">{title}</div>
          <div className="font-serif italic text-[13px] text-ink-subtle">{sub}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="font-mono text-[9px] text-ink-muted mb-1.5 uppercase tracking-[0.18em]">{label}</div>
      {children}
    </label>
  );
}

const COND_LABELS = ['For parts', 'Fair', 'Good', 'Like new', 'New'];
const MAX_PHOTOS  = 6;

export default function EditorScreen({ navigate }) {
  const fileRef = useRef(null);
  const [pendingSlot, setPendingSlot] = useState(null);

  const [type,        setType]        = useState('physical');
  const [cond,        setCond]        = useState(4);
  const [free,        setFree]        = useState(false);
  const [title,       setTitle]       = useState('');
  const [price,       setPrice]       = useState('');
  const [cat,         setCat]         = useState('Furniture');
  const [grad,        setGrad]        = useState('grad-vintage');
  const [description, setDescription] = useState('');
  const [sub,         setSub]         = useState('');
  const [dimensions,  setDimensions]  = useState('');
  const [weight,      setWeight]      = useState('');
  const [materials,   setMaterials]   = useState('');
  const [format,      setFormat]      = useState('PDF + PNG');
  const [license,     setLicense]     = useState('Personal use');
  const [delivery,    setDelivery]    = useState({ cargo: true, self: false, pickup: false });
  const [images,      setImages]      = useState([]);   // array of Cloudinary URLs
  const [uploading,   setUploading]   = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');

  // ── Photo upload ──────────────────────────────────────────────────────────

  function openPicker(idx) {
    setPendingSlot(idx);
    fileRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const { url } = await api.uploadImage(file);
      setImages((prev) => {
        const next = [...prev];
        if (pendingSlot < next.length) {
          next[pendingSlot] = url;
        } else {
          next.push(url);
        }
        return next;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Publish ───────────────────────────────────────────────────────────────

  async function handlePublish(status = 'active') {
    setError('');
    if (!title.trim())          return setError('Title is required.');
    if (!free && !price)        return setError('Enter a price, or mark it free.');

    setSaving(true);
    try {
      const body = {
        title:          title.trim(),
        price:          free ? 0 : Number(price),
        category:       cat,
        condition:      COND_LABELS[cond - 1],
        conditionLevel: cond,
        grad,
        description:    description.trim(),
        sub:            sub.trim(),
        digital:        type === 'digital',
        images,
        status,
        deliveryOptions: delivery,
        ...(type === 'physical'
          ? { dimensions: dimensions.trim(), weight: weight.trim(), materials: materials.trim() }
          : { format, license }),
      };
      await api.createListing(body);
      navigate('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const photoSlots = Array.from({ length: MAX_PHOTOS }, (_, i) => images[i] || null);

  return (
    <div className="page">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Page header */}
      <div className="flex items-start sm:items-end justify-between mb-7 flex-col sm:flex-row gap-4 sm:gap-0">
        <div>
          <a onClick={() => navigate('dashboard')} className="text-[13px] text-ink-muted underline underline-offset-3 cursor-pointer">← Back to dashboard</a>
          <h1 className="h-page mt-2 mb-1">New listing</h1>
          <div className="font-serif italic text-[16px] text-ink-muted">Take your time. The neighbours can wait.</div>
        </div>
        <div className="flex gap-2.5">
          <button className="btn btn--ghost" disabled={saving} onClick={() => handlePublish('draft')}>Save as draft</button>
          <button className="btn btn--primary" disabled={saving || uploading} onClick={() => handlePublish('active')}>
            {saving ? 'Publishing…' : 'Publish to street →'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-hearth/10 border border-hearth/30 rounded-xl text-[13px] text-hearth">{error}</div>
      )}

      <div className="grid gap-7 lg:gap-9 lg:[grid-template-columns:1.7fr_1fr]">
        <div className="flex flex-col gap-5">
          {/* Type tabs */}
          <div className="flex gap-1.5 p-1 bg-surface-2 rounded-xl self-start">
            {[['physical','Physical good'],['digital','Digital good']].map(([k, l]) => (
              <button key={k} onClick={() => setType(k)} className="btn btn--sm" style={{ background: type === k ? 'var(--surface)' : 'transparent', boxShadow: type === k ? 'var(--shadow-sm)' : 'none', color: 'var(--ink)' }}>{l}</button>
            ))}
          </div>

          {/* Photos */}
          <Section title="Photos" sub="Up to 6. The first becomes your hero." num="01">
            <div className="grid grid-cols-6 gap-2.5">
              {photoSlots.map((url, i) =>
                url ? (
                  <div key={i} className="aspect-square rounded-[10px] relative overflow-hidden group">
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {i === 0 && <span className="absolute top-1.5 left-1.5 font-mono text-[8px] font-bold bg-ink text-saffron px-1.5 py-0.5 rounded tracking-[0.14em] z-10">HERO</span>}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 group-hover:opacity-100 text-white text-xl transition-opacity"
                      title="Remove"
                    >×</button>
                  </div>
                ) : (
                  <button
                    key={i}
                    onClick={() => openPicker(i)}
                    disabled={uploading}
                    className="aspect-square rounded-[10px] bg-surface border-[1.5px] border-dashed border-border-strong text-ink-subtle text-[22px]"
                  >
                    {uploading && i === images.length ? '…' : '+'}
                  </button>
                )
              )}
            </div>
          </Section>

          {/* Basics */}
          <Section title="The basics" sub="Title, category, condition." num="02">
            <div className="flex flex-col gap-3.5">
              <Field label="TITLE">
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vintage teak armchair" />
              </Field>
              <Field label="SUB-LABEL (shown under title on card)">
                <input className="input" value={sub} onChange={(e) => setSub(e.target.value)} placeholder="e.g. Good · Refinished teak frame" />
              </Field>
              <div className="grid grid-cols-2 gap-3.5">
                <Field label="CATEGORY">
                  <select className="input" value={cat} onChange={(e) => setCat(e.target.value)}>
                    {['Furniture','Electronics','Vintage','Kids & Baby','Clothing','Books & Media','Home & Garden','Free'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <div>
                  <div className="font-mono text-[9px] text-ink-muted mb-1.5 uppercase tracking-[0.18em]">CONDITION</div>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 bg-surface border-[1.5px] border-border rounded-[10px]">
                    <span className="cond-dots">
                      {[0,1,2,3,4].map((i) => (
                        <span key={i} className={`d${i < cond ? ' on' : ''}`} style={{ cursor: 'pointer', width: 8, height: 8 }} onClick={() => setCond(i + 1)} />
                      ))}
                    </span>
                    <span className="font-serif italic text-[14px]">{COND_LABELS[cond - 1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Description */}
          <Section title="Tell its story" sub="What's the history? Why are you selling?" num="03">
            <textarea
              className="input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sourced from a 1960s living room in Maitama, this teak armchair has been carefully refinished…"
            />
          </Section>

          {/* Price */}
          <Section title="Price" sub="Or make it free." num="04">
            <div className="flex gap-3.5 items-end">
              <div className="flex-1">
                <div className="font-mono text-[9px] text-ink-muted mb-1.5 uppercase tracking-[0.18em]">NGN</div>
                <input
                  className="input font-serif text-[24px]"
                  type="number"
                  min="0"
                  value={free ? 0 : price}
                  disabled={free}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <label className={`flex items-center gap-2.5 px-4 py-3 rounded-[10px] cursor-pointer border-[1.5px] ${free ? 'bg-moss-soft border-moss' : 'bg-surface border-border'}`}>
                <input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} />
                <span className="font-serif italic text-[14px]">or, make it free</span>
              </label>
            </div>
          </Section>

          {/* Item details */}
          <Section title={type === 'physical' ? 'Item details' : 'License & format'} sub={type === 'physical' ? 'Used by buyers to assess fit and space.' : 'What does the buyer get?'} num="05">
            {type === 'physical' ? (
              <div className="grid grid-cols-3 gap-3">
                <Field label="DIMENSIONS">
                  <input className="input" value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="76 × 72 × 88 cm" />
                </Field>
                <Field label="WEIGHT">
                  <input className="input" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="11.4 kg" />
                </Field>
                <Field label="MATERIALS">
                  <input className="input" value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="Teak, canvas" />
                </Field>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field label="FORMAT">
                  <select className="input" value={format} onChange={(e) => setFormat(e.target.value)}>
                    {['PDF + PNG','PDF only','ZIP archive'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="LICENSE">
                  <select className="input" value={license} onChange={(e) => setLicense(e.target.value)}>
                    {['Personal use','Commercial','Editorial only'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
              </div>
            )}
          </Section>

          {/* Delivery */}
          {type === 'physical' && (
            <Section title="Delivery" sub="How does this reach the neighbour?" num="06">
              <div className="flex flex-col gap-2.5">
                {[
                  ['cargo',  'Cargo-bike courier',   'Platform handles it · ₦1,500'],
                  ['self',   "I'll deliver myself",  'Within Maitama, free over ₦15,000'],
                  ['pickup', 'Pickup from workshop', 'Aminu Kano Crescent 47-B'],
                ].map(([key, t, s]) => (
                  <label key={key} className="flex items-center gap-3.5 px-[18px] py-3.5 bg-surface border-[1.5px] border-border rounded-xl cursor-pointer">
                    <input type="checkbox" checked={delivery[key]} onChange={(e) => setDelivery((d) => ({ ...d, [key]: e.target.checked }))} />
                    <div className="flex-1">
                      <div className="text-[14px] font-medium">{t}</div>
                      <div className="font-serif italic text-[12px] text-ink-subtle">{s}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Live preview */}
        <aside className="sticky top-[88px] self-start">
          <div className="font-mono text-[10px] text-hearth mb-3 uppercase tracking-widest-2">LIVE PREVIEW · IN THE FEED</div>
          <ListingCard listing={{
            id: 'lXX',
            title:          title || 'Untitled listing',
            price:          free ? 0 : (Number(price) || 0),
            category:       cat,
            condition:      COND_LABELS[cond - 1],
            conditionLevel: cond,
            distance:       '0.4 km',
            neighbourhood:  'Maitama',
            grad,
            eta:            'today',
            stock:          1,
            digital:        type === 'digital',
            sub:            sub || `${COND_LABELS[cond - 1]} · ${cat}`,
            images,
            _seller: { id: 'preview', name: 'You', initial: 'Y', grad: 'grad-cool', rating: 5, reviews: 0, distance: '0.4 km' },
          }} />
          <div className="mt-4 grid grid-cols-5 gap-1.5">
            <div className="font-mono text-[9px] text-ink-muted col-span-5 mb-1 uppercase tracking-[0.14em]">HERO COLOUR (fallback)</div>
            {['grad-vintage','grad-terracotta','grad-saffron','grad-moss','grad-cool'].map((g) => (
              <button key={g} onClick={() => setGrad(g)} className={`grad ${g} aspect-square rounded-lg`} style={{ outline: grad === g ? '2px solid var(--ink)' : 'none', outlineOffset: 2 }} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
