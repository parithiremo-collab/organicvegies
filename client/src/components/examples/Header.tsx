import Header from '../Header';
import { useState } from 'react';

export default function HeaderExample() {
  const [searchValue, setSearchValue] = useState('');
  
  return (
    <Header 
      cartItemCount={3}
      onCartClick={() => console.log('Cart clicked')}
      onSearchChange={(value) => {
        setSearchValue(value);
        console.log('Search:', value);
      }}
      searchValue={searchValue}
    />
  );
}
