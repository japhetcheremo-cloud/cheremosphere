
import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Search,
  MapPin,
  ShoppingBag,
  PlusCircle,
  Building2,
} from 'lucide-react';

import Layout from '@/components/Layout';
import { apiFetch, ProductListing, ProductCategory } from '@/lib/api';

// Safely extract arrays from different API response formats.
function extractArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === 'object') {
    const response = data as Record<string, unknown>;

    const possibleKeys = [
      'results',
      'data',
      'categories',
      'products',
      'items',
    ];

    for (const key of possibleKeys) {
      const value = response[key];

      if (Array.isArray(value)) {
        return value as T[];
      }

      // Handle nested response structures.
      if (value && typeof value === 'object') {
        const nested = extractArray<T>(value);

        if (nested.length > 0) {
          return nested;
        }
      }
    }
  }

  return [];
}

export default function MarketplacePage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductListing[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');

  const loadProducts = async () => {
    setLoading(true);

    try {
      const q = new URLSearchParams();

      if (search.trim()) {
        q.append('search', search.trim());
      }

      if (selectedCategory) {
        q.append('category', selectedCategory);
      }

      if (location.trim()) {
        q.append('location', location.trim());
      }

      const [prodRes, catRes] = await Promise.allSettled([
        apiFetch<unknown>(
          `/marketplace/products/?${q.toString()}`
        ),

        apiFetch<unknown>(
          '/marketplace/categories/'
        ),
      ]);

      // Handle products response.
      if (prodRes.status === 'fulfilled') {
        const productList = extractArray<ProductListing>(
          prodRes.value
        );

        setProducts(productList);
      } else {
        console.error(
          'Failed to load products:',
          prodRes.reason
        );

        setProducts([]);
      }

      // Handle categories response.
      if (catRes.status === 'fulfilled') {
        const categoryList = extractArray<ProductCategory>(
          catRes.value
        );

        setCategories(categoryList);

        console.log(
          'Marketplace categories:',
          categoryList
        );
      } else {
        console.error(
          'Failed to load categories:',
          catRes.reason
        );

        setCategories([]);
      }

    } catch (err) {
      console.error(
        'Error loading marketplace:',
        err
      );

      setProducts([]);
      setCategories([]);

    } finally {
      setLoading(false);
    }
  };

  // Read search query from URL.
  useEffect(() => {
    if (router.isReady && router.query.search) {
      setSearch(router.query.search as string);
    }
  }, [router.isReady, router.query.search]);

  // Reload marketplace when filters change.
  useEffect(() => {
    if (router.isReady) {
      loadProducts();
    }
  }, [
    router.isReady,
    search,
    selectedCategory,
    location,
  ]);

  return (
    <Layout title="Marketplace — CheremoSphere">

      {/* Hero Section */}
      <div className="bg-[#0D2A5C] text-white py-12 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

          <div>
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">
              Direct Trade & Commerce
            </span>

            <h1 className="text-3xl font-extrabold tracking-tight mt-1">
              CheremoSphere Marketplace
            </h1>

            <p className="text-blue-200 text-sm mt-1 max-w-2xl">
              Buy and sell electronics, phones, fashion, furniture,
              agricultural produce, and business supplies.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <NextLink
              href="/marketplace/businesses"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Registered Businesses</span>
            </NextLink>

            <NextLink
              href="/marketplace/sell"
              className="btn-primary text-sm font-bold px-5 py-3 rounded-xl shadow-md cursor-pointer shrink-0 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell a Product</span>
            </NextLink>

          </div>
        </div>
      </div>

      {/* Marketplace Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6EBF2] shadow-xs mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">

          {/* Search */}
          <div className="relative md:col-span-2">

            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search products, brands, models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            />

          </div>

          {/* Categories */}
          <div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </option>
              ))}

            </select>

          </div>

          {/* Location */}
          <div>

            <input
              type="text"
              placeholder="Location (e.g. Nairobi)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-sm outline-none"
            />

          </div>

        </div>

        {/* Products Grid */}

        {loading ? (

          <div className="py-16 text-center text-[#5B6B82]">
            Loading marketplace catalog...
          </div>

        ) : products.length === 0 ? (

          <div className="bg-white p-12 rounded-2xl border border-[#E6EBF2] text-center">

            <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />

            <h3 className="text-lg font-bold text-[#0D2A5C]">
              No products found
            </h3>

            <p className="text-sm text-[#5B6B82] mt-1">
              Be the first to list items in this category or location.
            </p>

            <NextLink
              href="/marketplace/sell"
              className="btn-primary mt-4 inline-flex px-5 py-3 rounded-xl"
            >
              List an Item
            </NextLink>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {products.map((p) => (

              <div
                key={p.id}
                className="bg-white border border-[#E6EBF2] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#FF7A00] transition-all flex flex-col justify-between group"
              >

                <div className="p-5">

                  <div className="flex items-center justify-between text-[11px] mb-2">

                    <span className="font-bold text-[#5B6B82] bg-gray-100 px-2 py-0.5 rounded-md">
                      {p.category_name || 'Uncategorized'}
                    </span>

                    <span className="text-[#16A34A] font-semibold capitalize">
                      {typeof p.condition === 'string'
                        ? p.condition.replace(/_/g, ' ')
                        : 'Not specified'}
                    </span>

                  </div>

                  <h3 className="text-base font-bold text-[#0D2A5C] group-hover:text-[#FF7A00] transition-colors mt-1 line-clamp-2">

                    <NextLink href={`/marketplace/${p.id}`}>
                      {p.title}
                    </NextLink>

                  </h3>

                  <p className="text-xs text-[#5B6B82] mt-2 line-clamp-3 leading-relaxed">
                    {p.description || 'No description available.'}
                  </p>

                </div>

                {/* Product Footer */}
                <div className="p-5 pt-0 mt-auto border-t border-gray-100">

                  <div className="flex items-center justify-between pt-3">

                    <div>

                      <p className="text-lg font-extrabold text-[#FF7A00]">
                        KES {Number(p.price || 0).toLocaleString()}
                      </p>

                      <p className="text-[11px] text-[#5B6B82] flex items-center gap-1 mt-0.5">

                        <MapPin className="w-3 h-3 text-gray-400" />

                        <span className="truncate max-w-[110px]">
                          {p.location || 'Location not specified'}
                        </span>

                      </p>

                    </div>

                    <NextLink
                      href={`/marketplace/${p.id}`}
                      className="btn-primary text-xs px-3.5 py-2 font-bold rounded-lg shadow-xs"
                    >
                      View Item
                    </NextLink>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </Layout>
  );
}
