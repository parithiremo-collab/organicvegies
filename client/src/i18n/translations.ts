export type Language = 'en' | 'hi' | 'ta';

export interface Translations {
  [key: string]: string | { [key: string]: string };
}

// Product name and description translations - COLLOQUIAL LANGUAGE
export const productTranslations: Record<Language, Record<string, { name: string; description: string }>> = {
  en: {
    'prod-1': { name: 'Organic Tomatoes', description: 'Fresh red tomatoes from certified organic farms' },
    'prod-2': { name: 'Organic Spinach', description: 'Fresh spinach leaves, pesticide-free' },
    'prod-3': { name: 'Organic Carrots', description: 'Sweet orange carrots from northern farms' },
    'prod-4': { name: 'Organic Apples', description: 'Crispy red apples, fresh from orchards' },
    'prod-5': { name: 'Organic Bananas', description: 'Ripe yellow bananas, naturally ripened' },
  },
  hi: {
    'prod-1': { name: 'ताज़ा टमाटर', description: 'बिल्कुल ताज़े टमाटर, सीधे खेत से' },
    'prod-2': { name: 'पालक की साग', description: 'शुद्ध पालक, कोई खाद नहीं' },
    'prod-3': { name: 'मीठी गाजर', description: 'नारंगी गाजर, बहुत ताज़ी' },
    'prod-4': { name: 'सेब - लाल', description: 'देसी सेब, बहुत कुरकुरे' },
    'prod-5': { name: 'पीला केला', description: 'पूरी तरह पका हुआ, खूब मीठा' },
  },
  ta: {
    'prod-1': { name: 'தக்காளி - ताজ़े', description: 'தெருவில் மணக்கும் ताজ़े தக்காளி' },
    'prod-2': { name: 'கீரை - பசளை', description: 'சுத்தமான கீரை, খेत்த வந்தத' },
    'prod-3': { name: 'கேரট் - கிழங்கु', description: 'ஆரஞ்சு கேரட், மீठമா' },
    'prod-4': { name: 'ஆப்பிள் - சிவப்பு', description: 'நம் நாட்டு ஆப்பிள், சுவையா' },
    'prod-5': { name: 'வாழை - மஞ்சள்', description: 'பక்குவமா பழுத்த வாழை' },
  },
};

// Category name translations - COLLOQUIAL
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
    'Grains & Pulses': 'दाल-अनाज',
    'Dairy': 'दूध की चीजें',
  },
  ta: {
    'Vegetables': 'காய்றைकள்',
    'Fruits': 'பழங்கள்',
    'Grains & Pulses': 'தாணியம் ॥ தாளु',
    'Dairy': 'பாலுப் பொருட்கள்',
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
    search: 'खोजो',
    filter: 'फ़िल्टर',
    sort: 'सॉर्ट करो',
    language: 'भाषा',
    signIn: 'लॉगिन करो',
    signUp: 'साइन अप करो',
    logout: 'लॉगआउट',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    
    // Hero Section
    heroTitle: 'ताज़ी सब्जियां घर बैठे',
    heroSubtitle: 'किसानों से सीधे ऑर्गेनिक सब्जियां, फल और दूध की चीजें',
    shopNow: 'अभी खरीदो',
    
    // Products
    products: 'सब्जियां',
    product: 'सब्जी',
    price: 'कीमत',
    rating: 'रेटिंग',
    addToCart: 'कार्ट में डालो',
    viewDetails: 'विवरण देखो',
    inStock: 'स्टॉक में है',
    outOfStock: 'ख़त्म हो गया',
    quantity: 'मात्रा',
    origin: 'कहां से',
    
    // Cart
    shoppingCart: 'मेरा कार्ट',
    cartEmpty: 'कार्ट खाली है',
    cartEmptyMessage: 'कुछ सब्जियां कार्ट में डालो',
    startShopping: 'अभी खरीदारी करो',
    subtotal: 'कुल कीमत',
    deliveryFee: 'डिलीवरी चार्ज',
    total: 'कुल',
    freeDeliveryOver: '₹500 से ऊपर आर्डर पर फ्री डिलीवरी',
    checkout: 'आर्डर करो',
    removeItem: 'निकालो',
    updateQuantity: 'मात्रा बदलो',
    
    // Categories
    vegetables: 'सब्जियां',
    fruits: 'फल',
    grains: 'दाल-अनाज',
    dairy: 'दूध की चीजें',
    
    // Footer
    customerService: 'हमसे संपर्क करो',
    helpCenter: 'मदद केंद्र',
    trackOrder: 'आर्डर ट्रैक करो',
    shippingInfo: 'डिलीवरी की जानकारी',
    returnsRefunds: 'रिटर्न और पैसे वापस',
    policies: 'नियम',
    privacyPolicy: 'प्राइवेसी',
    termsOfService: 'शर्तें',
    qualityGuarantee: 'क्वालिटी गारंटी',
    newsletter: 'न्यूजलेटर',
    getDeals: 'नई डील और टिप्स अपने ईमेल में पाओ',
    email: 'ईमेल',
    subscribe: 'सदस्य बनो',
    accept: 'हम स्वीकार करते हैं',
    allRightsReserved: 'सभी अधिकार सुरक्षित',
    
    // Auth
    signInWithReplit: 'Replit से लॉगिन करो',
    signInDescription: 'अपना कार्ट और आर्डर देखने के लिए लॉगिन करो',
    authenticated: 'लॉगिन किया हुआ',
    unauthenticated: 'लॉगिन नहीं किया',
    
    // Misc
    loading: 'लोड हो रहा है...',
    error: 'एरर',
    success: 'हो गया!',
    added: 'कार्ट में जोड़ दिया',
    removed: 'कार्ट से निकाल दिया',
    certified: '100% ऑर्गेनिक पक्का',
  },
  
  ta: {
    // Common
    home: 'ஹோம்',
    shop: 'கடை',
    cart: 'வண்டி',
    search: 'தேडু',
    filter: 'வடிக्कु',
    sort: 'ஒழுங்கு',
    language: 'மொழி',
    signIn: 'लॉगिन पनु',
    signUp: 'साइन अप पनु',
    logout: 'వेలिये போ',
    profile: 'என் প्রோফाइல்',
    settings: 'సെట్టിംగ్س్',
    
    // Hero Section
    heroTitle: 'ताज़े काय़्रैकल్ घरे కमేरు',
    heroSubtitle: 'किसानों தেরుವுन स्वस्థ ऑर्गेनिक కายక్ష్ఞలు, పழ్фल మహు दूध',
    shopNow: 'ഇപ്പോ വാങ്കു',
    
    // Products
    products: 'पொरुट్कल्',
    product: 'పोरుट్',
    price: 'விलै',
    rating: 'มತ్তು',
    addToCart: 'वंडिल પોట్టు',
    viewDetails: 'वಿವरಂ पारు',
    inStock: 'కిൽлైக्കుत',
    outOfStock: 'आयोத्तொ പോച્చు',
    quantity: 'ऑलवु',
    origin: 'েงিন્तु వంدत',
    
    // Cart
    shoppingCart: 'नेन्नोट വंडி',
    cartEmpty: 'વंडी वெरुങ់क इरुक્कુ',
    cartEmptyMessage: 'सिल కायక్ష్ఞ్ कोट్टు',
    startShopping: 'वंগ ఆरঀभु પנு',
    subtotal: 'కుल વිল',
    deliveryFee: 'डिलीวरी फ្fee',
    total: 'मोთ్తా',
    freeDeliveryOver: '₹500 क्कु मेल అర్డર్ल फ్రీ डिलीवरी',
    checkout: 'आर్డर പნু',
    removeItem: 'தुक్కు',
    updateQuantity: 'ऑलవु पत్थियु',
    
    // Categories
    vegetables: 'काయక్ష్ఞ్לు',
    fruits: 'पжओ',
    grains: 'థానిয्မ תాল',
    dairy: 'పాలుप్ पోरుท్कल್',
    
    // Footer
    customerService: 'వાडिక్കै suपोর्ट್',
    helpCenter: 'अूದవि',
    trackOrder: 'आర్డर తేডు',
    shippingInfo: 'డिலीверी విводर',
    returnsRefunds: 'थिरुप్पि नक नறം வெლुक్कു',
    policies: 'नियміюम్',
    privacyPolicy: 'ప్రাइवేसี',
    termsOfService: 'निയमಂ್',
    qualityGuarantee: 'తरम గారंटీ',
    newsletter: 'सെయ్திक్కार్',
    getDeals: 'नई DEALುम्उ எमেलу पതակు',
    email: 'ईमेل్',
    subscribe: 'ग्រુపุ బିङ്দु',
    accept: 'నॉ తేरుక్కीરோం',
    allRightsReserved: 'सर्বाधिकार सुरक्षिত',
    
    // Auth
    signInWithReplit: 'Replit संदर लঙ్կิన पनु',
    signInDescription: 'नीன్ වंડि అర్డर पारु लঙ్కిన पनु',
    authenticated: 'लঙ్కిन पन్నॉयु इरుក్कు',
    unauthenticated: 'लঙ్కिन्त लै पன్नॉయು',
    
    // Misc
    loading: 'कहीर होরു...',
    error: 'अेरر్',
    success: 'హо गयா!',
    added: 'වंডिल पोট్టු కిंத్अॉయ్',
    removed: 'วंडिल इरून్ दು tucked',
    certified: '100% ऑर्गेनिक सার्ट्ફाईड්',
  },
};
