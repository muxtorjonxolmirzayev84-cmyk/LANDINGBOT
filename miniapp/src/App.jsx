import { useCallback, useEffect, useRef, useState } from 'react';
import BottomNav from './components/BottomNav.jsx';
import ProductSheet from './components/ProductSheet.jsx';
import { StoryViewer } from './components/Stories.jsx';
import Toast from './components/Toast.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Cart from './pages/Cart.jsx';
import Profile from './pages/Profile.jsx';
import { useCart } from './context/CartContext.jsx';
import { STORIES } from './data/content.js';
import { api } from './lib/api.js';
import { cloudGet, cloudSet } from './lib/storage.js';
import { bindBackButton, haptic } from './lib/telegram.js';

const ONBOARDING_KEY = 'onboarding_done_v1';

export default function App() {
  const cart = useCart();
  const { sync } = cart;

  const [boot, setBoot] = useState('loading'); // loading | onboarding | app
  const [tab, setTab] = useState('home');
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [upsell, setUpsell] = useState(null);
  const [me, setMe] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [story, setStory] = useState(null);
  const [seenVersion, setSeenVersion] = useState(0);
  const [category, setCategory] = useState('Barchasi');
  const [ordersKey, setOrdersKey] = useState(0);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((text, type = 'info') => {
    clearTimeout(toastTimer.current);
    setToast({ text, type, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  // Onboarding faqat bir marta
  useEffect(() => {
    cloudGet(ONBOARDING_KEY).then((v) => setBoot(v === '1' ? 'app' : 'onboarding'));
  }, []);

  const loadProducts = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await api.products();
      setProducts(data.products);
      sync(data.products);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [sync]);

  useEffect(() => {
    loadProducts();
    api.config().then((d) => setUpsell(d.upsell)).catch(() => {});
    api.me().then((d) => setMe(d.user)).catch(() => {});
  }, [loadProducts]);

  // Telegram "Orqaga" tugmasi
  useEffect(() => {
    const visible = boot === 'app' && (story !== null || sheet !== null || tab !== 'home');
    const handler = () => {
      if (story !== null) setStory(null);
      else if (sheet !== null) setSheet(null);
      else setTab('home');
    };
    return bindBackButton(visible, handler);
  }, [boot, story, sheet, tab]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setToast(null);
  }, [tab]);

  useEffect(() => {
    if (sheet) setToast(null);
  }, [sheet]);

  // Katalogdagi "+" — javob kartaning o'zida (stepper + savatcha belgisi)
  const quickAdd = (product) => {
    cart.add(product, 1);
    haptic('medium');
  };

  const addFromSheet = (product, qty = 1) => {
    cart.add(product, qty);
    haptic('medium');
    showToast(`${product.name} savatchaga qo'shildi`);
  };

  const reorder = (order) => {
    let added = 0;
    let missing = 0;
    for (const item of order.items) {
      if (item.isUpsell) {
        cart.setUpsell(true);
        continue;
      }
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        cart.add(product, item.quantity);
        added += 1;
      } else {
        missing += 1;
      }
    }
    if (!added) {
      showToast('Bu mahsulotlar endi mavjud emas', 'error');
      return;
    }
    haptic('medium');
    setTab('cart');
    showToast(missing ? "Ba'zi mahsulotlar endi mavjud emas" : "Buyurtma savatchaga qo'shildi");
  };

  if (boot === 'loading') {
    return (
      <div className="splash">
        <div className="spinner" />
      </div>
    );
  }

  if (boot === 'onboarding') {
    return (
      <Onboarding
        onDone={() => {
          cloudSet(ONBOARDING_KEY, '1');
          setBoot('app');
        }}
      />
    );
  }

  return (
    <div className="app">
      <main className="page" key={tab}>
        {tab === 'home' && (
          <Home
            me={me}
            products={products}
            onOpenCatalog={() => setTab('catalog')}
            onOpenProduct={setSheet}
            onOpenStory={setStory}
            seenVersion={seenVersion}
          />
        )}
        {tab === 'catalog' && (
          <Catalog
            products={products}
            status={status}
            onRetry={loadProducts}
            category={category}
            onCategory={setCategory}
            onOpen={setSheet}
            onQuickAdd={quickAdd}
          />
        )}
        {tab === 'cart' && (
          <Cart
            me={me}
            upsell={upsell}
            onGoCatalog={() => setTab('catalog')}
            onOrderCreated={() => {
              setOrdersKey((k) => k + 1);
              api.me().then((d) => setMe(d.user)).catch(() => {});
            }}
            showToast={showToast}
          />
        )}
        {tab === 'profile' && <Profile me={me} onReorder={reorder} refreshKey={ordersKey} />}
      </main>

      <BottomNav tab={tab} onChange={setTab} cartCount={cart.count} />

      {sheet && <ProductSheet key={sheet.id} product={sheet} onClose={() => setSheet(null)} onAdd={addFromSheet} />}

      {story !== null && (
        <StoryViewer
          stories={STORIES}
          index={story}
          onIndex={setStory}
          onClose={() => {
            setStory(null);
            setSeenVersion((v) => v + 1);
          }}
          onCta={() => {
            setStory(null);
            setSeenVersion((v) => v + 1);
            setTab('catalog');
          }}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
