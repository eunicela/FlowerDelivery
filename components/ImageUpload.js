import { useRef, useState } from 'react';
import { useStore } from '../lib/store';
import Image from 'next/image';

export default function ImageUpload({ cardId, isLocked = true }) {
  const { cards, updateCard } = useStore();
  const card = cards.find((c) => c.id === cardId);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    if (isLocked) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create local preview URL
      const previewUrl = URL.createObjectURL(file);
      updateCard(cardId, { imageUrl: previewUrl, imageFile: file });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    if (card?.imageUrl) {
      URL.revokeObjectURL(card.imageUrl);
    }
    updateCard(cardId, { imageUrl: null, imageFile: null });
  };

  return (
    <div
      className="card p-4 relative w-full"
      style={{ aspectRatio: '6 / 4.5' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Inner bordered container */}
      <div className="w-full h-full border-2 border-gray-300 rounded-lg overflow-hidden">
        {card?.imageUrl ? (
          <div className="relative w-full h-full">
            <Image
              src={card.imageUrl}
              alt="Uploaded photo"
              fill
              className="object-cover"
            />
            {!isLocked && (
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-deep-red text-white text-sm hover:bg-red-800 transition-colors z-20"
                aria-label="Remove image"
              >
                &times;
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={handleClick}
            disabled={isUploading || isLocked}
            className="w-full h-full flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer disabled:cursor-default disabled:hover:bg-gray-50"
          >
            {!isLocked && (
              <>
                {isUploading ? (
                  <span className="font-cursive text-xl text-gray-500">Uploading...</span>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-gray-400 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-cursive text-xl text-gray-500">Click to upload photo</span>
                  </>
                )}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
