export default function SellerAvatar({ seller, size = 'sm' }) {
  const cls =
    size === 'lg' ? 'seller-avatar seller-avatar--lg' :
    size === 'md' ? 'seller-avatar seller-avatar--md' :
    'seller-avatar';
  return (
    <span className={`${cls} grad ${seller.grad}`}>
      <span style={{ position: 'relative', zIndex: 1 }}>{seller.initial}</span>
    </span>
  );
}
