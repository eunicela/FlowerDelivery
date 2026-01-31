import { useStore } from '../lib/store';
import Image from 'next/image';

export default function BouquetDisplay() {
  const { flowerColor } = useStore();

  const bouquetImages = {
    red: '/bouquet-red.png',
    pink: '/bouquet-pink.png',
    white: '/bouquet-white.png',
  };

  return (
    <div className="relative" style={{ transform: 'rotate(8deg)' }}>
      <Image
        src={bouquetImages[flowerColor]}
        alt={`${flowerColor} rose bouquet`}
        width={600}
        height={750}
        className="drop-shadow-2xl"
        priority
      />
      {/* Price tag */}
      <div className="absolute bottom-32 right-0 price-tag">
        <span className="font-cursive text-3xl text-white drop-shadow-lg">$80</span>
      </div>
    </div>
  );
}
