import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext.js';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Bespoke Atelier Consultation');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { success, error: toastError } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toastError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      success('Thank you. A dedicated LUXORA Client Concierge will contact you within 4 hours.');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#6D212F]">
          Private Client Services
        </span>
        <h1 className="text-4xl font-serif text-[#12100E]">
          Atelier Concierge & Salons
        </h1>
        <p className="text-xs sm:text-sm text-[#8C827A] leading-relaxed">
          Whether you desire bespoke silhouette fitting, VIP private viewings, or order assistance, our dedicated stylist team is at your disposal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#E8E1D7] shadow-sm space-y-6">
          <h2 className="text-xl font-serif text-[#12100E]">Send a Message to Our Concierge</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lady Eleanor"
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eleanor@luxury.com"
                  className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                Nature of Request
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl px-4 py-2.5 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
              >
                <option>Bespoke Atelier Consultation</option>
                <option>VIP Salon Appointment Booking</option>
                <option>Order & Consignment Assistance</option>
                <option>Returns & Exchanges</option>
                <option>Press & Editorial Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#1E1B18] mb-1">
                Message / Measurements
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe how we may assist you..."
                className="w-full bg-[#FAF8F5] border border-[#E8E1D7] rounded-xl p-4 text-xs text-[#12100E] focus:bg-white focus:outline-none focus:border-[#12100E]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 bg-[#12100E] hover:bg-[#6D212F] text-white rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
            >
              <span>{submitting ? 'Transmitting...' : 'Dispatch Inquiry'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Atelier Salon Addresses (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#12100E] text-white space-y-4">
            <h3 className="text-base font-serif text-white pb-3 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A97E]" />
              <span>Flagship Salons</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <p className="font-bold text-[#C8A97E]">Milan Atelier & Private Salon</p>
                <p className="text-[#E8E1D7]/80 mt-0.5">Via Monte Napoleone 14, 20121 Milano MI, Italy</p>
                <p className="text-[#E8E1D7]/60 mt-1">Tel: +39 02 8901 4455</p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="font-bold text-[#C8A97E]">Mumbai Flagship Pavilion</p>
                <p className="text-[#E8E1D7]/80 mt-0.5">Palais Royale, Worli Sea Face, Mumbai 400018, India</p>
                <p className="text-[#E8E1D7]/60 mt-1">Tel: +91 (022) 6900 8800</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8E1D7] space-y-3 text-xs text-[#4A453E]">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#6D212F]" />
              <span>Concierge Hours: Mon - Sat, 9:00 AM - 9:00 PM IST / CET</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#6D212F]" />
              <span>Direct Concierge: concierge@luxora.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#6D212F]" />
              <span>Toll-Free Global: 1800-LUXORA-ATELIER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
