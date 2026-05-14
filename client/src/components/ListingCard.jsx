import { SELLERS } from '../data/index.js';
import MarketTicket from './MarketTicket.jsx';
import SellerAvatar from './SellerAvatar.jsx';
import { HeartIcon } from './Icons.jsx';

export default function ListingCard({ listing, onClick, saved, onSave, sold = false }) {
  const seller   = listing._seller || SELLERS[listing.sellerId] || {};
  const isFree   = listing.price === 0;
  const isDigital = listing.digital;
  const idStr    = String(listing.id);
  const distRot  = -2 + (idStr.charCodeAt(1) % 5);
  const etaRot   = -2 + (idStr.charCodeAt(2) % 5);

  return (
    <div className="listing" onClick={onClick}>
      <div className={`listing-hero grad ${listing.grad}`}>
        {listing.images?.[0] && (
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '20px',
              filter: 'drop-shadow(0 6px 20px rgba(30,20,10,0.20))',
            }}
          />
        )}
        {sold && (
          <div className="sold-stamp">
            <span className="text">SOLD</span>
          </div>
        )}

        <div className="corner tl">
          {isDigital
            ? <MarketTicket label="DIGITAL" value="instant" rotation={distRot} variant="saffron" />
            : <MarketTicket label={`N° ${listing.id.slice(1).padStart(4, '0')}`} value={listing.distance} rotation={distRot} />
          }
        </div>
        <div className="corner tr">
          <span className="cat-pill">{listing.category.toUpperCase()}</span>
        </div>
        <div className="corner bl">
          {isDigital
            ? <MarketTicket label="DOWNLOAD" value="instant" rotation={etaRot} variant="saffron" />
            : <MarketTicket label="ETA" value={listing.eta} rotation={etaRot} variant="moss" />
          }
        </div>
        <div className="corner br">
          <button
            className={`heart-btn${saved ? ' saved' : ''}`}
            onClick={(e) => { e.stopPropagation(); onSave && onSave(listing.id); }}
            aria-label="Save"
          >
            <HeartIcon filled={saved} />
          </button>
        </div>
      </div>

      <div className="listing-body">
        <div className="listing-titlerow">
          <span className="listing-title">{listing.title}</span>
          {isFree
            ? <span className="serif" style={{ fontSize: 22, color: 'var(--moss)', fontStyle: 'italic' }}>Free</span>
            : <span className="price-md">€{listing.price}</span>
          }
        </div>
        <div className="listing-sub">{listing.sub}</div>

        <div className="listing-foot">
          <div className="seller-chip">
            <SellerAvatar seller={seller} />
            <span>
              <span className="seller-name">{seller.name}</span>
              <span className="seller-rating" style={{ marginLeft: 6 }}>· {(seller.rating ?? 0).toFixed(1)}</span>
            </span>
          </div>
          <span className="mono" style={{ fontSize: 9, color: listing.stock <= 1 ? 'var(--hearth)' : 'var(--ink-subtle)' }}>
            {isFree && listing.stock > 1
              ? `${listing.stock} AVAILABLE`
              : listing.stock <= 1
              ? '1 LEFT'
              : `${listing.stock} IN STOCK`}
          </span>
        </div>
      </div>
    </div>
  );
}
