import { useStore } from '../lib/store';

export default function LetterCard({ card, showRemove = false, isLocked = true }) {
  const { updateCard, removeCard } = useStore();

  const handleChange = (field, value) => {
    updateCard(card.id, { [field]: value });
  };

  return (
    <div
      className="card p-6 relative w-full flex flex-col justify-between"
      style={{ aspectRatio: '6 / 4.5' }}
    >
      {/* Lock Icon */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      )}

      {showRemove && !isLocked && (
        <button
          onClick={() => removeCard(card.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-deep-red text-white text-sm hover:bg-red-800 transition-colors z-20"
          aria-label="Remove card"
        >
          &times;
        </button>
      )}

      {/* Top section - Dear ___ */}
      <div>
        <span className="font-cursive text-2xl text-card-text">Dear </span>
        <input
          type="text"
          value={card.recipientName}
          onChange={(e) => handleChange('recipientName', e.target.value)}
          disabled={isLocked}
          className="font-cursive text-2xl text-card-text bg-transparent border-b border-gray-300 focus:border-deep-red outline-none w-32 disabled:cursor-default"
        />
        <span className="font-cursive text-2xl text-card-text">,</span>

        {/* Message body */}
        <textarea
          value={card.message}
          onChange={(e) => handleChange('message', e.target.value)}
          disabled={isLocked}
          className="font-cursive text-lg text-card-text bg-transparent w-full h-16 resize-none outline-none leading-relaxed disabled:cursor-default mt-2"
          style={{ fontStyle: 'italic' }}
        />
      </div>

      {/* Bottom section - from, ___ */}
      <div className="text-right">
        <span className="font-cursive text-xl text-card-text italic">from, </span>
        <input
          type="text"
          value={card.senderName}
          onChange={(e) => handleChange('senderName', e.target.value)}
          disabled={isLocked}
          className="font-cursive text-xl text-card-text italic bg-transparent border-b border-gray-300 focus:border-deep-red outline-none w-24 text-right disabled:cursor-default"
        />
      </div>
    </div>
  );
}
