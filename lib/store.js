import { create } from 'zustand';

const BOUQUET_PRICE = 9500; // $95 in cents

// Singleton audio instance that persists across page navigations
let audioInstance = null;
const getAudioInstance = () => {
  if (typeof window !== 'undefined' && !audioInstance) {
    audioInstance = new Audio('/from-the-start.mp3');
    audioInstance.loop = true;
  }
  return audioInstance;
};
const CARD_PRICE = 500; // $5 in cents
const DELIVERY_FEE = 3000; // $30 in cents

export const useStore = create((set, get) => ({
  // Music player
  isMusicPlaying: false,
  toggleMusic: () => {
    const audio = getAudioInstance();
    if (!audio) return;

    const currentlyPlaying = get().isMusicPlaying;
    if (currentlyPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    set({ isMusicPlaying: !currentlyPlaying });
  },

  // Flower selection
  flowerColor: 'red',
  setFlowerColor: (color) => set({ flowerColor: color }),

  // Letter cards
  cards: [
    {
      id: 1,
      recipientName: '',
      message: '',
      senderName: '',
      imageUrl: null,
      imageFile: null,
      isIncluded: false,
    },
  ],

  addCard: () =>
    set((state) => ({
      cards: [
        ...state.cards,
        {
          id: Date.now(),
          recipientName: '',
          message: '',
          senderName: '',
          imageUrl: null,
          imageFile: null,
          isIncluded: false,
        },
      ],
    })),

  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
    })),

  toggleCardIncluded: (id) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, isIncluded: !card.isIncluded } : card
      ),
    })),

  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      ),
    })),

  // Customer info
  customerInfo: {
    name: '',
    email: '',
    phone: '',
  },
  setCustomerInfo: (info) =>
    set((state) => ({
      customerInfo: { ...state.customerInfo, ...info },
    })),

  // Delivery method (delivery or pickup)
  deliveryMethod: 'delivery',
  setDeliveryMethod: (method) => set({ deliveryMethod: method }),

  // Delivery info
  deliveryInfo: {
    street: '',
    city: '',
    state: '',
    zip: '',
    date: '',
  },
  setDeliveryInfo: (info) =>
    set((state) => ({
      deliveryInfo: { ...state.deliveryInfo, ...info },
    })),

  // Calculate total
  getTotal: () => {
    const state = get();
    const includedCards = state.cards.filter((card) => card.isIncluded);
    const cardTotal = includedCards.length * CARD_PRICE;
    const deliveryTotal = state.deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
    return BOUQUET_PRICE + cardTotal + deliveryTotal;
  },

  getTotalFormatted: () => {
    const total = get().getTotal();
    return `$${(total / 100).toFixed(2)}`;
  },

  // Reset store
  reset: () =>
    set({
      flowerColor: 'red',
      cards: [
        {
          id: 1,
          recipientName: '',
          message: '',
          senderName: '',
          imageUrl: null,
          imageFile: null,
          isIncluded: false,
        },
      ],
      customerInfo: {
        name: '',
        email: '',
        phone: '',
      },
      deliveryMethod: 'delivery',
      deliveryInfo: {
        street: '',
        city: '',
        state: '',
        zip: '',
        date: '',
      },
    }),
}));
