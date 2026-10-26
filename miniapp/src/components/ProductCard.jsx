import { PlusIcon } from './Icons.jsx';
import QtyStepper from './QtyStepper.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPrice, discountPercent, onImageError } from '../lib/format.js';

export default function ProductCard({ product, onOpen, onQuickAdd }) {
  const cart = useCart();
  const inCart = cart.items.find((i) => i.productId === product.id);
  const discount = discountPercent(product);

  return (
    <article className="card">
      <button className="card-hit" onClick={() => onOpen(product)} aria-label={`${product.name} haqida`}>
        <div className="card-media">
          <img src={product.imageUrl} alt="" loading="lazy" onError={onImageError} />
        </div>
        <h3 className="card-name">{product.name}</h3>
        {product.description && <p className="card-desc">{product.description}</p>}
      </button>
      <div className={`card-bottom ${inCart ? 'in-cart' : ''}`}>
        <div className="prices">
          {discount > 0 && <s className="price-old">{formatPrice(product.oldPrice)}</s>}
          <span className="price-new">{formatPrice(product.newPrice)}</span>
        </div>
        {inCart ? (
          <QtyStepper small min={0} value={inCart.quantity} onChange={(q) => cart.setQty(product.id, q)} />
        ) : (
          <button className="add-btn" aria-label={`${product.name}ni savatchaga qo'shish`} onClick={() => onQuickAdd(product)}>
            <PlusIcon size={18} strokeWidth={2.4} />
          </button>
        )}
      </div>
    </article>
  );
}
