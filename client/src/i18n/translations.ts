export type Language = 'en' | 'hi' | 'ta';

export interface Translations {
  [key: string]: string | { [key: string]: string };
}

export const productTranslations: Record<Language, Record<string, { name: string; description: string }>> = {
  en: {
    'prod-1': { name: 'Tomatoes', description: 'Fresh organic tomatoes' },
    'prod-2': { name: 'Spinach', description: 'Fresh spinach' },
    'prod-3': { name: 'Carrots', description: 'Sweet carrots' },
    'prod-4': { name: 'Apples', description: 'Fresh apples' },
    'prod-5': { name: 'Bananas', description: 'Yellow bananas' },
  },
  hi: {
    'prod-1': { name: 'Tamatar', description: 'Taaza tamatar' },
    'prod-2': { name: 'Palak', description: 'Taaza palak' },
    'prod-3': { name: 'Gajar', description: 'Meethi gajar' },
    'prod-4': { name: 'Seb', description: 'Taaza seb' },
    'prod-5': { name: 'Kela', description: 'Paka kela' },
  },
  ta: {
    'prod-1': { name: 'Thakali', description: 'Taaza thakali' },
    'prod-2': { name: 'Keerai', description: 'Taaza keerai' },
    'prod-3': { name: 'Karot', description: 'Meetha karot' },
    'prod-4': { name: 'Apple', description: 'Taaza apple' },
    'prod-5': { name: 'Vazhai', description: 'Paka vazhai' },
  },
};

export const categoryTranslations: Record<Language, Record<string, string>> = {
  en: {
    'Vegetables': 'Vegetables',
    'Fruits': 'Fruits',
    'Grains & Pulses': 'Grains',
    'Dairy': 'Dairy',
  },
  hi: {
    'Vegetables': 'Sabziyaan',
    'Fruits': 'Phal',
    'Grains & Pulses': 'Daal',
    'Dairy': 'Doodh',
  },
  ta: {
    'Vegetables': 'Kai Kai',
    'Fruits': 'Pazham',
    'Grains & Pulses': 'Thaniyam',
    'Dairy': 'Paalu',
  },
};

export const translations: Record<Language, Translations> = {
  en: {
    home: 'Home', shop: 'Shop', cart: 'Cart', search: 'Search', filter: 'Filter', sort: 'Sort',
    language: 'Language', signIn: 'Sign In', signUp: 'Sign Up', logout: 'Logout',
    profile: 'Profile', settings: 'Settings', heroTitle: 'Fresh Organic Produce',
    heroSubtitle: 'Organic from trusted farmers', shopNow: 'Shop Now', products: 'Products',
    product: 'Product', price: 'Price', rating: 'Rating', addToCart: 'Add to Cart',
    viewDetails: 'View Details', inStock: 'In Stock', outOfStock: 'Out of Stock',
    quantity: 'Quantity', origin: 'Origin', shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty', cartEmptyMessage: 'Add products to start',
    startShopping: 'Start Shopping', subtotal: 'Subtotal', deliveryFee: 'Delivery',
    total: 'Total', freeDeliveryOver: 'Free delivery on 500+', checkout: 'Checkout',
    removeItem: 'Remove', updateQuantity: 'Update', vegetables: 'Vegetables',
    fruits: 'Fruits', grains: 'Grains', dairy: 'Dairy', customerService: 'Support',
    helpCenter: 'Help', trackOrder: 'Track', shippingInfo: 'Shipping',
    returnsRefunds: 'Returns', policies: 'Policies', privacyPolicy: 'Privacy',
    termsOfService: 'Terms', qualityGuarantee: 'Quality', newsletter: 'Newsletter',
    getDeals: 'Get deals', email: 'Email', subscribe: 'Subscribe', accept: 'Accept',
    allRightsReserved: 'All rights reserved', signInWithReplit: 'Sign In Replit',
    signInDescription: 'Sign in for cart', authenticated: 'Logged In',
    unauthenticated: 'Not logged in', loading: 'Loading', error: 'Error',
    success: 'Success', added: 'Added', removed: 'Removed', certified: '100% Certified',
  },
  hi: {
    home: 'Ghar', shop: 'Dukaan', cart: 'Cart', search: 'Khojo', filter: 'Filter', sort: 'Sort',
    language: 'Bhasha', signIn: 'Login', signUp: 'Naya', logout: 'Logout',
    profile: 'Profile', settings: 'Settings', heroTitle: 'Taaza Sabziyaan',
    heroSubtitle: 'Kinaron se seedhe', shopNow: 'Kharido', products: 'Sabziyaan',
    product: 'Sabzi', price: 'Kimat', rating: 'Rating', addToCart: 'Cart Mein Daalo',
    viewDetails: 'Dekhein', inStock: 'Stock Mein', outOfStock: 'Khatam',
    quantity: 'Maatra', origin: 'Kahan se', shoppingCart: 'Mera Cart',
    cartEmpty: 'Cart Khaali', cartEmptyMessage: 'Kuch Daalo',
    startShopping: 'Kharido', subtotal: 'Kul', deliveryFee: 'Delivery',
    total: 'Kul', freeDeliveryOver: '500+ Free', checkout: 'Order',
    removeItem: 'Nikalo', updateQuantity: 'Update', vegetables: 'Sabziyaan',
    fruits: 'Phal', grains: 'Daal', dairy: 'Doodh', customerService: 'Madad',
    helpCenter: 'Sahayata', trackOrder: 'Track', shippingInfo: 'Delivery',
    returnsRefunds: 'Return', policies: 'Niyam', privacyPolicy: 'Privacy',
    termsOfService: 'Sharaten', qualityGuarantee: 'Guarantee', newsletter: 'News',
    getDeals: 'Deal', email: 'Email', subscribe: 'Subscribe', accept: 'Accept',
    allRightsReserved: 'Adhikar', signInWithReplit: 'Replit Login',
    signInDescription: 'Login Karo', authenticated: 'Login',
    unauthenticated: 'Nahi', loading: 'Load', error: 'Error',
    success: 'Ho Gaya', added: 'Add', removed: 'Remove', certified: '100% Pucca',
  },
  ta: {
    home: 'Home', shop: 'Kadai', cart: 'Vandi', search: 'Thaedu', filter: 'Filter', sort: 'Sort',
    language: 'Mozhi', signIn: 'Enter', signUp: 'New', logout: 'Logout',
    profile: 'Profile', settings: 'Settings', heroTitle: 'Taaza Phalkal',
    heroSubtitle: 'Vivasayigal', shopNow: 'Vangu', products: 'Phalkal',
    product: 'Phal', price: 'Vilai', rating: 'Rating', addToCart: 'Vandi Podu',
    viewDetails: 'Paru', inStock: 'Kidaikum', outOfStock: 'Illai',
    quantity: 'Aalavu', origin: 'Enginthu', shoppingCart: 'En Vandi',
    cartEmpty: 'Vandi Verum', cartEmptyMessage: 'Podu',
    startShopping: 'Vangu', subtotal: 'Kul', deliveryFee: 'Delivery',
    total: 'Kul', freeDeliveryOver: '500+', checkout: 'Order',
    removeItem: 'Thuduk', updateQuantity: 'Update', vegetables: 'Kai',
    fruits: 'Pazham', grains: 'Thaniyam', dairy: 'Paal', customerService: 'Madai',
    helpCenter: 'Udavi', trackOrder: 'Track', shippingInfo: 'Delivery',
    returnsRefunds: 'Return', policies: 'Niyam', privacyPolicy: 'Privacy',
    termsOfService: 'Vilakkangal', qualityGuarantee: 'Guarantee', newsletter: 'News',
    getDeals: 'Deal', email: 'Email', subscribe: 'Subscribe', accept: 'Accept',
    allRightsReserved: 'Rights', signInWithReplit: 'Replit Login',
    signInDescription: 'Login', authenticated: 'Login',
    unauthenticated: 'No', loading: 'Load', error: 'Error',
    success: 'Yes', added: 'Add', removed: 'Remove', certified: '100% Nalla',
  },
};
