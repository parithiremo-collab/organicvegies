import CartDrawer from '../CartDrawer';
import { useState } from 'react';
import tomatoesImage from '@assets/generated_images/tomatoes_product_sample.png';
import bananasImage from '@assets/generated_images/bananas_product_sample.png';

export default function CartDrawerExample() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState([
    {
      id: "tomatoes-1kg",
      name: "Organic Tomatoes on Vine",
      image: tomatoesImage,
      price: 85,
      quantity: 2,
      weight: "1 kg",
    },
    {
      id: "bananas-6pcs",
      name: "Organic Bananas",
      image: bananasImage,
      price: 48,
      quantity: 1,
      weight: "6 pcs",
    },
  ]);

  return (
    <div className="p-4">
      <button onClick={() => setOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded">
        Open Cart ({items.length})
      </button>
      <CartDrawer 
        open={open}
        onOpenChange={setOpen}
        items={items}
        onUpdateQuantity={(id, quantity) => {
          setItems(items.map(item => 
            item.id === id ? { ...item, quantity } : item
          ));
          console.log('Update quantity:', id, quantity);
        }}
        onRemoveItem={(id) => {
          setItems(items.filter(item => item.id !== id));
          console.log('Remove item:', id);
        }}
        onCheckout={() => console.log('Checkout clicked')}
      />
    </div>
  );
}
