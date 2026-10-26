import { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Orders from './pages/Orders.jsx';
import Products from './pages/Products.jsx';
import { OrdersIcon, PizzaIcon, LogoutIcon } from './components/Icons.jsx';
import { clearToken, getToken, saveToken, setUnauthorizedHandler } from './lib/api.js';
import { LOGO } from './lib/format.js';

const PAGES = [
  { id: 'orders', label: 'Buyurtmalar', Icon: OrdersIcon },
  { id: 'products', label: 'Mahsulotlar', Icon: PizzaIcon },
];

const pageFromHash = () => (window.location.hash === '#products' ? 'products' : 'orders');

export default function App() {
  const [token, setToken] = useState(() => getToken());
  const [page, setPage] = useState(pageFromHash);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    setUnauthorizedHandler(() => setToken(null));
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = pending > 0 ? `(${pending}) Buyurtmalar · XMR Pizza` : 'XMR Pizza · Admin';
  }, [pending]);

  if (!token) {
    return (
      <Login
        onLogin={(t) => {
          saveToken(t);
          setToken(t);
        }}
      />
    );
  }

  const go = (id) => {
    window.location.hash = id;
    setPage(id);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <img src={LOGO} alt="" />
          <span>
            XMR Pizza
            <small>Admin panel</small>
          </span>
        </div>
        <nav className="side-nav">
          {PAGES.map(({ id, label, Icon }) => (
            <button key={id} className={`side-link ${page === id ? 'active' : ''}`} onClick={() => go(id)} aria-current={page === id ? 'page' : undefined}>
              <Icon size={19} />
              <span>{label}</span>
              {id === 'orders' && pending > 0 && <span className="side-count">{pending}</span>}
            </button>
          ))}
        </nav>
        <button
          className="side-link logout"
          onClick={() => {
            clearToken();
            setToken(null);
          }}
        >
          <LogoutIcon size={19} />
          <span>Chiqish</span>
        </button>
      </aside>

      <main className="main">{page === 'orders' ? <Orders onPendingChange={setPending} /> : <Products />}</main>
    </div>
  );
}
