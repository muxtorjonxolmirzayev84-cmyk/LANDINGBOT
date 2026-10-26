import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';
import { local } from '../lib/storage.js';

const SEEN_KEY = 'seen_stories_v1';
const DURATION = 5000;

export function getSeenStories() {
  return local.getJSON(SEEN_KEY, []);
}

function markSeen(id) {
  const seen = getSeenStories();
  if (!seen.includes(id)) local.setJSON(SEEN_KEY, [...seen, id]);
}

function StoryThumb({ story }) {
  return <img src={story.image} alt="" />;
}

export function StoriesRow({ stories, onOpen, seenVersion }) {
  const seen = getSeenStories();
  return (
    <div className="stories" data-v={seenVersion}>
      {stories.map((story, index) => (
        <button key={story.id} className="story" onClick={() => onOpen(index)}>
          <span className={`story-ring ${seen.includes(story.id) ? 'seen' : ''}`}>
            <span className="story-inner">
              <StoryThumb story={story} />
            </span>
          </span>
          <span className="story-label">{story.title}</span>
        </button>
      ))}
    </div>
  );
}

export function StoryViewer({ stories, index, onIndex, onClose, onCta }) {
  const story = stories[index];
  const [paused, setPaused] = useState(false);
  const pressStart = useRef(0);

  useEffect(() => {
    if (story) markSeen(story.id);
  }, [story]);

  if (!story) return null;

  const next = () => (index < stories.length - 1 ? onIndex(index + 1) : onClose());
  const prev = () => (index > 0 ? onIndex(index - 1) : null);

  const pressHandlers = (action) => ({
    onPointerDown: () => {
      pressStart.current = Date.now();
      setPaused(true);
    },
    onPointerUp: () => {
      setPaused(false);
      if (Date.now() - pressStart.current < 250) action();
    },
    onPointerLeave: () => setPaused(false),
  });

  return (
    <div className="story-viewer" style={{ background: story.background }}>
      <div className="story-bars">
        {stories.map((s, i) => (
          <div className="story-bar" key={s.id}>
            <div
              className={`story-bar-fill ${i < index ? 'done' : ''} ${i === index ? 'active' : ''}`}
              style={i === index ? { animationDuration: `${DURATION}ms`, animationPlayState: paused ? 'paused' : 'running' } : undefined}
              onAnimationEnd={i === index ? next : undefined}
            />
          </div>
        ))}
      </div>

      <div className="story-header">
        <span className="story-mini">
          <StoryThumb story={story} />
        </span>
        <span className="story-name">{story.title}</span>
        <button className="story-close" onClick={onClose} aria-label="Yopish">
          <CloseIcon size={24} />
        </button>
      </div>

      <div className="story-tap story-tap-left" {...pressHandlers(prev)} />
      <div className="story-tap story-tap-right" {...pressHandlers(next)} />

      <div className="story-content" key={story.id}>
        <div className="story-visual">
          <img src={story.image} alt="" />
        </div>
        <h2>{story.headline}</h2>
        <p>{story.text}</p>
        {story.cta && (
          <button className="btn btn-white" onClick={onCta}>
            {story.cta}
          </button>
        )}
      </div>
    </div>
  );
}
