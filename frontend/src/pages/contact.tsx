import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, MessageCircle, 
  Clock, ShieldCheck, CheckCircle2, Send, Building2 
} from 'lucide-react';
import Layout from '@/components/Layout';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout title="Contact Us — CheremoSphere">
      <div className="bg-[#0D2A5C] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Official Headquarters</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact CheremoSphere</h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto">
            Get in touch with the official CheremoSphere administration, recruitment support, and customer service team.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Official Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold text-[#FF7A00] uppercase">Company Leadership</span>
                <h3 className="text-xl font-bold text-[#0D2A5C] mt-0.5">CheremoSphere</h3>
                <p className="text-xs text-[#5B6B82]">Owner: <strong>Japhet Cheremo</strong></p>
              </div>

              {/* Physical Office Location */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0D2A5C] shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#FF7A00]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0D2A5C] uppercase">Physical Office</h4>
                  <p className="text-sm font-semibold text-[#24344D] mt-0.5">
                    Cheremo Plaza, Nairobi Mombasa Road, Kenya.
                  </p>
                  <p className="text-xs text-[#5B6B82] mt-0.5">Central commercial hub for partner inquiries and verification.</p>
                </div>
              </div>

              {/* WhatsApp (Functional Action Button) */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-green-50 text-[#16A34A] shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0D2A5C] uppercase">Official WhatsApp</h4>
                  <a
                    href="https://wa.me/254719678760"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#16A34A] hover:underline mt-0.5"
                  >
                    <span>+254 719 678 760 (Click to Chat)</span>
                  </a>
                  <p className="text-xs text-[#5B6B82] mt-0.5">Instant messaging & recruitment consultations.</p>
                </div>
              </div>

              {/* Direct Telephone Link */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-orange-50 text-[#FF7A00] shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0D2A5C] uppercase">Telephone / Business Line</h4>
                  <a
                    href="tel:0719678760"
                    className="block text-sm font-bold text-[#0D2A5C] hover:text-[#FF7A00] mt-0.5"
                  >
                    0719678760 / +254 719 678 760
                  </a>
                  <p className="text-xs text-[#5B6B82] mt-0.5">Available Mon - Sat: 8:00 AM - 6:00 PM EAT</p>
                </div>
              </div>

              {/* Official Email Link (Preserving spelling japhetcheremo@gmai.com) */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-50 text-[#0D2A5C] shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0D2A5C] uppercase">Official Email</h4>
                  <a
                    href="mailto:japhetcheremo@gmai.com"
                    className="block text-sm font-bold text-[#0D2A5C] hover:text-[#FF7A00] break-all mt-0.5"
                  >
                    japhetcheremo@gmai.com
                  </a>
                  <p className="text-xs text-[#5B6B82] mt-0.5">Official written inquiries & partnership proposals.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Direct Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-[#E6EBF2] p-8 sm:p-10 shadow-xs">
              <h2 className="text-xl font-bold text-[#0D2A5C] mb-1">Send a Direct Message</h2>
              <p className="text-xs text-[#5B6B82] mb-6">Our team replies within 24 hours.</p>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-[#16A34A] mx-auto" />
                  <h3 className="text-lg font-bold text-[#16A34A]">Message Received!</h3>
                  <p className="text-xs text-[#5B6B82]">
                    Thank you for reaching out to CheremoSphere. Japhet Cheremo and the support team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#24344D] mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#24344D] mb-1">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24344D] mb-1">Your Phone / WhatsApp Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0712345678"
                      className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24344D] mb-1">Your Message or Inquiry *</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you with employment, recruiting, or advertising?"
                      className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    <span>Send Message to CheremoSphere</span>
                    <Send className="w-4 h-4 ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
