import { useEffect, useState } from 'react';
import QtyStepper from '../components/QtyStepper.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { CartIcon, CheckIcon, PinIcon, PhoneIcon, CloseIcon } from '../components/Icons.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../lib/api.js';
import { local } from '../lib/storage.js';
import { formatPrice, onImageError } from '../lib/format.js';
import { isTelegram, canRequestContact, requestPhone, getLocation, hapticNotify, haptic, closeApp } from '../lib/telegram.js';

export default function Cart({ me, upsell, onGoCatalog, onOrderCreated, showToast }) {
  const cart = useCart();
  const [phone, setPhone] = useState(me?.phone || '');
  const [address, setAddress] = useState(() => local.get('last_address') || '');
  const [comment, setComment] = useState('');
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(null);

  useEffect(() => {
    if (me?.phone) setPhone((p) => p || me.phone);
  }, [me]);

  const upsellPrice = cart.upsell && upsell ? upsell.price : 0;
  const total = cart.subtotal + upsellPrice;

  const askPhone = async () => {
    const p = await requestPhone();
    if (p) {
      setPhone(p);
      setErrors((e) => ({ ...e, phone: null }));
    }
  };

  const locate = async () => {
    setLocating(true);
    try {
      const c = await getLocation();
      setCoords(c);
      setErrors((e) => ({ ...e, address: null }));
      hapticNotify('success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLocating(false);
    }
  };

  const submit = async () => {
    const errs = {};
    if (phone.replace(/\D/g, '').length < 9) errs.phone = 'Telefon raqamini kiriting';
    if (!address.trim() && !coords) errs.address = 'Manzilni yozing yoki joylashuvni yuboring';
    setErrors(errs);
    if (Object.keys(errs).length) {
      hapticNotify('error');
      document.querySelector('.checkout-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    setSubmitting(true);
    try {
      const { order } = await api.createOrder({
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        withUpsell: Boolean(cart.upsell && upsell),
        phone,
        address,
        comment,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      });
      local.set('last_address', address);
      hapticNotify('success');
      cart.clear();
      setDone(order);
      onOrderCreated?.(order);
      if (isTelegram) setTimeout(closeApp, 1800);
    } catch (err) {
      hapticNotify('error');
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="success">
        <div className="success-check">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path className="check-draw" d="M20 6 9 17l-5-5" pathLength="1" />
          </svg>
        </div>
        <h2>Buyurtma qabul qilindi!</h2>
        <p className="muted">Buyurtma #{done.id}</p>
        <p>Kuryerimiz tez orada siz bilan bog'lanadi. Tasdiq xabari botda.</p>
        {!isTelegram && (
          <button className="btn btn-dark" onClick={() => { setDone(null); onGoCatalog(); }}>
            Yana buyurtma berish
          </button>
        )}
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart">
        <header className="page-header">
          <h1>Savatcha</h1>
        </header>
        <EmptyState
          icon={CartIcon}
          title="Savatchangiz bo'sh"
          text="Katalogdan pizza tanlang: kartadagi + tugmasi uni shu yerga qo'shadi."
          action={
            <button className="btn btn-accent" onClick={onGoCatalog}>
              Katalogga o'tish
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="cart has-checkout">
      <header className="page-header">
        <h1>Savatcha</h1>
        <p className="muted">{cart.count} ta mahsulot</p>
      </header>

      <div className="cart-list">
        {cart.items.map((item) => (
          <div className="cart-item" key={item.productId}>
            <img src={item.imageUrl} alt={item.name} onError={onImageError} />
            <div className="cart-item-info">
              <b>{item.name}</b>
              <span className="price-new">{formatPrice(item.price * item.quantity)}</span>
              {item.quantity > 1 && <small className="muted">{formatPrice(item.price)} × {item.quantity}</small>}
            </div>
            <div className="cart-item-actions">
              <button className="remove-btn" onClick={() => { haptic('light'); cart.setQty(item.productId, 0); }} aria-label="O'chirish">
                <CloseIcon size={16} />
              </button>
              <QtyStepper small min={0} value={item.quantity} onChange={(q) => cart.setQty(item.productId, q)} />
            </div>
          </div>
        ))}
      </div>

      {upsell && (
        <label className={`upsell ${cart.upsell ? 'on' : ''}`}>
          <img src={upsell.imageUrl} alt="" />
          <span className="upsell-text">
            Bunga qo'shimcha ravishda <b>{upsell.shortName}</b> ni atigi <b>{formatPrice(upsell.price)}</b>ga qo'shasizmi?
          </span>
          <span className="switch">
            <input
              type="checkbox"
              checked={cart.upsell}
              onChange={(e) => {
                haptic('light');
                cart.setUpsell(e.target.checked);
              }}
            />
            <span className="switch-track" />
          </span>
        </label>
      )}

      <section className="checkout-form">
        <h3 className="section-title">Yetkazib berish</h3>

        <div className={`field ${errors.phone ? 'has-error' : ''}`}>
          <label htmlFor="phone">Telefon raqam</label>
          <div className="field-row">
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {canRequestContact && (
              <button type="button" className="btn btn-soft btn-icon" onClick={askPhone} aria-label="Telegram raqamini olish">
                <PhoneIcon size={18} />
              </button>
            )}
          </div>
          {errors.phone && <small className="error">{errors.phone}</small>}
        </div>

        <div className={`field ${errors.address ? 'has-error' : ''}`}>
          <label htmlFor="address">Manzil</label>
          <textarea
            id="address"
            rows={2}
            placeholder="Ko'cha, uy, xonadon, mo'ljal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="button" className={`location-btn ${coords ? 'ok' : ''}`} onClick={locate} disabled={locating}>
            {coords ? <CheckIcon size={18} /> : <PinIcon size={18} />}
            {locating ? 'Aniqlanmoqda...' : coords ? 'Joylashuv yuborildi' : 'Joylashuvimni aniqlash'}
          </button>
          {errors.address && <small className="error">{errors.address}</small>}
        </div>

        <div className="field">
          <label htmlFor="comment">Izoh (ixtiyoriy)</label>
          <input id="comment" placeholder="Masalan: domofon 25" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
      </section>

      <section className="summary">
        <div className="summary-row">
          <span>Mahsulotlar</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        {upsellPrice > 0 && (
          <div className="summary-row">
            <span>{upsell.name}</span>
            <span>{formatPrice(upsellPrice)}</span>
          </div>
        )}
        <div className="summary-row total">
          <span>Jami</span>
          <span>{formatPrice(total)}</span>
        </div>
      </section>

      <div className="checkout-bar">
        <button className="btn btn-accent btn-block btn-lg" onClick={submit} disabled={submitting}>
          {submitting ? 'Yuborilmoqda...' : `Buyurtmani tasdiqlash · ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  );
}
