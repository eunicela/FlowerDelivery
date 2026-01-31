const statuses = [
  { id: 'pending', label: 'Pending' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'delivered', label: 'Delivered' },
];

export default function StatusTracker({ currentStatus }) {
  const currentIndex = statuses.findIndex((s) => s.id === currentStatus);

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      {statuses.map((status, index) => (
        <div key={status.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                index <= currentIndex
                  ? 'bg-deep-red text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentIndex ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`font-cursive text-sm mt-1 ${
                index <= currentIndex ? 'text-deep-red' : 'text-gray-500'
              }`}
            >
              {status.label}
            </span>
          </div>
          {index < statuses.length - 1 && (
            <div
              className={`w-12 h-1 mx-2 ${
                index < currentIndex ? 'bg-deep-red' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
