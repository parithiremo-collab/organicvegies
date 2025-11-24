export type Language = 'en' | 'hi' | 'ta';

export interface Translations {
  [key: string]: string | { [key: string]: string };
}

// Product name and description translations
export const productTranslations: Record<Language, Record<string, { name: string; description: string }>> = {
  en: {
    'prod-1': { name: 'Organic Tomatoes', description: 'Fresh red tomatoes from certified organic farms' },
    'prod-2': { name: 'Organic Spinach', description: 'Fresh spinach leaves, pesticide-free' },
    'prod-3': { name: 'Organic Carrots', description: 'Sweet orange carrots from northern farms' },
    'prod-4': { name: 'Organic Apples', description: 'Crispy red apples, fresh from orchards' },
    'prod-5': { name: 'Organic Bananas', description: 'Ripe yellow bananas, naturally ripened' },
  },
  hi: {
    'prod-1': { name: 'जैविक टमाटर', description: 'प्रमाणित जैविक खेतों से ताजा लाल टमाटर' },
    'prod-2': { name: 'जैविक पालक', description: 'ताजा पालक की पत्तियां, कीटनाशक मुक्त' },
    'prod-3': { name: 'जैविक गाजर', description: 'उत्तरी खेतों से मीठी नारंगी गाजर' },
    'prod-4': { name: 'जैविक सेब', description: 'बागों से ताजा कुरकुरे लाल सेब' },
    'prod-5': { name: 'जैविक केला', description: 'प्राकृतिक रूप से पका हुआ पीला केला' },
  },
  ta: {
    'prod-1': { name: 'கரிம தக்காளி', description: 'சான்றிதழ் பெற்ற கரிம பண்ணைகளிலிருந்து புதிய சிவப்பு தக்காளி' },
    'prod-2': { name: 'கரிம கீரை', description: 'புதிய கீரையின் இலைகள், பூச்சிக்கொல்லி இல்லாத' },
    'prod-3': { name: 'கரிம கேரட்', description: 'வடக்கு பண்ணைகளிலிருந்து இனிப்பான ஆரஞ்சு கேரட்' },
    'prod-4': { name: 'கரிம ஆப்பிள்', description: 'தோட்டங்களிலிருந்து புதிய சிறுவயது சிவப்பு ஆப்பிள்' },
    'prod-5': { name: 'கரிம வாழை', description: 'இயற்கையாக பழுத்த மஞ்சள் வாழை' },
  },
};

// Category name translations
export const categoryTranslations: Record<Language, Record<string, string>> = {
  en: {
    'Vegetables': 'Vegetables',
    'Fruits': 'Fruits',
    'Grains & Pulses': 'Grains & Pulses',
    'Dairy': 'Dairy',
  },
  hi: {
    'Vegetables': 'सब्जियां',
    'Fruits': 'फल',
    'Grains & Pulses': 'अनाज और दालें',
    'Dairy': 'डेयरी',
  },
  ta: {
    'Vegetables': 'காய்கறிகள்',
    'Fruits': 'பழங்கள்',
    'Grains & Pulses': 'தானியங்கள் மற்றும் பருப்புகள்',
    'Dairy': 'பால் பொருட்கள்',
  },
};

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    home: 'Home',
    shop: 'Shop',
    cart: 'Cart',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    language: 'Language',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    
    // Hero Section
    heroTitle: 'Fresh Organic Produce Delivered',
    heroSubtitle: 'Certified organic vegetables, fruits, and dairy from trusted farmers',
    shopNow: 'Shop Now',
    
    // Products
    products: 'Products',
    product: 'Product',
    price: 'Price',
    rating: 'Rating',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    quantity: 'Quantity',
    origin: 'Origin',
    
    // Cart
    shoppingCart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyMessage: 'Add some fresh organic products to get started',
    startShopping: 'Start Shopping',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    freeDeliveryOver: 'Free delivery on orders over ₹500',
    checkout: 'Checkout',
    removeItem: 'Remove',
    updateQuantity: 'Update Quantity',
    
    // Categories
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    grains: 'Grains & Pulses',
    dairy: 'Dairy',
    
    // Footer
    customerService: 'Customer Service',
    helpCenter: 'Help Center',
    trackOrder: 'Track Order',
    shippingInfo: 'Shipping Info',
    returnsRefunds: 'Returns & Refunds',
    policies: 'Policies',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    qualityGuarantee: 'Quality Guarantee',
    newsletter: 'Newsletter',
    getDeals: 'Get fresh deals and organic tips delivered to your inbox',
    email: 'Email',
    subscribe: 'Subscribe',
    accept: 'We accept',
    allRightsReserved: 'All rights reserved',
    
    // Auth
    signInWithReplit: 'Sign In with Replit',
    signInDescription: 'Sign in to access your cart and orders',
    authenticated: 'Authenticated',
    unauthenticated: 'Not signed in',
    
    // Misc
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    added: 'Added to cart',
    removed: 'Removed from cart',
    certified: '100% Organic Certified',
  },
  
  hi: {
    // Common
    home: 'होम',
    shop: 'दुकान',
    cart: 'कार्ट',
    search: 'खोज',
    filter: 'फिल्टर',
    sort: 'सॉर्ट',
    language: 'भाषा',
    signIn: 'साइन इन करें',
    signUp: 'साइन अप करें',
    logout: 'लॉगआउट',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    
    // Hero Section
    heroTitle: 'ताज़ा जैविक उपज होम डिलीवरी',
    heroSubtitle: 'प्रमाणित जैविक सब्जियां, फल और विश्वसनीय किसानों से डेयरी',
    shopNow: 'अभी खरीदें',
    
    // Products
    products: 'उत्पाद',
    product: 'उत्पाद',
    price: 'कीमत',
    rating: 'रेटिंग',
    addToCart: 'कार्ट में जोड़ें',
    viewDetails: 'विवरण देखें',
    inStock: 'स्टॉक में है',
    outOfStock: 'स्टॉक से बाहर',
    quantity: 'मात्रा',
    origin: 'मूल',
    
    // Cart
    shoppingCart: 'शॉपिंग कार्ट',
    cartEmpty: 'आपकी कार्ट खाली है',
    cartEmptyMessage: 'शुरुआत करने के लिए कुछ ताज़ी जैविक उपज जोड़ें',
    startShopping: 'खरीदारी शुरू करें',
    subtotal: 'उप कुल',
    deliveryFee: 'डिलीवरी शुल्क',
    total: 'कुल',
    freeDeliveryOver: '₹500 से अधिक ऑर्डर पर मुफ्त डिलीवरी',
    checkout: 'चेकआउट',
    removeItem: 'हटाएं',
    updateQuantity: 'मात्रा अपडेट करें',
    
    // Categories
    vegetables: 'सब्जियां',
    fruits: 'फल',
    grains: 'अनाज और दालें',
    dairy: 'डेयरी',
    
    // Footer
    customerService: 'ग्राहक सेवा',
    helpCenter: 'सहायता केंद्र',
    trackOrder: 'ऑर्डर ट्रैक करें',
    shippingInfo: 'शिपिंग जानकारी',
    returnsRefunds: 'रिटर्न और रिफंड',
    policies: 'नीतियां',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    qualityGuarantee: 'गुणवत्ता गारंटी',
    newsletter: 'समाचार पत्र',
    getDeals: 'अपने इनबॉक्स में ताज़ी डील और जैविक टिप्स प्राप्त करें',
    email: 'ईमेल',
    subscribe: 'सदस्यता लें',
    accept: 'हम स्वीकार करते हैं',
    allRightsReserved: 'सभी अधिकार सुरक्षित',
    
    // Auth
    signInWithReplit: 'Replit के साथ साइन इन करें',
    signInDescription: 'अपनी कार्ट और ऑर्डर एक्सेस करने के लिए साइन इन करें',
    authenticated: 'प्रमाणित',
    unauthenticated: 'साइन इन नहीं किया गया',
    
    // Misc
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    added: 'कार्ट में जोड़ा गया',
    removed: 'कार्ट से हटाया गया',
    certified: '100% जैविक प्रमाणित',
  },
  
  ta: {
    // Common
    home: 'முகப்பு',
    shop: 'கடை',
    cart: 'வண்டி',
    search: 'தேடல்',
    filter: 'வடிப்பு',
    sort: 'வரிசைப்படுத்து',
    language: 'மொழி',
    signIn: 'உள்நுழைக',
    signUp: 'பதிவு செய்க',
    logout: 'வெளியேறு',
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    
    // Hero Section
    heroTitle: 'புதிய கரிம விளைபொருட்கள் வீட்டுக்கு வந்து சேரும்',
    heroSubtitle: 'நம்பகமான விவசாயிகளிடமிருந்து சான்றிதழ் பெற்ற கரிம காய்கறிகள், பழங்கள் மற்றும் பால் பொருட்கள்',
    shopNow: 'இப்போது வாங்கவும்',
    
    // Products
    products: 'பொருட்கள்',
    product: 'பொருள்',
    price: 'விலை',
    rating: 'மதிப்பீடு',
    addToCart: 'வண்டியில் சேர்க்கவும்',
    viewDetails: 'விவரங்களைக் காணவும்',
    inStock: 'இருப்பில் உள்ளது',
    outOfStock: 'இருப்பில் இல்லை',
    quantity: 'அளவு',
    origin: 'தோற்றம்',
    
    // Cart
    shoppingCart: 'வாங்கும் வண்டி',
    cartEmpty: 'உங்கள் வண்டி காலியாக உள்ளது',
    cartEmptyMessage: 'தொடங்குவதற்கு சில பொருட்களைச் சேர்க்கவும்',
    startShopping: 'வாங்கலைத் தொடங்கவும்',
    subtotal: 'உபயோகம்',
    deliveryFee: 'விநியோக கட்டணம்',
    total: 'மொத்தம்',
    freeDeliveryOver: '₹500 க்கு மேல் உள்ள ஆர்டர்களுக்கு இலவச விநியோகம்',
    checkout: 'வெளியேறு',
    removeItem: 'அகற்றவும்',
    updateQuantity: 'அளவை புதுப்பிக்கவும்',
    
    // Categories
    vegetables: 'காய்கறிகள்',
    fruits: 'பழங்கள்',
    grains: 'தானியங்கள் மற்றும் பருப்புகள்',
    dairy: 'பால் பொருட்கள்',
    
    // Footer
    customerService: 'வாடிக்கையாளர் சேவை',
    helpCenter: 'உதவி மையம்',
    trackOrder: 'ஆர்டரைக் கண்காணிக்கவும்',
    shippingInfo: 'ஷிப்பிங் தகவல்',
    returnsRefunds: 'திருப்பல் மற்றும் திரும்பல்',
    policies: 'கொள்கைகள்',
    privacyPolicy: 'தனியுரிமை கொள்கை',
    termsOfService: 'சேவையின் விதிமுறைகள்',
    qualityGuarantee: 'தரம் உத்தரவாதம்',
    newsletter: 'செய்திமடல்',
    getDeals: 'உங்கள் இனবாக்சுக்கு புதிய டீல்கள் மற்றும் கரிம குறிப்புகளைப் பெறுங்கள்',
    email: 'மின்னஞ்சல்',
    subscribe: 'குழுசேரவும்',
    accept: 'நாங்கள் ஏற்றுக்கொள்கிறோம்',
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன',
    
    // Auth
    signInWithReplit: 'Replit மூலம் உள்நுழைக',
    signInDescription: 'உங்கள் வண்டி மற்றும் ஆர்டர்களை அணுக உள்நுழைக',
    authenticated: 'சான்றுப்படுத்தப்பட்டது',
    unauthenticated: 'உள்நுழையவில்லை',
    
    // Misc
    loading: 'ஏற்றுதல்...',
    error: 'பிழை',
    success: 'வெற்றி',
    added: 'வண்டியில் சேர்க்கப்பட்டது',
    removed: 'வண்டியிலிருந்து அகற்றப்பட்டது',
    certified: '100% கரிம சான்றிதழ் பெற்றது',
  },
};
