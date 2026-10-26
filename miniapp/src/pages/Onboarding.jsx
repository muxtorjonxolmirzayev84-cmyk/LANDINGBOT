import { useRef, useState } from 'react';
import { ONBOARDING, ONBOARDING_PHOTOS } from '../data/content.js';
import { haptic } from '../lib/telegram.js';

function VisualHungry() {
  return (
    <div className="onb-art onb-art-disc">
      <img className="onb-photo" src={ONBOARDING_PHOTOS[0]} alt="" />
    </div>
  );
}

function VisualChoose() {
  return (
    <div className="onb-art onb-art-disc">
      <img className="onb-photo" src={ONBOARDING_PHOTOS[1]} alt="" />
    </div>
  );
}

function VisualTable() {
  return (
    <div className="onb-art">
      <div className="onb-table">
        {ONBOARDING_PHOTOS[2].map((src, i) => (
          <img key={src} src={src} alt="" className={`t${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

const VISUALS = [VisualHungry, VisualChoose, VisualTable];

export default function Onboarding({ onDone }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const last = index === ONBOARDING.length - 1;

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    setIndex(i);
  };

  const finish = () => {
    haptic('medium');
    onDone();
  };

  return (
    <div className="onb">
      <div className="onb-top">
        <span className="brand">XMR Pizza</span>
        {!last && (
          <button className="link-btn" onClick={finish}>
            O'tkazib yuborish
          </button>
        )}
      </div>

      <div className="onb-track" ref={trackRef} onScroll={onScroll}>
        {ONBOARDING.map((slide, i) => {
          const Visual = VISUALS[i];
          return (
            <section className="onb-slide" key={slide.title} aria-hidden={i !== index}>
              <Visual />
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
            </section>
          );
        })}
      </div>

      <div className="onb-bottom">
        <div className="dots" role="tablist">
          {ONBOARDING.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`${i + 1}-slayd`}
            />
          ))}
        </div>
        <button className="btn btn-accent btn-block btn-xl" onClick={() => (last ? finish() : goTo(index + 1))}>
          {last ? 'Boshla' : 'Keyingi'}
        </button>
      </div>
    </div>
  );
}
