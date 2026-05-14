import { SELLERS } from '../data/index.js';
import SellerAvatar from './SellerAvatar.jsx';
import { StarIcon } from './Icons.jsx';

export default function SellerCardCompact({ sellerId, sellerData, navigate }) {
  const s = sellerData || SELLERS[sellerId] || {};
  if (!s.name) return null;
  return (
    <div
      className="flex items-center gap-3.5 p-4 bg-surface border border-border rounded-2xl cursor-pointer hover:border-border-strong transition-colors"
      onClick={() => navigate && navigate('storefront', { id: sellerId || s.id })}
    >
      <SellerAvatar seller={s} size="md" />
      <div className="flex-1 min-w-0">
        <div className="font-serif text-[17px] leading-[1.1] truncate">{s.name}</div>
        <div className="text-xs text-ink-subtle mt-0.5">{s.neighbourhood}{s.distance ? ` · ${s.distance} away` : ''}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-serif text-[22px] leading-none inline-flex items-center gap-1">
          <StarIcon size={14} /> {(s.rating ?? 0).toFixed(1)}
        </div>
        <div className="font-serif italic text-[11px] text-ink-subtle">{s.reviews ?? 0} reviews</div>
      </div>
    </div>
  );
}
