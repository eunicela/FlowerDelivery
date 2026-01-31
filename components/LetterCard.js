import { useStore } from '../lib/store';

export default function LetterCard({ card, showRemove = false, isActive = true }) {
  const { updateCard, removeCard } = useStore();

  const handleChange = (field, value) => {
    updateCard(card.id, { [field]: value });
  };

  return (
    <div
      className={`card p-6 relative max-w-sm transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}
      style={{ aspectRatio: '5.5 / 4.5' }}
    >
      {showRemove && (
        <button
          onClick={() => removeCard(card.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-deep-red text-white text-sm hover:bg-red-800 transition-colors"
          aria-label="Remove card"
        >
          &times;
        </button>
      )}

      {/* Dear ___ */}
      <div className="mb-4">
        <span className="font-cursive text-2xl text-card-text">Dear </span>
        <input
          type="text"
          value={card.recipientName}
          onChange={(e) => handleChange('recipientName', e.target.value)}
          className="font-cursive text-2xl text-card-text bg-transparent border-b border-gray-300 focus:border-deep-red outline-none w-32"
        />
        <span className="font-cursive text-2xl text-card-text">,</span>
      </div>

      {/* Message body */}
      <textarea
        value={card.message}
        onChange={(e) => handleChange('message', e.target.value)}
        className="font-cursive text-lg text-card-text bg-transparent w-full h-20 resize-none outline-none leading-relaxed"
        style={{ fontStyle: 'italic' }}
      />

      {/* from, ___ */}
      <div className="mt-4 text-right">
        <span className="font-cursive text-xl text-card-text italic">from, </span>
        <input
          type="text"
          value={card.senderName}
          onChange={(e) => handleChange('senderName', e.target.value)}
          className="font-cursive text-xl text-card-text italic bg-transparent border-b border-gray-300 focus:border-deep-red outline-none w-24 text-right"
        />
      </div>
    </div>
  );
}
