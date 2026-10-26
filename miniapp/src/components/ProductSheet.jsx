import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';
import QtyStepper from './QtyStepper.jsx';
import { formatPrice, discountPercent, onImageError } from '../lib/format.js';

export default function ProductSheet({ product, onClose, onAdd }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [drag, setDrag] = useState(0);
  const startY = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    let r2;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOpen(true));
    });
    document.body.classList.add('no-scroll');
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const close = () => {
    setOpen(false);
    setDrag(0);
    setTimeout(onClose, 280);
  };

  const onTouchStart = (e) => {
    if (scrollRef.current && scrollRef.current.scrollTop > 0) return;
    startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    setDrag(dy > 0 ? dy : 0);
  };
  const onTouchEnd = () => {
    if (startY.current === null) return;
    startY.current = null;
    if (drag > 110) close();
    else setDrag(0);
  };

  const discount = discountPercent(product);
  const ingredients = product.ingredients || [];

  return (
    <div className="sheet-root">
      <div className={`sheet-backdrop ${open ? 'open' : ''}`} onClick={close} />
      <div
        className={`sheet ${open ? 'open' : ''}`}
        style={drag ? { transform: `translateY(${drag}px)`, transition: 'none' } : undefined}
        role="dialog"
        aria-label={product.name}
      >
        <div className="sheet-scroll" ref={scrollRef}>
          <div className="sheet-media" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <div className="sheet-handle" />
            <button className="icon-btn sheet-close" onClick={close} aria-label="Yopish">
              <CloseIcon size={20} />
            </button>
            <img className="sheet-img" src={product.imageUrl} alt="" onError={onImageError} />
          </div>

          <div className="sheet-body">
            <h2 className="sheet-title">{product.name}</h2>
            <div className="prices prices-lg">
              {discount > 0 && <s className="price-old">{formatPrice(product.oldPrice)}</s>}
              <span className="price-new">{formatPrice(product.newPrice)}</span>
            </div>
            {product.description && <p className="sheet-desc">{product.description}</p>}

            {ingredients.length > 0 && (
              <>
                <h3 className="section-title">Tarkibi</h3>
                <ul className="bullets">
                  {ingredients.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="qty-row">
              <span>Miqdori</span>
              <QtyStepper value={qty} onChange={setQty} />
            </div>
          </div>
        </div>

        <div className="sheet-cta">
          <button
            className="btn btn-accent btn-block btn-lg"
            onClick={() => {
              onAdd(product, qty);
              close();
            }}
          >
            Savatchaga qo'shish — {formatPrice(product.newPrice * qty)}
          </button>
        </div>
      </div>
    </div>
  );
}
