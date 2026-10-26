import { HomeIcon, PizzaIcon, CartIcon, UserIcon } from './Icons.jsx';
import { haptic } from '../lib/telegram.js';

const TABS = [
  { id: 'home', label: 'Bosh sahifa', Icon: HomeIcon },
  { id: 'catalog', label: 'Katalog', Icon: PizzaIcon },
  { id: 'cart', label: 'Savatcha', Icon: CartIcon },
  { id: 'profile', label: 'Profil', Icon: UserIcon },
];

export default function BottomNav({ tab, onChange, cartCount }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${tab === id ? 'active' : ''}`}
          onClick={() => {
            if (tab !== id) haptic('light');
            onChange(id);
          }}
        >
          <span className="nav-icon">
            <Icon size={23} strokeWidth={tab === id ? 2.3 : 1.9} />
            {id === 'cart' && cartCount > 0 && (
              <span className="nav-badge" key={cartCount}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
