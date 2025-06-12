"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/app/hooks/useDebounce';

interface SearchResult {
  id: string;
  name: string;
  sale_price: number;
  thumbnail: string;
  category: {
    name: string;
  };
}

const SearchInput = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/client/home/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();
        setResults(data.products || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full bg-gray-800/50 text-white border border-purple-500/20 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim() || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl border border-purple-500/20 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">Đang tìm kiếm...</div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/san-pham/${product.id}`}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-purple-500/20 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                    <p className="text-sm text-purple-400">{product.sale_price.toLocaleString()} đ</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-4 text-center text-gray-400">Không tìm thấy sản phẩm</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchInput; 