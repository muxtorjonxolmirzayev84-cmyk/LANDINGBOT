import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { adminApi } from '../lib/api.js';
import { beep, formatDate, formatPrice, formatTime, isToday } from '../lib/format.js';
import { CheckIcon, PinIcon, RefreshIcon, RepeatIcon, OrdersIcon } from '../components/Icons.jsx';

const POLL_MS = 5000;

const FILTERS = [
  { id: 'ALL', label: 'Barchasi' },
  { id: 'KUTILMOQDA', label: 'Kutilmoqda' },
  { id: 'YETKAZILDI', label: 'Yetkazildi' },
];

const STATUS = {
  KUTILMOQDA: { label: 'Kutilmoqda', className: 'badge-pending' },
  YETKAZILDI: { label: 'Yetkazildi', className: 'badge-done' },
};

export default function Orders({ onPendingChange }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [updatedAt, setUpdatedAt] = useState(null);
  const [fresh, setFresh] = useState(() => new Set());
  const [busyId, setBusyId] = useState(null);
  const lastMaxId = useRef(null);

  const load = useCallback(async () => {
    try {
      const { orders: list } = await adminApi.orders();
      const maxId = list.reduce((m, o) => Math.max(m, o.id), 0);
      if (lastMaxId.current !== null && maxId > lastMaxId.current) {
        const ids = list.filter((o) => o.id > lastMaxId.current).map((o) => o.id);
        setFresh(new Set(ids));
        beep();
        setTimeout(() => setFresh(new Set()), 10000);
      }
      lastMaxId.current = maxId;
      setOrders(list);
      setError('');
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  const stats = useMemo(() => {
    const today = orders.filter((o) => isToday(o.createdAt));
    return {
      todayCount: today.length,
      todayRevenue: today.reduce((s, o) => s + o.totalPrice, 0),
      pending: orders.filter((o) => o.status === 'KUTILMOQDA').length,
      total: orders.length,
    };
  }, [orders]);

  useEffect(() => {
    onPendingChange?.(stats.pending);
  }, [stats.pending, onPendingChange]);

  const visible = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  const setStatus = async (order, status) => {
    setBusyId(order.id);
    try {
      const { order: updated } = await adminApi.setOrderStatus(order.id, status);
      setOrders((list) => list.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Buyurtmalar</h1>
          <p className="muted">
            {updatedAt ? `Har 5 soniyada yangilanadi · oxirgisi ${formatTime(updatedAt)}:${String(updatedAt.getSeconds()).padStart(2, '0')}` : 'Yuklanmoqda...'}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={load}>
          <RefreshIcon size={17} /> Yangilash
        </button>
      </header>

      <section className="stats" aria-label="Qisqa statistika">
        <div className="stat">
          <span>Bugungi buyurtmalar</span>
          <b>{stats.todayCount}</b>
        </div>
        <div className="stat">
          <span>Kutilmoqda</span>
          <b className={stats.pending ? 'text-pending' : ''}>{stats.pending}</b>
        </div>
        <div className="stat">
          <span>Bugungi tushum</span>
          <b>{formatPrice(stats.todayRevenue)}</b>
        </div>
        <div className="stat">
          <span>Jami buyurtmalar</span>
          <b>{stats.total}</b>
        </div>
      </section>

      <div className="toolbar">
        <div className="tabs" role="tablist" aria-label="Holat bo'yicha">
          {FILTERS.map((f) => (
            <button key={f.id} role="tab" aria-selected={filter === f.id} className={`tab ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label}
              {f.id === 'KUTILMOQDA' && stats.pending > 0 && <span className="tab-count">{stats.pending}</span>}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th className="col-id">№</th>
              <th className="col-customer">Mijoz</th>
              <th className="col-items">Buyurtma</th>
              <th className="num">Jami</th>
              <th>Manzil</th>
              <th>Vaqt</th>
              <th className="col-status">Holat</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              [0, 1, 2].map((i) => (
                <tr key={i} className="row-skeleton">
                  <td colSpan={7}>
                    <span className="skeleton-line" />
                  </td>
                </tr>
              ))}

            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="table-empty">
                    <OrdersIcon size={26} />
                    <b>{filter === 'ALL' ? "Hali buyurtmalar yo'q" : "Bu holatda buyurtma yo'q"}</b>
                    <span className="muted">
                      {filter === 'ALL'
                        ? "Mijoz Mini App'da buyurtma berishi bilan u shu jadvalda paydo bo'ladi va qisqa signal chalinadi."
                        : 'Boshqa holatni tanlang.'}
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              visible.map((o) => {
                const status = STATUS[o.status] || STATUS.KUTILMOQDA;
                const hasCoords = o.latitude != null && o.longitude != null;
                return (
                  <tr key={o.id} className={fresh.has(o.id) ? 'row-fresh' : ''}>
                    <td className="col-id">#{o.id}</td>
                    <td className="col-customer">
                      <div className="cell-strong">{o.user?.name || 'Mijoz'}</div>
                      <a className="link tnum phone" href={`tel:${o.phone}`}>
                        {o.phone}
                      </a>
                      {o.user?.username && (
                        <a className="cell-sub link" href={`https://t.me/${o.user.username}`} target="_blank" rel="noreferrer">
                          @{o.user.username}
                        </a>
                      )}
                    </td>
                    <td className="col-items">
                      <ul className="items">
                        {o.items.map((i, idx) => (
                          <li key={idx}>
                            <span className="qty">{i.quantity}×</span> {i.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="num cell-strong nowrap">{formatPrice(o.totalPrice)}</td>
                    <td className="col-address">
                      <div>{o.location}</div>
                      {hasCoords && (
                        <a className="cell-sub link inline-icon" href={`https://yandex.uz/maps/?pt=${o.longitude},${o.latitude}&z=17&l=map`} target="_blank" rel="noreferrer">
                          <PinIcon size={14} /> Xaritada ochish
                        </a>
                      )}
                      {o.comment && <div className="cell-sub">Izoh: {o.comment}</div>}
                    </td>
                    <td className="nowrap tnum">
                      <div>{formatTime(o.createdAt)}</div>
                      <div className="cell-sub">{formatDate(o.createdAt)}</div>
                    </td>
                    <td className="col-status">
                      <div className="status-cell">
                        <span className={`badge ${status.className}`}>{status.label}</span>
                        {o.status === 'KUTILMOQDA' ? (
                          <button className="btn btn-sm btn-ghost" disabled={busyId === o.id} onClick={() => setStatus(o, 'YETKAZILDI')}>
                            <CheckIcon size={15} /> Yetkazildi deb belgilash
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-ghost" disabled={busyId === o.id} onClick={() => setStatus(o, 'KUTILMOQDA')}>
                            <RepeatIcon size={14} /> Qaytarish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
