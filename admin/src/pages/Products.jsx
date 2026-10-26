import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductEditor from '../components/ProductEditor.jsx';
import { adminApi } from '../lib/api.js';
import { formatPrice } from '../lib/format.js';
import { EditIcon, PlusIcon, TrashIcon, PizzaIcon } from '../components/Icons.jsx';

const FALLBACK = '/images/pizza-default.svg';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [confirmId, setConfirmId] = useState(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      const { products: list } = await adminApi.products();
      setProducts(list);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category).filter(Boolean))], [products]);

  const remove = async (product) => {
    try {
      await adminApi.deleteProduct(product.id);
      setConfirmId(null);
      if (editing && editing !== 'new' && editing.id === product.id) setEditing(null);
      setNotice(`«${product.name}» o'chirildi`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`page products-page ${editing ? 'with-editor' : ''}`}>
      <div className="products-main">
        <header className="page-head">
          <div>
            <h1>Mahsulotlar</h1>
            <p className="muted">{products.length} ta pizza menyuda</p>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing('new')}>
            <PlusIcon size={17} /> Yangi pizza
          </button>
        </header>

        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}
        {notice && (
          <div className="notice" role="status">
            {notice}
          </div>
        )}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th className="col-thumb">Rasm</th>
                <th>Nomi</th>
                <th>Kategoriya</th>
                <th className="num">Eski narx</th>
                <th className="num">Yangi narx</th>
                <th className="col-actions">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                [0, 1, 2].map((i) => (
                  <tr key={i} className="row-skeleton">
                    <td colSpan={6}>
                      <span className="skeleton-line" />
                    </td>
                  </tr>
                ))}

              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="table-empty">
                      <PizzaIcon size={26} />
                      <b>Menyu bo'sh</b>
                      <span className="muted">«Yangi pizza» tugmasini bosib birinchi mahsulotni qo'shing. U darhol Mini App'da chiqadi.</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                products.map((p) => (
                  <tr key={p.id} className={editing && editing !== 'new' && editing.id === p.id ? 'row-selected' : ''}>
                    <td className="col-thumb">
                      <img
                        className="thumb"
                        src={p.imageUrl || FALLBACK}
                        alt=""
                        onError={(e) => {
                          if (!e.currentTarget.src.endsWith(FALLBACK)) e.currentTarget.src = FALLBACK;
                        }}
                      />
                    </td>
                    <td>
                      <div className="cell-strong">{p.name}</div>
                      {p.description && <div className="cell-sub clamp">{p.description}</div>}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{p.category}</span>
                    </td>
                    <td className="num nowrap muted">{p.oldPrice ? <s>{formatPrice(p.oldPrice)}</s> : '—'}</td>
                    <td className="num nowrap price">{formatPrice(p.newPrice)}</td>
                    <td className="col-actions">
                      {confirmId === p.id ? (
                        <div className="confirm" role="group" aria-label={`${p.name}ni o'chirishni tasdiqlash`}>
                          <span>O'chirilsinmi?</span>
                          <div className="confirm-buttons">
                            <button className="btn btn-sm btn-danger" onClick={() => remove(p)}>
                              Ha, o'chirish
                            </button>
                            <button className="btn btn-sm btn-ghost" onClick={() => setConfirmId(null)} autoFocus>
                              Yo'q
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="row-actions">
                          <button className="btn btn-sm btn-ghost" onClick={() => setEditing(p)} title="Tahrirlash">
                            <EditIcon size={15} /> <span className="btn-label">Tahrirlash</span>
                          </button>
                          <button className="btn btn-sm btn-ghost danger" onClick={() => setConfirmId(p.id)} aria-label={`${p.name}ni o'chirish`} title="O'chirish">
                            <TrashIcon size={15} /> <span className="btn-label">O'chirish</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProductEditor
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? null : editing}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            setEditing(null);
            setNotice(isNew ? `«${saved.name}» menyuga qo'shildi` : `«${saved.name}» saqlandi`);
            load();
          }}
        />
      )}
    </div>
  );
}
