import { create } from 'zustand';

const BOUQUET_PRICE = 8000; // $80 in cents
const CARD_PRICE = 500; // $5 in cents

export const useStore = create((set, get) => ({
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
        },
      ],
    })),

  removeCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== id),
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
    const cardTotal = state.cards.length * CARD_PRICE;
    return BOUQUET_PRICE + cardTotal;
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
        },
      ],
      customerInfo: {
        name: '',
        email: '',
        phone: '',
      },
      deliveryInfo: {
        street: '',
        city: '',
        state: '',
        zip: '',
        date: '',
      },
    }),
}));
