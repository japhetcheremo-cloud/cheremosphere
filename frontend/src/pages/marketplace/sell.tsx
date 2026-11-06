import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken, ProductCategory } from '@/lib/api';

export default function SellProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    currency: 'KES',
    location: 'Nairobi, Kenya',
    condition: 'brand_new',
    stock_quantity: 1,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchCats() {
      try {
        const res = await apiFetch<ProductCategory[]>('/marketplace/categories/');
        setCategories(res);
        if (res.length > 0) {
          setFormData(prev => ({ ...prev, category: res[0].id.toString() }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getToken()) {
      router.push('/login?redirect=/marketplace/sell');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await apiFetch<any>('/marketplace/products/', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          category: parseInt(formData.category),
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity.toString()),
        })
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/marketplace/${res.id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to list product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Sell a Product — CheremoSphere Marketplace">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <NextLink href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B82] hover:text-[#0D2A5C] mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </NextLink>

        <div className="bg-white rounded-3xl border border-[#E6EBF2] p-6 sm:p-10 shadow-xs">
          <div className="border-b border-gray-100 pb-6 mb-6">
            <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Seller Portal</span>
            <h1 className="text-2xl font-extrabold text-[#0D2A5C] mt-1">List an Item for Sale</h1>
            <p className="text-xs text-[#5B6B82] mt-1">
              Reach thousands of buyers in Nairobi, Mombasa, and across Kenya and Africa.
            </p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-[#16A34A] mx-auto" />
              <h3 className="text-xl font-bold text-[#16A34A]">Product Listed Successfully!</h3>
              <p className="text-xs text-[#5B6B82]">Redirecting you to your product page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 text-[#DC2626] text-xs font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell Latitude Core i7 (16GB RAM) or Organic Hass Avocado"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  >
                    <option value="brand_new">Brand New</option>
                    <option value="like_new">Refurbished / Like New</option>
                    <option value="used">Used</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Price (KES) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Available Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24344D] mb-1.5">Location / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi CBD, Mombasa"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24344D] mb-1.5">Detailed Description *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe technical specs, materials, warranty, packaging, and pickup or delivery details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <NextLink href="/marketplace" className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#5B6B82] hover:bg-gray-50">
                  Cancel
                </NextLink>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-8 py-3 text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {submitting ? 'Listing Product...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
