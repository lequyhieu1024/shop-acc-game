import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import api from "@/app/services/axiosService";

export const useBalance = () => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    try {
      const response = await api.get('/user/balance');
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchBalance();
    }
  }, [session]);

  return {
    balance,
    loading,
    refreshBalance: fetchBalance
  };
}; 