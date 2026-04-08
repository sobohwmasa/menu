import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { MenuItem } from '../types';

const DEFAULT_MENU: MenuItem[] = [
  {
    id: '1',
    title: 'Zaatar Manakish',
    description: 'Traditional Lebanese thyme and olive oil flatbread.',
    price: 150000,
    category: 'Manakish',
    imageUrl: 'https://picsum.photos/seed/zaatar/800/600'
  },
  {
    id: '2',
    title: 'Cheese Manakish',
    description: 'Freshly baked flatbread topped with Akkawi cheese.',
    price: 350000,
    category: 'Manakish',
    imageUrl: 'https://picsum.photos/seed/cheese/800/600'
  },
  {
    id: '3',
    title: 'Fresh Sourdough',
    description: 'Artisanal sourdough bread baked daily.',
    price: 500000,
    category: 'Bread',
    imageUrl: 'https://picsum.photos/seed/bread/800/600'
  }
];

// The user will need to replace this with their published CSV URL
// Example: https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub?output=csv
const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || '';

export function useMenu() {
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_MENU);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!SHEET_URL) return;

    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedItems = results.data.map((row: any, index: number) => ({
              id: row.id || String(index),
              title: row.Title || row.title || '',
              description: row.Description || row.description || '',
              price: parseFloat(row.Price || row.price || '0'),
              category: row.Category || row.category || 'General',
              imageUrl: row.ImageURL || row.imageUrl || row.image || 'https://picsum.photos/seed/bakery/800/600'
            }));
            setItems(parsedItems);
            setLoading(false);
          },
          error: (err: any) => {
            console.error('CSV Parsing Error:', err);
            setError('Failed to parse menu data');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('Failed to fetch menu data');
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { items, loading, error };
}
