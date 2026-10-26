export default function EmptyState({ icon: Icon, title, text, action, small = false }) {
  return (
    <div className={`empty ${small ? 'small' : ''}`}>
      {Icon && (
        <span className="empty-icon">
          <Icon size={28} strokeWidth={1.8} />
        </span>
      )}
      {title && <h3>{title}</h3>}
      {text && <p className="muted">{text}</p>}
      {action}
    </div>
  );
}
