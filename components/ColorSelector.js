import { useStore } from '../lib/store';

const colors = [
  { id: 'red', color: '#722F37', label: 'Deep Red' },
  { id: 'pink', color: '#F4C2C2', label: 'Soft Pink' },
  { id: 'white', color: '#FFFEF9', label: 'Cream White' },
];

export default function ColorSelector() {
  const { flowerColor, setFlowerColor } = useStore();

  return (
    <div className="flex flex-col gap-3">
      {colors.map((c) => (
        <button
          key={c.id}
          onClick={() => setFlowerColor(c.id)}
          className={`color-dot ${flowerColor === c.id ? 'selected' : ''}`}
          style={{ backgroundColor: c.color }}
          aria-label={`Select ${c.label} roses`}
          title={c.label}
        />
      ))}
    </div>
  );
}
