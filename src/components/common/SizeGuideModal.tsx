import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [activeTab, setActiveTab] = useState<'women' | 'men'>('women');

  const womenData = [
    { size: 'XS', bust: unit === 'inches' ? '31 - 32' : '78 - 81', waist: unit === 'inches' ? '24 - 25' : '61 - 64', hip: unit === 'inches' ? '34 - 35' : '86 - 89' },
    { size: 'S', bust: unit === 'inches' ? '33 - 34' : '83 - 86', waist: unit === 'inches' ? '26 - 27' : '66 - 69', hip: unit === 'inches' ? '36 - 37' : '91 - 94' },
    { size: 'M', bust: unit === 'inches' ? '35 - 36' : '89 - 91', waist: unit === 'inches' ? '28 - 29' : '71 - 74', hip: unit === 'inches' ? '38 - 39' : '96 - 99' },
    { size: 'L', bust: unit === 'inches' ? '37 - 39' : '94 - 99', waist: unit === 'inches' ? '30 - 32' : '76 - 81', hip: unit === 'inches' ? '40 - 42' : '101 - 106' },
    { size: 'XL', bust: unit === 'inches' ? '40 - 42' : '101 - 107', waist: unit === 'inches' ? '33 - 35' : '84 - 89', hip: unit === 'inches' ? '43 - 45' : '109 - 114' },
    { size: 'XXL', bust: unit === 'inches' ? '43 - 45' : '109 - 114', waist: unit === 'inches' ? '36 - 38' : '91 - 96', hip: unit === 'inches' ? '46 - 48' : '117 - 122' },
  ];

  const menData = [
    { size: 'S', chest: unit === 'inches' ? '36 - 38' : '91 - 96', waist: unit === 'inches' ? '30 - 31' : '76 - 79', neck: unit === 'inches' ? '14.5 - 15' : '37 - 38' },
    { size: 'M', chest: unit === 'inches' ? '39 - 41' : '99 - 104', waist: unit === 'inches' ? '32 - 33' : '81 - 84', neck: unit === 'inches' ? '15.5 - 16' : '39 - 41' },
    { size: 'L', chest: unit === 'inches' ? '42 - 44' : '107 - 112', waist: unit === 'inches' ? '34 - 36' : '86 - 91', neck: unit === 'inches' ? '16.5 - 17' : '42 - 43' },
    { size: 'XL', chest: unit === 'inches' ? '45 - 47' : '114 - 119', waist: unit === 'inches' ? '37 - 39' : '94 - 99', neck: unit === 'inches' ? '17.5 - 18' : '44 - 46' },
    { size: 'XXL', chest: unit === 'inches' ? '48 - 50' : '122 - 127', waist: unit === 'inches' ? '40 - 42' : '101 - 107', neck: unit === 'inches' ? '18.5 - 19' : '47 - 48' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E1D7] z-10 p-6 sm:p-8 my-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D7]">
              <div className="flex items-center gap-2.5">
                <Ruler className="w-5 h-5 text-[#6D212F]" />
                <h3 className="text-xl font-normal font-serif text-[#12100E]">Atelier Size & Measurements Guide</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-[#8C827A] hover:text-[#12100E] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-6 mb-4">
              <div className="flex rounded-lg bg-[#FAF8F5] p-1 border border-[#E8E1D7]">
                <button
                  onClick={() => setActiveTab('women')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'women'
                      ? 'bg-[#12100E] text-white shadow-xs'
                      : 'text-[#8C827A] hover:text-[#12100E]'
                  }`}
                >
                  Women’s Couture
                </button>
                <button
                  onClick={() => setActiveTab('men')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeTab === 'men'
                      ? 'bg-[#12100E] text-white shadow-xs'
                      : 'text-[#8C827A] hover:text-[#12100E]'
                  }`}
                >
                  Men’s Tailoring
                </button>
              </div>

              {/* Units Switcher */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8C827A]">Units:</span>
                <div className="flex rounded-lg bg-[#FAF8F5] p-1 border border-[#E8E1D7]">
                  <button
                    onClick={() => setUnit('inches')}
                    className={`px-3 py-1 text-xs font-semibold rounded ${
                      unit === 'inches' ? 'bg-white text-[#12100E] shadow-xs' : 'text-[#8C827A]'
                    }`}
                  >
                    Inches (in)
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-3 py-1 text-xs font-semibold rounded ${
                      unit === 'cm' ? 'bg-white text-[#12100E] shadow-xs' : 'text-[#8C827A]'
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E8E1D7]">
              {activeTab === 'women' ? (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#E8E1D7] text-[#8C827A] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3">Standard Size</th>
                      <th className="p-3">Bust ({unit})</th>
                      <th className="p-3">Waist ({unit})</th>
                      <th className="p-3">Hips ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E1D7]">
                    {womenData.map((row) => (
                      <tr key={row.size} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-3 font-bold text-[#12100E]">{row.size}</td>
                        <td className="p-3 text-[#4A453E]">{row.bust}</td>
                        <td className="p-3 text-[#4A453E]">{row.waist}</td>
                        <td className="p-3 text-[#4A453E]">{row.hip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] border-b border-[#E8E1D7] text-[#8C827A] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3">Standard Size</th>
                      <th className="p-3">Chest ({unit})</th>
                      <th className="p-3">Waist ({unit})</th>
                      <th className="p-3">Neck Collar ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E1D7]">
                    {menData.map((row) => (
                      <tr key={row.size} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-3 font-bold text-[#12100E]">{row.size}</td>
                        <td className="p-3 text-[#4A453E]">{row.chest}</td>
                        <td className="p-3 text-[#4A453E]">{row.waist}</td>
                        <td className="p-3 text-[#4A453E]">{row.neck}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Measuring Tips */}
            <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E1D7] text-xs text-[#4A453E] space-y-1.5">
              <p className="font-semibold text-[#12100E]">Atelier Fitting Advice:</p>
              <p>• If your measurements fall between two sizes, we recommend sizing up for a relaxed drape or sizing down for a contouring fit.</p>
              <p>• For bespoke tailoring consultations, contact our client concierge.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
