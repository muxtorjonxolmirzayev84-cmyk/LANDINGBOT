import { useRef, useState } from 'react';
import { adminApi } from '../lib/api.js';
import { CloseIcon, UploadIcon } from './Icons.jsx';

const FALLBACK = '/images/pizza-default.svg';

function toForm(p) {
  return {
    name: p?.name || '',
    description: p?.description || '',
    ingredients: (p?.ingredients || []).join(', '),
    category: p?.category || '',
    oldPrice: p?.oldPrice ? String(p.oldPrice) : '',
    newPrice: p?.newPrice ? String(p.newPrice) : '',
    imageUrl: p?.imageUrl || '',
  };
}

export default function ProductEditor({ product, categories, onCancel, onSaved }) {
  const isNew = !product;
  const [form, setForm] = useState(() => toForm(product));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState('');
  const fileRef = useRef(null);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: null }));
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setServerError('');
    try {
      const { url } = await adminApi.upload(file);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setServerError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nomini kiriting';
    const newPrice = Number(form.newPrice.replace(/\s/g, ''));
    if (!newPrice || newPrice <= 0) errs.newPrice = "Narxni so'mda kiriting, masalan 65000";
    const oldPrice = form.oldPrice ? Number(form.oldPrice.replace(/\s/g, '')) : null;
    if (form.oldPrice && (!oldPrice || oldPrice < 0)) errs.oldPrice = "Eski narx raqam bo'lishi kerak";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setServerError('');
    const payload = { ...form, newPrice, oldPrice };
    try {
      const { product: saved } = isNew ? await adminApi.createProduct(payload) : await adminApi.updateProduct(product.id, payload);
      onSaved(saved, isNew);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="editor" aria-label={isNew ? 'Yangi pizza' : 'Pizzani tahrirlash'}>
      <form onSubmit={submit} noValidate>
        <header className="editor-head">
          <h2>{isNew ? 'Yangi pizza' : form.name || 'Tahrirlash'}</h2>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Yopish">
            <CloseIcon size={18} />
          </button>
        </header>

        <div className="editor-body">
          <div className="image-field">
            <img
              src={form.imageUrl || FALLBACK}
              alt=""
              onError={(e) => {
                if (!e.currentTarget.src.endsWith(FALLBACK)) e.currentTarget.src = FALLBACK;
              }}
            />
            <div className="image-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <UploadIcon size={15} /> {uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}
              </button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={onFile} />
              <small className="muted">JPG, PNG yoki WEBP, 5 MB gacha</small>
            </div>
          </div>

          <label className="field">
            <span>Rasm manzili (URL)</span>
            <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://... yoki yuqoridan yuklang" />
          </label>

          <label className={`field ${errors.name ? 'has-error' : ''}`}>
            <span>Nomi</span>
            <input value={form.name} onChange={set('name')} placeholder="Masalan: Margarita" maxLength={100} />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>

          <label className="field">
            <span>Kategoriya</span>
            <input value={form.category} onChange={set('category')} list="category-list" placeholder="Klassik, Go'shtli, Milliy..." maxLength={50} />
            <datalist id="category-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <div className="field-pair">
            <label className={`field ${errors.oldPrice ? 'has-error' : ''}`}>
              <span>Eski narx (ixtiyoriy)</span>
              <input value={form.oldPrice} onChange={set('oldPrice')} inputMode="numeric" placeholder="75000" />
              {errors.oldPrice && <small className="field-error">{errors.oldPrice}</small>}
            </label>
            <label className={`field ${errors.newPrice ? 'has-error' : ''}`}>
              <span>Yangi narx</span>
              <input value={form.newPrice} onChange={set('newPrice')} inputMode="numeric" placeholder="59000" />
              {errors.newPrice && <small className="field-error">{errors.newPrice}</small>}
            </label>
          </div>

          <label className="field">
            <span>Ta'rifi</span>
            <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Qisqa ta'rif: mijoz pizzani ochganda ko'radi" maxLength={1000} />
          </label>

          <label className="field">
            <span>Tarkibi</span>
            <textarea rows={2} value={form.ingredients} onChange={set('ingredients')} placeholder="Pomidor sousi, Mozzarella, Rayhon" />
            <small className="muted">Vergul bilan ajrating. Mini App'da ro'yxat bo'lib chiqadi.</small>
          </label>

          {serverError && (
            <div className="alert" role="alert">
              {serverError}
            </div>
          )}
        </div>

        <footer className="editor-foot">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Bekor qilish
          </button>
          <button className="btn btn-primary" disabled={saving || uploading}>
            {saving ? 'Saqlanmoqda...' : isNew ? "Menyuga qo'shish" : 'Saqlash'}
          </button>
        </footer>
      </form>
    </aside>
  );
}
