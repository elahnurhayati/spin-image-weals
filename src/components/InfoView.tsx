import React from 'react';
import {
  HelpCircle,
  Maximize2,
  UploadCloud,
  Sliders,
  CheckCircle2,
  Sparkles,
  Smartphone,
  PlayCircle,
} from 'lucide-react';

export const InfoView: React.FC = () => {
  const features = [
    {
      icon: <Maximize2 className="w-6 h-6 text-emerald-400" />,
      title: 'Full Gambar (Tanpa Celah)',
      desc: 'Setiap bagian irisan roda dan layar hasil dioptimalkan dengan pemotongan presisi tinggi tanpa ada celah kosong.',
    },
    {
      icon: <UploadCloud className="w-6 h-6 text-emerald-400" />,
      title: 'Upload Gambar Langsung',
      desc: 'Bisa upload foto dari galeri HP / komputer atau gunakan kamera secara real-time langsung masuk ke dalam roda.',
    },
    {
      icon: <Sliders className="w-6 h-6 text-emerald-400" />,
      title: 'Setting Posisi Presisi',
      desc: 'Tersedia grid jangkar 9-arah, zoom, rotasi, dan penyesuaian sumbu X/Y agar foto fokus tepat pada bagian wajah atau objek utama.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
      title: 'Latar Belakang Adaptif',
      desc: 'Setelah roda berputar dan memilih gambar, latar belakang aplikasi seketika berubah mengikuti visual gambar yang menang.',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 space-y-6 pb-24">
      {/* Header */}
      <div className="border-b border-emerald-500/20 pb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          Tentang & Petunjuk Penggunaan
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Panduan lengkap memaksimalkan Image Picker Wheel
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#071710] border border-emerald-500/25 flex flex-col gap-2.5 shadow-[0_0_15px_rgba(0,230,118,0.06)]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              {feat.icon}
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              {feat.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* How to Play Steps */}
      <div className="bg-[#071710] p-5 rounded-2xl border border-emerald-500/20 space-y-4">
        <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-emerald-400" />
          Cara Bermain
        </h3>

        <ol className="space-y-3 text-xs text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span>
              <strong>Pilih Gambar:</strong> Buka tab <em>Galeri</em> untuk memilih gambar mana saja yang ingin disertakan ke dalam roda putar.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span>
              <strong>Putar Roda:</strong> Tekan tombol <span className="text-emerald-400 font-bold">SPIN</span> di tengah roda atau tombol hijau di bawah untuk memulai putaran.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span>
              <strong>Lihat Keajaiban:</strong> Roda melambat secara halus, mengeluarkan bunyi detak, lalu gambar pemenang terpilih. Latar belakang aplikasi otomatis berubah mengikuti gambar pemenang!
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <span>
              <strong>Simpan & Bagikan:</strong> Unduh gambar pemenang ke memori perangkat atau bagikan ke teman.
            </span>
          </li>
        </ol>
      </div>

      {/* Callout Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0a271c] to-emerald-950/80 border border-emerald-500/40 text-center space-y-1">
        <span className="text-sm font-extrabold text-emerald-300 tracking-wider">
          PILIH GAMBAR, RASAKAN KEJUTANNYA!
        </span>
        <p className="text-[11px] text-slate-400">
          Nikmati pengalaman interaktif wheel picker dengan visual neon emerald premium.
        </p>
      </div>
    </div>
  );
};
