import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartContextType {
  totalItems: number;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [totalItems, setTotalItems] = useState<number>(0);

  useEffect(() => {
    const storedTotalItems = localStorage.getItem('totalItems');
    if (storedTotalItems) {
      setTotalItems(Number(storedTotalItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('totalItems', totalItems.toString());
  }, [totalItems]);

  const value: CartContextType = {
    totalItems,
    setTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};