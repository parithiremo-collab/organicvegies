export type Language = 'en' | 'hi' | 'ta';

export interface Translations {
  [key: string]: string | { [key: string]: string };
}

export const productTranslations: Record<Language, Record<string, { name: string; description: string }>> = {
  en: {
    'prod-1': { name: 'Organic Tomatoes', description: 'Fresh organic tomatoes' },
    'prod-2': { name: 'Organic Spinach', description: 'Fresh spinach' },
    'prod-3': { name: 'Organic Carrots', description: 'Sweet carrots' },
    'prod-4': { name: 'Organic Apples', description: 'Fresh apples' },
    'prod-5': { name: 'Organic Bananas', description: 'Yellow bananas' },
  },
  hi: {
    'prod-1': { name: 'टमाटर', description: 'ताज़े टमाटर' },
    'prod-2': { name: 'पालक', description: 'ताज़ी पालक' },
    'prod-3': { name: 'गाजर', description: 'मीठी गाजर' },
    'prod-4': { name: 'सेब', description: 'ताज़े सेब' },
    'prod-5': { name: 'केला', description: 'पका केला' },
  },
  ta: {
    'prod-1': { name: 'தக்காளி', description: 'ताज़े தக்காளி' },
    'prod-2': { name: 'கீரை', description: 'ताज़ை கீரை' },
    'prod-3': { name: 'கேரட்', description: 'இனிய கேரட்' },
    'prod-4': { name: 'ஆப்பிள்', description: 'ताज़ை ஆப்பிள்' },
    'prod-5': { name: 'வாழை', description: '익은 வாழை' },
  },
};

export const categoryTranslations: Record<Language, Record<string, string>> = {
  en: {
    'Vegetables': 'Vegetables',
    'Fruits': 'Fruits',
    'Grains & Pulses': 'Grains & Pulses',
    'Dairy': 'Dairy',
  },
  hi: {
    'Vegetables': 'सब्जियाँ',
    'Fruits': 'फल',
    'Grains & Pulses': 'अनाज और दाल',
    'Dairy': 'दूध उत्पाद',
  },
  ta: {
    'Vegetables': 'காய்கறிகள்',
    'Fruits': 'பழங்கள்',
    'Grains & Pulses': 'தானியம் மற்றும் பருப்பு',
    'Dairy': 'பால் தயாரிப்புகள்',
  },
};

export const translations: Record<Language, Translations> = {
  en: {
    home: 'Home', shop: 'Shop', cart: 'Cart', search: 'Search', filter: 'Filter', sort: 'Sort',
    language: 'Language', signIn: 'Sign In', signUp: 'Sign Up', logout: 'Logout',
    profile: 'Profile', settings: 'Settings', heroTitle: 'Fresh Organic Produce',
    heroSubtitle: 'From trusted farmers', shopNow: 'Shop Now', products: 'Products',
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
    allRightsReserved: 'All rights reserved', signInWithReplit: 'Sign In',
    signInDescription: 'Sign in for cart', authenticated: 'Logged In',
    unauthenticated: 'Not logged in', loading: 'Loading', error: 'Error',
    success: 'Success', added: 'Added', removed: 'Removed', certified: '100% Certified',
  },
  hi: {
    home: 'होम', shop: 'दुकान', cart: 'कार्ट', search: 'खोजें', filter: 'फ़िल्टर', sort: 'सॉर्ट',
    language: 'भाषा', signIn: 'लॉगिन करें', signUp: 'साइन अप करें', logout: 'लॉगआउट',
    profile: 'प्रोफाइल', settings: 'सेटिंग्स', heroTitle: 'ताज़ी ऑर्गेनिक सब्जियाँ',
    heroSubtitle: 'विश्वस्त किसानों से सीधे', shopNow: 'अभी खरीदें', products: 'सब्जियाँ',
    product: 'सब्जी', price: 'कीमत', rating: 'रेटिंग', addToCart: 'कार्ट में जोड़ें',
    viewDetails: 'विवरण देखें', inStock: 'स्टॉक में है', outOfStock: 'स्टॉक ख़त्म',
    quantity: 'मात्रा', origin: 'मूल', shoppingCart: 'मेरा कार्ट',
    cartEmpty: 'आपका कार्ट खाली है', cartEmptyMessage: 'शुरुआत के लिए सब्जियाँ जोड़ें',
    startShopping: 'खरीदारी शुरू करें', subtotal: 'कुल कीमत', deliveryFee: 'डिलीवरी शुल्क',
    total: 'कुल', freeDeliveryOver: '500+ पर मुफ़्त डिलीवरी', checkout: 'ऑर्डर करें',
    removeItem: 'हटाएँ', updateQuantity: 'अपडेट करें', vegetables: 'सब्जियाँ',
    fruits: 'फल', grains: 'अनाज', dairy: 'दूध', customerService: 'सहायता',
    helpCenter: 'मदद', trackOrder: 'ट्रैक करें', shippingInfo: 'डिलीवरी जानकारी',
    returnsRefunds: 'रिटर्न', policies: 'नीति', privacyPolicy: 'गोपनीयता',
    termsOfService: 'शर्तें', qualityGuarantee: 'गुणवत्ता गारंटी', newsletter: 'न्यूज़लेटर',
    getDeals: 'डील पाएँ', email: 'ईमेल', subscribe: 'सदस्य बनें', accept: 'स्वीकार करें',
    allRightsReserved: 'सर्वाधिकार सुरक्षित', signInWithReplit: 'लॉगिन करें',
    signInDescription: 'कार्ट के लिए लॉगिन करें', authenticated: 'लॉगइन किया हुआ',
    unauthenticated: 'लॉगइन नहीं किया', loading: 'लोड हो रहा है', error: 'त्रुटि',
    success: 'सफल', added: 'जोड़ा गया', removed: 'हटाया गया', certified: '100% प्रमाणित',
  },
  ta: {
    home: 'முகப்பு', shop: 'கடை', cart: 'வண்டி', search: 'தேடு', filter: 'வடிகட்டு', sort: 'வகைப்படுத்து',
    language: 'மொழி', signIn: 'உள்நுழைக', signUp: 'பதிவு செய்க', logout: 'வெளியேறு',
    profile: 'சுயவிவரம்', settings: 'அமைப்புகள்', heroTitle: 'ताज़ी ऑর्गेनिक பொருட்கள்',
    heroSubtitle: 'நம்பிக்கையான விவசாயிகளிடமிருந்து', shopNow: 'இப்போது வாங்குக', products: 'பொருட்கள்',
    product: 'பொருட்', price: 'விலை', rating: 'மதிப்பீடு', addToCart: 'வண்டியில் சேர்க்கவும்',
    viewDetails: 'விவரங்களைக் காண்க', inStock: 'ஸ்டாக்கில் உள்ளது', outOfStock: 'ஸ்டாக்கில் இல்லை',
    quantity: 'அளவு', origin: 'உற்பத்தி இடம்', shoppingCart: 'என் வண்டி',
    cartEmpty: 'உங்கள் வண்டி காலியாக உள்ளது', cartEmptyMessage: 'தொடங்க பொருட்களைச் சேர்க்கவும்',
    startShopping: 'வாங்குதல் தொடங்குக', subtotal: 'மொத்தம்', deliveryFee: 'டெலிவரி கட்டணம்',
    total: 'மொத்தம்', freeDeliveryOver: '500+ இல் இலவச டெலிவரி', checkout: 'ஆர்டர் செய்க',
    removeItem: 'நீக்கவும்', updateQuantity: 'புதுப்பிக்கவும்', vegetables: 'காய்கறிகள்',
    fruits: 'பழங்கள்', grains: 'தானியம்', dairy: 'பால்', customerService: 'ஆதரவு',
    helpCenter: 'உதவி', trackOrder: 'கண்காணி', shippingInfo: 'கப்பல் தகவல்',
    returnsRefunds: 'திரும்புதல்', policies: 'கொள்கைகள்', privacyPolicy: 'தனியுரிமை',
    termsOfService: 'விதிமுறைகள்', qualityGuarantee: 'தரம் உத்தரவாதம்', newsletter: 'செய்திமடல்',
    getDeals: 'ஒப்பந்தங்களைப் பெறுங்கள்', email: 'மின்னஞ்சல்', subscribe: 'பதிவு செய்க', accept: 'ஏற்றுக்கொள்க',
    allRightsReserved: 'எல்லா உரிமைகளும் உரிமைசெய்யப்பட்டுள்ளது', signInWithReplit: 'உள்நுழைக',
    signInDescription: 'வண்டிக்கு உள்நுழைக', authenticated: 'உள்நுழைந்த',
    unauthenticated: 'உள்நுழையாத', loading: 'ஏற்றுதல்', error: 'பிழை',
    success: 'வெற்றி', added: 'சேர்க்கப்பட்டுவிட்டது', removed: 'நீக்கப்பட்டது', certified: '100% சான்றளிக்கப்பட்ட',
  },
};
