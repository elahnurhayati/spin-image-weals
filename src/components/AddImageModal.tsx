import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { WheelItem } from '../types';
import { defaultFramingSettings } from '../data/defaultPresets';

interface AddImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (item: WheelItem) => void;
}

export const AddImageModal: React.FC<AddImageModalProps> = ({
  isOpen,
  onClose,
  onAddImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Silakan pilih file gambar yang valid (JPG, PNG, WEBP).');
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageName(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  // Open device camera
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setErrorMessage('Kamera tidak dapat diakses atau izin ditolak.');
    }
  };

  // Capture snapshot from camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setImagePreview(dataUrl);
    setImageName(`Foto_${new Date().toLocaleTimeString().replace(/:/g, '-')}`);

    // Stop camera
    stopCamera();
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Handle URL input
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    const img = new Image();
    img.onload = () => {
      setImagePreview(urlInput.trim());
      setImageName('Gambar URL');
      setShowUrlInput(false);
      setErrorMessage(null);
    };
    img.onerror = () => {
      setErrorMessage('Gagal memuat gambar dari URL tersebut.');
    };
    img.src = urlInput.trim();
  };

  // Save new image to wheel
  const handleSave = () => {
    if (!imagePreview) return;

    const newItem: WheelItem = {
      id: `custom-${Date.now()}`,
      name: imageName.trim() || 'Gambar Kustom',
      url: imagePreview,
      isFavorite: false,
      isActive: true,
      isCustom: true,
      settings: {
        ...defaultFramingSettings,
        zoom: 1.05, // Slight default zoom to guarantee full gapless wedge
      },
    };

    onAddImage(newItem);
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setImagePreview(null);
    setImageName('');
    setShowUrlInput(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md flex flex-col bg-[#07130e] border border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(0,230,118,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/20 bg-[#091b14]/70">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white tracking-wide">
              Tambah Gambar
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-medium">Roda & Galeri</span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-white ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Camera View Mode */}
          {isCameraActive ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 aspect-square bg-black flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-lg hover:bg-emerald-400 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Jepret Foto
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-white font-semibold text-sm hover:bg-neutral-700"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Primary Action Buttons: Upload & Camera */}
              <div className="grid grid-cols-2 gap-3">
                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-[#0b2118] border border-emerald-500/30 hover:border-emerald-400 hover:bg-[#0e291e] hover:shadow-[0_0_20px_rgba(0,230,118,0.25)] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Upload dari File
                  </span>
                  <span className="text-[11px] text-emerald-400/70">
                    JPG, PNG, WEBP
                  </span>
                </button>

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-[#0b2118] border border-emerald-500/30 hover:border-emerald-400 hover:bg-[#0e291e] hover:shadow-[0_0_20px_rgba(0,230,118,0.25)] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Ambil Foto
                  </span>
                  <span className="text-[11px] text-emerald-400/70">
                    Gunakan Kamera
                  </span>
                </button>
              </div>

              {/* URL Input Toggle */}
              <div>
                {!showUrlInput ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="w-full text-center text-xs text-emerald-400/80 hover:text-emerald-300 py-1 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    Atau gunakan tautan URL gambar web
                  </button>
                ) : (
                  <form onSubmit={handleUrlSubmit} className="flex gap-2 mt-2">
                    <input
                      type="url"
                      placeholder="https://example.com/gambar.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 bg-[#091b14] border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400"
                    >
                      Muat
                    </button>
                  </form>
                )}
              </div>

              {/* Preview Added Image */}
              {imagePreview && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                      Gambar yang Ditambahkan
                    </label>
                    <span className="text-[11px] text-emerald-400/80">
                      Otomatis Full Tanpa Celah
                    </span>
                  </div>

                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-[0_0_25px_rgba(0,230,118,0.3)] bg-black/60 group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
                      title="Hapus gambar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">
                      Nama Label Gambar
                    </label>
                    <input
                      type="text"
                      value={imageName}
                      onChange={(e) => setImageName(e.target.value)}
                      placeholder="Masukkan nama gambar..."
                      className="w-full bg-[#091b14] border border-emerald-500/30 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-emerald-500/20 bg-[#06140e]">
          <button
            type="button"
            disabled={!imagePreview}
            onClick={handleSave}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              imagePreview
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black shadow-[0_0_24px_rgba(0,230,118,0.5)] hover:shadow-[0_0_35px_rgba(0,230,118,0.8)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                : 'bg-emerald-950/40 text-emerald-500/40 border border-emerald-900/30 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            Simpan ke Roda
          </button>
        </div>
      </div>
    </div>
  );
};
