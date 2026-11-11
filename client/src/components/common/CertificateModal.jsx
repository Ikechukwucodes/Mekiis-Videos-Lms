import React from 'react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';
import { Award, GraduationCap, Printer, CheckCircle, Sparkles } from 'lucide-react';

export const CertificateModal = ({
  isOpen,
  onClose,
  courseTitle,
  studentName,
  instructorName,
  completedDate = new Date().toLocaleDateString()
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Course 100% Completed
        </div>

        {/* Certificate Card */}
        <div className="p-8 rounded-3xl border-4 border-double border-amber-300 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 shadow-lg text-slate-900 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-amber-300 text-2xl font-serif">❖</div>
          <div className="absolute top-2 right-2 text-amber-300 text-2xl font-serif">❖</div>
          <div className="absolute bottom-2 left-2 text-amber-300 text-2xl font-serif">❖</div>
          <div className="absolute bottom-2 right-2 text-amber-300 text-2xl font-serif">❖</div>

          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-4 p-2 shadow-md shadow-slate-900/20">
            <img src="/logo-mark.png" alt="Mekiis Videos" className="w-full h-full object-contain" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Certificate of Completion
          </span>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2 font-serif">
            Mekiis Videos Academy
          </h2>

          <p className="text-xs text-slate-500 mt-4">This document certifies that</p>
          <div className="text-2xl font-extrabold text-brand-700 mt-1 border-b border-slate-200 pb-2 max-w-sm mx-auto">
            {studentName || 'Alex Morgan'}
          </div>

          <p className="text-xs text-slate-500 mt-3">has successfully completed the comprehensive curriculum for</p>
          <h3 className="text-lg font-bold text-slate-900 mt-1">{courseTitle}</h3>

          <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Instructor</span>
              <strong className="text-slate-800 font-semibold">{instructorName || 'Mekiis Videos Instructor'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Date Issued</span>
              <strong className="text-slate-800 font-semibold">{completedDate}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" icon={Printer} onClick={handlePrint}>
            Print / Save Certificate
          </Button>
        </div>
      </div>
    </Modal>
  );
};
