
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import {
  ShoppingBag,
  MapPin,
  Tag,
  MessageCircle,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Share2,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

import Layout from '@/components/Layout';
import { apiFetch, getToken, ProductListing } from '@/lib/api';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<ProductListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !id) return;

    let mounted = true;

    async function loadProduct() {
      try {
        const data = await apiFetch<ProductListing>(
          `/marketplace/products/${id}/`
        );

        if (mounted) {
          setProduct(data);
        }

      } catch (err) {
        console.error('Error loading product details:', err);

        if (mounted) {
          setProduct(null);
        }

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };

  }, [router.isReady, id]);

  // Safely obtain seller information.
  const seller = product?.seller ?? null;

  const sellerPhone =
    typeof seller?.phone === 'string' && seller.phone.trim()
      ? seller.phone.trim()
      : '';

  const whatsappRaw =
    typeof seller?.whatsapp_number === 'string'
      ? seller.whatsapp_number.trim()
      : '';

  const whatsappNum = whatsappRaw.replace(/\D/g, '');

  const sellerUsername =
    typeof seller?.username === 'string' && seller.username.trim()
      ? seller.username.trim()
      : 'Seller';

  const sellerName =
    seller?.first_name
      ? `${seller.first_name} ${seller.last_name || ''}`.trim()
      : sellerUsername;

  const sellerInitial = sellerUsername.charAt(0).toUpperCase() || 'S';

  const handleStartChat = async () => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    if (!product) return;

    if (!seller?.id) {
      alert('Seller information is unavailable. Please use another contact option if available.');
      return;
    }

    try {
      const conv = await apiFetch<any>('/chat/conversations/', {
        method: 'POST',
        body: JSON.stringify({
          recipient_id: seller.id,
          subject: `Inquiry on: ${product.title}`,
          message: `Hello! I am interested in purchasing your listing "${product.title}" (KES ${product.price}) on CheremoSphere.`
        })
      });

      if (conv?.id) {
        router.push(`/chat?id=${conv.id}`);
      } else {
        throw new Error('Conversation could not be created.');
      }

    } catch (err: any) {
      alert(err.message || 'Could not start conversation with seller.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="py-24 text-center text-[#5B6B82]">
          Loading product details...
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="py-24 text-center text-[#DC2626]">
          Product not found.
          <div className="mt-4">
            <NextLink
              href="/marketplace"
              className="text-[#0D2A5C] font-bold underline"
            >
              Return to Marketplace
            </NextLink>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${product.title} — CheremoSphere Marketplace`}>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <NextLink
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B82] hover:text-[#0D2A5C] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </NextLink>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white rounded-3xl border border-[#E6EBF2] p-6 sm:p-8 shadow-xs">

              <div className="flex items-center justify-between gap-4 mb-4">

                <span className="text-xs font-bold text-[#FF7A00] bg-[#FFF1E5] px-3 py-1 rounded-full uppercase">
                  {product.category_name || 'Uncategorized'}
                </span>

                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-[#16A34A] capitalize">
                  {typeof product.condition === 'string'
                    ? product.condition.replace(/_/g, ' ')
                    : 'Not specified'}
                </span>

              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2A5C]">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-[#5B6B82] mt-2 pb-4 border-b border-gray-100">

                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#FF7A00]" />
                  <span>
                    {product.location || 'Location not specified'}
                  </span>
                </span>

                <span>•</span>

                <span>
                  Stock: <strong>{product.stock_quantity ?? 0} available</strong>
                </span>

              </div>

              <div className="pt-6">

                <h3 className="text-sm font-bold text-[#0D2A5C] uppercase tracking-wider mb-2">
                  Description
                </h3>

                <div className="text-sm text-[#24344D] leading-relaxed whitespace-pre-line space-y-4">
                  {product.description || 'No description provided.'}
                </div>

              </div>

            </div>

            {/* Buyer Safety Tips */}
            <div className="bg-[#F4F7FB] border border-[#E6EBF2] p-5 rounded-2xl flex items-start gap-3 text-xs text-[#5B6B82]">

              <ShieldCheck className="w-5 h-5 text-[#0D2A5C] shrink-0 mt-0.5" />

              <div>

                <p className="font-bold text-[#0D2A5C]">
                  CheremoSphere Safe Trading Guidance
                </p>

                <p className="mt-0.5">
                  Meet sellers in public locations like Cheremo Plaza or verified business hubs. Inspect goods before making payments.
                </p>

              </div>

            </div>

          </div>

          {/* Pricing & Contact Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white rounded-3xl border border-[#E6EBF2] p-6 shadow-xs space-y-6">

              <div>

                <span className="text-xs font-semibold text-[#5B6B82]">
                  Listing Price
                </span>

                <p className="text-3xl font-black text-[#FF7A00] mt-1">
                  KES {Number(product.price || 0).toLocaleString()}
                </p>

              </div>

              <div className="space-y-3 pt-2">

                {/* WhatsApp Button */}
                {whatsappNum ? (

                  <a
                    href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                      `Hello! I am interested in your item "${product.title}" listed on CheremoSphere.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat on WhatsApp</span>
                  </a>

                ) : (

                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 bg-gray-300 text-gray-600 font-bold text-sm py-3.5 rounded-xl cursor-not-allowed"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp unavailable</span>
                  </button>

                )}

                {/* Telephone Button */}
                {sellerPhone ? (

                  <a
                    href={`tel:${sellerPhone}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0D2A5C] hover:bg-[#071836] text-white font-bold text-sm py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Seller ({sellerPhone})</span>
                  </a>

                ) : (

                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 bg-gray-300 text-gray-600 font-bold text-sm py-3.5 rounded-xl cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Phone unavailable</span>
                  </button>

                )}

                {/* In-Platform Message */}
                <button
                  onClick={handleStartChat}
                  disabled={!seller?.id}
                  className="w-full btn-outline py-3 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="w-4 h-4 text-[#FF7A00]" />
                  <span>Send In-App Message</span>
                </button>

              </div>

              {/* Seller Information */}
              <div className="pt-6 border-t border-gray-100">

                <h4 className="text-xs font-bold text-[#5B6B82] uppercase tracking-wider mb-2">
                  Seller Details
                </h4>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-[#0D2A5C] text-white flex items-center justify-center font-bold text-sm">
                    {sellerInitial}
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#0D2A5C]">
                      {sellerName}
                    </p>

                    <p className="text-xs text-[#5B6B82] flex items-center gap-1">

                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />

                      <span>
                        {seller
                          ? 'CheremoSphere Seller'
                          : 'Seller information unavailable'}
                      </span>

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}
