import { useState } from 'react';
import { PinIcon } from './Icons.jsx';

export default function PostcodeInput({ onSubmit }) {
  const [val, setVal] = useState('900237');
  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 14,
      boxShadow: 'var(--shadow-lift)',
      padding: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      maxWidth: 460,
    }}>
      <span style={{
        width: 38, height: 38, borderRadius: 10, background: 'var(--surface-2)',
        color: 'var(--hearth)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <PinIcon size={18} />
      </span>
      <input
        className="input"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Your postcode"
        style={{ border: 'none', boxShadow: 'none', flex: 1, fontFamily: 'var(--mono)', fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit && onSubmit()}
      />
      <button className="btn btn--dark" onClick={onSubmit}>FIND <span className="arr">→</span></button>
    </div>
  );
}
