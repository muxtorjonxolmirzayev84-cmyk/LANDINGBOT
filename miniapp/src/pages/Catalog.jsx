import { useMemo } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { AlertIcon, PizzaIcon } from '../components/Icons.jsx';

const ALL = 'Barchasi';

export default function Catalog({ products, status, onRetry, category, onCategory, onOpen, onQuickAdd }) {
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );
  const active = categories.includes(category) ? category : ALL;
  const list = active === ALL ? products : products.filter((p) => p.category === active);

  return (
    <div className="catalog">
      <header className="page-header">
        <h1>Katalog</h1>
      </header>

      <div className="chips" role="tablist" aria-label="Kategoriyalar">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={c === active}
            className={`chip ${c === active ? 'active' : ''}`}
            onClick={() => onCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="grid" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <div className="card skeleton" key={i} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <EmptyState
          icon={AlertIcon}
          title="Menyu yuklanmadi"
          text="Internet yoki server bilan aloqa uzildi. Qayta urinib ko'ring."
          action={
            <button className="btn btn-dark" onClick={onRetry}>
              Qayta yuklash
            </button>
          }
        />
      )}

      {status === 'ready' && list.length === 0 && (
        <EmptyState icon={PizzaIcon} title="Bu bo'limda hozircha pizza yo'q" text="Boshqa kategoriyani tanlang yoki keyinroq kiring." />
      )}

      {status === 'ready' && list.length > 0 && (
        <div className="grid">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} onQuickAdd={onQuickAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
