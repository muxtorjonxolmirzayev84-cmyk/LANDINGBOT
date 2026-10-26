import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { local } from '../lib/storage.js';

const STORAGE_KEY = 'pizza_cart_v1';
const CartContext = createContext(null);

const initialState = { items: [], upsell: false };

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { product, qty } = action;
      const exists = state.items.find((i) => i.productId === product.id);
      const items = exists
        ? state.items.map((i) => (i.productId === product.id ? { ...i, quantity: Math.min(50, i.quantity + qty) } : i))
        : [
            ...state.items,
            {
              productId: product.id,
              name: product.name,
              price: product.newPrice,
              oldPrice: product.oldPrice,
              imageUrl: product.imageUrl,
              quantity: Math.min(50, qty),
            },
          ];
      return { ...state, items };
    }
    case 'setQty': {
      const items =
        action.qty <= 0
          ? state.items.filter((i) => i.productId !== action.productId)
          : state.items.map((i) => (i.productId === action.productId ? { ...i, quantity: Math.min(50, action.qty) } : i));
      return { ...state, items };
    }
    case 'setUpsell':
      return { ...state, upsell: action.value };
    case 'sync': {
      // Narx va nomlarni bazadagi oxirgi holatga moslash
      const byId = new Map(action.products.map((p) => [p.id, p]));
      const items = state.items
        .filter((i) => byId.has(i.productId))
        .map((i) => {
          const p = byId.get(i.productId);
          return { ...i, name: p.name, price: p.newPrice, oldPrice: p.oldPrice, imageUrl: p.imageUrl };
        });
      return { ...state, items };
    }
    case 'clear':
      return { ...initialState };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const saved = local.getJSON(STORAGE_KEY, null);
    return saved && Array.isArray(saved.items) ? { items: saved.items, upsell: Boolean(saved.upsell) } : initialState;
  });

  useEffect(() => {
    local.setJSON(STORAGE_KEY, state);
  }, [state]);

  const actions = useMemo(
    () => ({
      add: (product, qty = 1) => dispatch({ type: 'add', product, qty }),
      setQty: (productId, qty) => dispatch({ type: 'setQty', productId, qty }),
      setUpsell: (value) => dispatch({ type: 'setUpsell', value }),
      sync: (products) => dispatch({ type: 'sync', products }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    []
  );

  const value = useMemo(() => {
    const count = state.items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
    return { ...state, ...actions, count, subtotal };
  }, [state, actions]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
