import React, { useEffect, useRef, useState, useCallback } from 'react';
import { WheelItem, AnchorPosition } from '../types';
import { getCachedImage, preloadAllImages } from '../utils/imageCache';
import { soundManager } from '../utils/audio';

import { ThemePalette, DEFAULT_EMERALD_THEME } from '../utils/colorExtractor';

interface WheelCanvasProps {
  items: WheelItem[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (winner: WheelItem) => void;
  spinDuration?: number;
  soundEnabled?: boolean;
  theme?: ThemePalette;
}

export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  items,
  isSpinning,
  onSpinStart,
  onSpinEnd,
  spinDuration = 4.5,
  soundEnabled = true,
  theme = DEFAULT_EMERALD_THEME,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imagesReady, setImagesReady] = useState(false);
  const [pointerBounce, setPointerBounce] = useState(false);

  // Wheel physics state stored in refs to avoid re-renders during high-fps animation
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const startAngleRef = useRef(0);
  const startTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTickIndexRef = useRef<number>(-1);

  // Preload all item images whenever items change
  useEffect(() => {
    let isMounted = true;
    const urls = items.map((i) => i.url);
    preloadAllImages(urls).then(() => {
      if (isMounted) setImagesReady(true);
    });
    return () => {
      isMounted = false;
    };
  }, [items]);

  // Anchor offset calculation helper
  const getAnchorOffsets = (anchor: AnchorPosition, size: number) => {
    const shift = size * 0.18;
    switch (anchor) {
      case 'top-left':
        return { x: -shift, y: -shift };
      case 'top':
        return { x: 0, y: -shift };
      case 'top-right':
        return { x: shift, y: -shift };
      case 'left':
        return { x: -shift, y: 0 };
      case 'center':
        return { x: 0, y: 0 };
      case 'right':
        return { x: shift, y: 0 };
      case 'bottom-left':
        return { x: -shift, y: shift };
      case 'bottom':
        return { x: 0, y: shift };
      case 'bottom-right':
        return { x: shift, y: shift };
      default:
        return { x: 0, y: 0 };
    }
  };

  // Render function that draws the entire wheel onto the canvas
  const drawWheel = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) / 2 - 16;
      if (radius <= 10) {
        ctx.restore();
        return;
      }

      const totalItems = items.length;
      if (totalItems === 0) {
        ctx.restore();
        return;
      }

      const sliceAngle = (Math.PI * 2) / totalItems;

      // 1. Draw Outer Glowing Ring & Shadow
      ctx.save();
      ctx.shadowColor = theme.glowStrong;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Outer bezel accent ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 2. Draw Each Slice With Gap-Free Full Image Clipping
      for (let i = 0; i < totalItems; i++) {
        const item = items[i];
        const startA = angle + i * sliceAngle;
        const endA = startA + sliceAngle;
        const midA = (startA + endA) / 2;

        ctx.save();

        // Clip EXACT wedge path
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startA, endA);
        ctx.closePath();
        ctx.clip();

        // Wedge background fallback color (gradient of cyber dark emerald)
        const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
        bgGrad.addColorStop(0, '#062015');
        bgGrad.addColorStop(1, '#020d08');
        ctx.fillStyle = bgGrad;
        ctx.fill();

        // Render Image inside wedge
        const img = getCachedImage(item.url);
        if (img) {
          ctx.save();

          // Transform to slice center facing radially outward
          ctx.translate(cx, cy);
          ctx.rotate(midA + Math.PI / 2);

          // Center of the wedge radially
          const radialCenter = -radius * 0.55;
          ctx.translate(0, radialCenter);

          // User Framing Parameters
          const settings = item.settings;
          const userZoom = (settings?.zoom || 1.0) * (settings?.scale || 1.0);
          const userRotation = ((settings?.rotation || 0) * Math.PI) / 180;
          const anchorOffset = getAnchorOffsets(settings?.anchor || 'center', radius);
          const panX = ((settings?.offsetX || 0) / 100) * (radius * 0.35) + anchorOffset.x;
          const panY = ((settings?.offsetY || 0) / 100) * (radius * 0.35) + anchorOffset.y;

          ctx.translate(panX, panY);
          ctx.rotate(userRotation);

          // Full cover size calculation (ensuring 0 gaps across the entire wedge sector)
          const baseSize = Math.max(radius * 1.35, radius * 2.2 * Math.sin(sliceAngle / 2) + 60);
          const drawW = baseSize * userZoom;
          const drawH = baseSize * userZoom;

          // Smooth image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw the image centered
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

          // Subtle radial dark gradient overlay from center outward for depth & hub integration
          const innerShadow = ctx.createLinearGradient(0, radius * 0.5, 0, -radius * 0.5);
          innerShadow.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
          innerShadow.addColorStop(0.3, 'rgba(0, 0, 0, 0.0)');
          innerShadow.addColorStop(0.9, 'rgba(0, 0, 0, 0.15)');
          innerShadow.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
          ctx.fillStyle = innerShadow;
          ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);

          ctx.restore();
        }

        // Draw Wedge Dividers (Neon Hairline)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(startA) * radius, cy + Math.sin(startA) * radius);
        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.restore();
      }

      // 3. Draw Inner Wheel Hub (Center "SPIN" Ring)
      const hubRadius = Math.max(38, radius * 0.24);

      // Dark obsidian hub base
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#06130d';
      ctx.fill();

      // Hub Outer Neon Ring
      ctx.shadowColor = theme.glowStrong;
      ctx.shadowBlur = 16;
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hub Inner Ring
      ctx.beginPath();
      ctx.arc(cx, cy, hubRadius - 5, 0, Math.PI * 2);
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.stroke();

      // "SPIN" Text in Hub
      ctx.font = `800 ${Math.round(hubRadius * 0.48)}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = theme.primary;
      ctx.shadowColor = theme.glowStrong;
      ctx.shadowBlur = 10;
      ctx.fillText('SPIN', cx, cy + 1);

      ctx.restore();

      ctx.restore();
    },
    [items, theme]
  );

  // Animation Loop for Wheel Spinning with realistic deceleration
  useEffect(() => {
    if (!isSpinning) {
      drawWheel(currentAngleRef.current);
      return;
    }

    // Launch sound
    if (soundEnabled) {
      soundManager.playWhoosh();
    }

    const totalItems = items.length;
    const sliceAngle = (Math.PI * 2) / totalItems;

    // Pick a random winner index (0 to totalItems - 1)
    const winnerIndex = Math.floor(Math.random() * totalItems);

    // Calculate target angle so the winning slice aligns under the top pointer (angle = -PI/2)
    // Pointer is at top: theta = -PI/2 = 3PI/2
    // Midpoint of winner slice in local coords is (winnerIndex + 0.5) * sliceAngle
    // So currentAngle + (winnerIndex + 0.5)*sliceAngle = -PI/2 (mod 2PI)
    // Therefore targetAngle = -PI/2 - (winnerIndex + 0.5)*sliceAngle + fullRotations
    const fullRotations = (5 + Math.floor(Math.random() * 4)) * (Math.PI * 2);
    const targetSliceMid = -Math.PI / 2 - (winnerIndex + 0.5) * sliceAngle;
    
    // Normalize target angle ahead of currentAngle
    let delta = (targetSliceMid - (currentAngleRef.current % (Math.PI * 2))) % (Math.PI * 2);
    if (delta < 0) delta += Math.PI * 2;
    const finalTargetAngle = currentAngleRef.current + fullRotations + delta;

    targetAngleRef.current = finalTargetAngle;
    startAngleRef.current = currentAngleRef.current;
    startTimeRef.current = performance.now();
    lastTickIndexRef.current = -1;

    const durationMs = spinDuration * 1000;

    // Quintic ease out for a very satisfying spin deceleration
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);
      const easedProgress = easeOutQuint(progress);

      const angleNow = startAngleRef.current + (targetAngleRef.current - startAngleRef.current) * easedProgress;
      currentAngleRef.current = angleNow;

      // Track tick sounds when a slice boundary passes the top pointer
      // Pointer is at -PI/2
      const pointerNormalizedAngle = ((-Math.PI / 2 - angleNow) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      const currentSliceIdx = Math.floor(pointerNormalizedAngle / sliceAngle) % totalItems;

      if (currentSliceIdx !== lastTickIndexRef.current) {
        lastTickIndexRef.current = currentSliceIdx;
        const velocityRatio = 1 - progress;
        if (soundEnabled && progress < 0.98) {
          soundManager.playTick(velocityRatio);
        }
        // Micro-bounce pointer
        setPointerBounce(true);
        setTimeout(() => setPointerBounce(false), 50);
      }

      drawWheel(angleNow);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        const winningItem = items[winnerIndex];
        if (soundEnabled) {
          soundManager.playWin();
        }
        onSpinEnd(winningItem);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSpinning, items, onSpinEnd, drawWheel, soundEnabled, spinDuration]);

  // Handle Canvas Resize and Redraw
  useEffect(() => {
    const handleResize = () => {
      drawWheel(currentAngleRef.current);
    };
    window.addEventListener('resize', handleResize);
    drawWheel(currentAngleRef.current);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawWheel, imagesReady]);

  // Center hub click handler
  const handleWheelClick = () => {
    if (!isSpinning) {
      if (soundEnabled) soundManager.playClick();
      onSpinStart();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full max-w-[440px] aspect-square mx-auto my-2 select-none"
    >
      {/* Top Pointer Indicator with Neon Arrow & Drop Shadow */}
      <div
        className={`absolute -top-3 z-30 flex flex-col items-center pointer-events-none transition-transform duration-75 ${
          pointerBounce ? '-translate-y-1 scale-110' : 'translate-y-0 scale-100'
        }`}
      >
        <div className="relative">
          {/* Glowing Neon Arrow Pointing Down */}
          <svg
            width="36"
            height="32"
            viewBox="0 0 36 32"
            fill="none"
            style={{ filter: `drop-shadow(0 0 14px ${theme.glowStrong})` }}
          >
            <path
              d="M18 30L3 4C1.5 1.5 3 0 6 0H30C33 0 34.5 1.5 33 4L18 30Z"
              fill={theme.primary}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            {/* Center diamond spark */}
            <circle cx="18" cy="9" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Main Wheel Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleWheelClick}
        className="w-full h-full cursor-pointer touch-none active:scale-[0.99] transition-transform"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
