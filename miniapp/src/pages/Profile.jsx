import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState.jsx';
import { RepeatIcon, ReceiptIcon } from '../components/Icons.jsx';
import { api } from '../lib/api.js';
import { getTgUser } from '../lib/telegram.js';
import { formatPrice, formatDate } from '../lib/format.js';

const STATUS = {
  KUTILMOQDA: { label: 'Kutilmoqda', className: 'status-pending' },
  YETKAZILDI: { label: 'Yetkazildi', className: 'status-done' },
};

export default function Profile({ me, onReorder, refreshKey }) {
  const tgUser = getTgUser();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    api
      .orders()
      .then((d) => alive && setOrders(d.orders))
      .catch((e) => {
        if (!alive) return;
        setError(e.message);
        setOrders([]);
      });
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  const name = me?.name || [tgUser?.first_name, tgUser?.last_name].filter(Boolean).join(' ') || 'Mehmon';
  const username = me?.username || tgUser?.username;

  return (
    <div className="profile">
      <header className="page-header">
        <h1>Profil</h1>
      </header>

      <section className="profile-card">
        <div className="profile-avatar">
          {tgUser?.photo_url ? <img src={tgUser.photo_url} alt="" /> : <span>{name.charAt(0).toUpperCase()}</span>}
        </div>
        <div className="profile-info">
          <b>{name}</b>
          {username && <span className="muted">@{username}</span>}
          <span className="muted">{me?.phone || 'Telefon raqam kiritilmagan'}</span>
        </div>
      </section>

      <h2 className="section-title with-icon">
        <ReceiptIcon size={20} /> Mening buyurtmalarim
      </h2>

      {orders === null && (
        <div className="orders">
          {[0, 1].map((i) => (
            <div className="order-card skeleton" key={i} style={{ height: 150 }} />
          ))}
        </div>
      )}

      {orders !== null && orders.length === 0 && (
        <EmptyState
          small
          icon={ReceiptIcon}
          title={error ? 'Tarix yuklanmadi' : "Hozircha buyurtmalar yo'q"}
          text={error || "Birinchi buyurtmangizdan so'ng u shu yerda chiqadi va uni bir bosishda takrorlay olasiz."}
        />
      )}

      {orders !== null && orders.length > 0 && (
        <div className="orders">
          {orders.map((order) => {
            const status = STATUS[order.status] || STATUS.KUTILMOQDA;
            return (
              <article className="order-card" key={order.id}>
                <div className="order-top">
                  <div>
                    <b>Buyurtma #{order.id}</b>
                    <small className="muted">{formatDate(order.createdAt)}</small>
                  </div>
                  <span className={`status ${status.className}`}>{status.label}</span>
                </div>
                <ul className="order-items">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      <span>
                        {item.quantity} × {item.name}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="order-bottom">
                  <span>
                    Jami: <b>{formatPrice(order.totalPrice)}</b>
                  </span>
                  <button className="btn btn-soft btn-sm" onClick={() => onReorder(order)}>
                    <RepeatIcon size={16} /> Yana shundan buyurtma qilish
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
