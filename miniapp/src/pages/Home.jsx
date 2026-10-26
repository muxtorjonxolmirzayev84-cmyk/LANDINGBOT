import { ArrowRightIcon } from '../components/Icons.jsx';
import { StoriesRow } from '../components/Stories.jsx';
import { STORIES, HERO_PHOTO } from '../data/content.js';
import { getTgUser } from '../lib/telegram.js';
import { formatPrice, onImageError } from '../lib/format.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Xayrli tun';
  if (h < 12) return 'Xayrli tong';
  if (h < 18) return 'Xayrli kun';
  return 'Xayrli kech';
}

export default function Home({ me, products, onOpenCatalog, onOpenProduct, onOpenStory, seenVersion }) {
  const tgUser = getTgUser();
  const firstName = tgUser?.first_name || me?.name?.split(' ')[0] || 'mehmon';
  const popular = products.slice(0, 6);

  return (
    <div className="home">
      <header className="home-header">
        <div>
          <h1 className="home-name">
            {greeting()}, {firstName}
          </h1>
          <p className="home-sub">Xush kelibsiz! Bugun qaysi pizzani tatib ko'ramiz?</p>
        </div>
        <div className="home-avatar" aria-hidden="true">
          {tgUser?.photo_url ? <img src={tgUser.photo_url} alt="" /> : <span>{firstName.charAt(0).toUpperCase()}</span>}
        </div>
      </header>

      <StoriesRow stories={STORIES} onOpen={onOpenStory} seenVersion={seenVersion} />

      <section className="hero">
        <div className="hero-text">
          <h2>Yangi buyurtma berish</h2>
          <p>Sevimli pizzangizni tanlang, qolganini biz hal qilamiz.</p>
          <button className="btn btn-white" onClick={onOpenCatalog}>
            Menyuni ochish <ArrowRightIcon size={18} />
          </button>
        </div>
        <img className="hero-pizza" src={HERO_PHOTO} alt="" />
      </section>

      {popular.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Ommabop</h2>
            <button className="link-btn" onClick={onOpenCatalog}>
              Barchasi
            </button>
          </div>
          <div className="mini-list">
            {popular.map((p) => (
              <button className="mini-card" key={p.id} onClick={() => onOpenProduct(p)}>
                <span className="mini-media">
                  <img src={p.imageUrl} alt="" loading="lazy" onError={onImageError} />
                </span>
                <b>{p.name}</b>
                <span className="price-new">{formatPrice(p.newPrice)}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
