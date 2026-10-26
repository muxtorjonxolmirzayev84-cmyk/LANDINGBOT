import { MinusIcon, PlusIcon } from './Icons.jsx';
import { haptic } from '../lib/telegram.js';

export default function QtyStepper({ value, onChange, min = 1, max = 50, small = false }) {
  const change = (next) => {
    if (next < min || next > max) return;
    haptic('light');
    onChange(next);
  };
  return (
    <div className={`stepper ${small ? 'stepper-sm' : ''}`}>
      <button type="button" onClick={() => change(value - 1)} aria-label="Kamaytirish" disabled={value <= min && min > 0}>
        <MinusIcon size={small ? 16 : 18} />
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => change(value + 1)} aria-label="Ko'paytirish" disabled={value >= max}>
        <PlusIcon size={small ? 16 : 18} />
      </button>
    </div>
  );
}
