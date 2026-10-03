import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createStudioEnvironment,
  createScissorMesh,
  createCombMesh,
  createClipMesh,
  createRazorMesh,
  createParticleDustField,
} from '../utils/threeHelpers';
import { audioManager } from '../utils/audioManager';
import { Scissors } from 'lucide-react';

export default function PreHeroCutComb({ onIntroProgress, onIntroComplete }) {
  const canvasRef = useRef(null);
  const [displayProgress, setDisplayProgress] = useState(0); // 0 to 1 (Cut phase)
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const scissorObjRef = useRef(null);
  const combGroupRef = useRef(null);
  const clipGroupRef = useRef(null);
  const razorGroupRef = useRef(null);
  const dustFieldRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const animFrameRef = useRef(null);

  // Smooth lerp progress state
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastDisplayProgressRef = useRef(0);
  const hasCompletedRef = useRef(false);

  const hasTriggeredSnipSoundRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    let isDisposed = false;
    let cleanupFn = null;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;

    const setupWebGL = () => {
      if (isDisposed || !canvasRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1. Scene & Camera & Audio Auto-Init
      audioManager.init();

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 11.5 : 8.2);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // 3. Studio Reflections Environment Map
    const envMap = createStudioEnvironment(renderer);
    scene.environment = envMap;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.SpotLight(0xf4e295, 14, 30, Math.PI / 4, 0.3, 1.2);
    goldKeyLight.position.set(5, 7, 7);
    scene.add(goldKeyLight);

    const coolRimLight = new THREE.DirectionalLight(0xaad4ff, 5.0);
    coolRimLight.position.set(-7, -4, 5);
    scene.add(coolRimLight);

    const rosePoint = new THREE.PointLight(0xc98993, 6, 20);
    rosePoint.position.set(0, -3, 4);
    scene.add(rosePoint);

    // 5. 3D Models (Calibrated for desktop landscape & mobile portrait)
    const scissorScale = isMobile ? 1.05 : 1.45;
    const scissorObj = createScissorMesh(envMap);
    scissorObj.group.position.set(0, 0, 0);
    scissorObj.group.scale.set(scissorScale, scissorScale, scissorScale);
    scene.add(scissorObj.group);
    scissorObjRef.current = scissorObj;

    const combMesh = createCombMesh(envMap);
    combMesh.position.set(isMobile ? -1.8 : -3.4, isMobile ? 2.4 : 1.9, -1.2);
    combMesh.rotation.set(0.2, 0.4, -0.35);
    scene.add(combMesh);
    combGroupRef.current = combMesh;

    const clipMesh = createClipMesh(envMap);
    clipMesh.position.set(isMobile ? 1.8 : 3.5, isMobile ? 2.4 : 1.8, -1.4);
    clipMesh.rotation.set(-0.3, -0.5, 0.6);
    scene.add(clipMesh);
    clipGroupRef.current = clipMesh;

    const razorMesh = createRazorMesh(envMap);
    razorMesh.position.set(isMobile ? 1.6 : 3.0, isMobile ? -2.5 : -2.2, -1.0);
    razorMesh.rotation.set(0.4, 0.2, -0.4);
    scene.add(razorMesh);
    razorGroupRef.current = razorMesh;

    const dustField = createParticleDustField(isMobile ? 96 : 200);
    scene.add(dustField.group);
    dustFieldRef.current = dustField;

    // 6. Mouse & Touch Parallax
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleTouchParallax = (e) => {
      if (e.touches && e.touches[0]) {
        mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 1.5;
        mouseRef.current.targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 1.5;
      }
    };
    window.addEventListener('touchmove', handleTouchParallax, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMob = w < 768;
      camera.position.z = isMob ? 11.5 : 8.2;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop with Ultra-Smooth Butter Easing
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Silky smooth progress lerp for cut phase
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.075;
      const p = currentProgressRef.current;
      if (Math.abs(p - lastDisplayProgressRef.current) > 0.005 || p >= 0.96) {
        lastDisplayProgressRef.current = p;
        setDisplayProgress(p);
      }

      onIntroProgress?.(p);

      // Once completed, lock permanently to true
      if (p >= 0.96 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setIsCompleted(true);
        onIntroComplete?.();
      }

      // Sound trigger on downward snip closure (~0.45)
      if (p >= 0.42 && !hasTriggeredSnipSoundRef.current && targetProgressRef.current > 0.35) {
        hasTriggeredSnipSoundRef.current = true;
        audioManager.playScissorSnip(1.0);
      }

      // Mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      // Scissor blade kinematics
      if (scissorObjRef.current) {
        const scissor = scissorObjRef.current;
        const bladeAngle = Math.max(0, 0.38 * (1 - (p / 0.55)));
        scissor.setOpenAngle(bladeAngle);

        scissor.group.position.x = mouseRef.current.x * 0.3 + (p > 0.25 ? (p - 0.25) * 5.2 : 0);
        scissor.group.position.y = -mouseRef.current.y * 0.2 + Math.sin(elapsedTime * 1.3) * 0.06;
        scissor.group.position.z = p * 2.4;

        scissor.group.rotation.z = -0.1 + mouseRef.current.x * 0.1 + (p > 0.2 ? (p - 0.2) * 0.5 : 0);
        scissor.group.rotation.y = mouseRef.current.x * 0.2;
        scissor.group.rotation.x = mouseRef.current.y * 0.15;
      }

      // Comb horizontal rake
      if (combGroupRef.current) {
        const comb = combGroupRef.current;
        comb.position.x = -3.4 + p * 8.8 + mouseRef.current.x * 0.2;
        comb.position.y = 1.9 - p * 2.0 + Math.cos(elapsedTime * 1.1) * 0.05;
        comb.rotation.z = -0.35 + p * 0.45;
      }

      // Clips & Razor float
      if (clipGroupRef.current) {
        clipGroupRef.current.position.y = 1.8 + Math.sin(elapsedTime * 1.5 + 1) * 0.1 - p * 2.5;
      }
      if (razorGroupRef.current) {
        razorGroupRef.current.position.y = -2.2 + Math.cos(elapsedTime * 1.4 + 2) * 0.1 - p * 2.0;
      }

      if (dustFieldRef.current) {
        dustFieldRef.current.group.rotation.y = elapsedTime * 0.025 + mouseRef.current.x * 0.1;
      }

      renderer.render(scene, camera);
    };

      cleanupFn = () => {
        cancelAnimationFrame(animFrameRef.current);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        envMap.dispose();
        scene.traverse((object) => {
          object.geometry?.dispose?.();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material?.dispose?.());
        });
        renderer.dispose();
      };
    };

    const timer = setTimeout(setupWebGL, isMobile ? 60 : 0);

    return () => {
      isDisposed = true;
      clearTimeout(timer);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  // Smooth wheel & touch interaction to scrub the cut
  useEffect(() => {
    if (isCompleted) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targetProgressRef.current = 1;
      currentProgressRef.current = 1;
      lastDisplayProgressRef.current = 1;
      hasCompletedRef.current = true;
      setDisplayProgress(1);
      setIsCompleted(true);
      onIntroProgress?.(1);
      onIntroComplete?.();
      return undefined;
    }

    const handleWheel = (e) => {
      if (hasCompletedRef.current) return;
      if (e.deltaY > 0) {
        targetProgressRef.current = Math.min(1.0, targetProgressRef.current + e.deltaY * 0.0022);
      }
    };

    let startTouchY = 0;
    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        startTouchY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e) => {
      if (hasCompletedRef.current) return;
      if (!e.touches || !e.touches[0]) return;
      const currentTouchY = e.touches[0].clientY;
      const deltaY = startTouchY - currentTouchY;
      if (deltaY > 12) {
        targetProgressRef.current = Math.min(1.0, targetProgressRef.current + deltaY * 0.008);
        if (targetProgressRef.current > 0.12) {
          targetProgressRef.current = 1.0;
        }
        startTouchY = currentTouchY;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isCompleted]);

  // Clean unmount after fade-out transition finishes
  useEffect(() => {
    if (isCompleted) {
      const timer = setTimeout(() => {
        setIsUnmounted(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  // Smooth trigger on clicking the text, button, or screen
  const handleInstantOpen = () => {
    if (hasCompletedRef.current) return;
    audioManager.playScissorSnip(1.1);
    targetProgressRef.current = 1.0;
  };

  if (isUnmounted) return null;

  const isFullyOpen = displayProgress >= 0.95 || isCompleted;

  return (
    <div
      onClick={handleInstantOpen}
      onTouchEnd={(e) => {
        // Tap anywhere on mobile opens the curtain
        handleInstantOpen();
      }}
      className="fixed inset-0 z-50 h-[100svh] w-screen overflow-hidden select-none bg-[#070709] transition-opacity duration-700 cursor-pointer touch-none"
      style={{
        pointerEvents: isFullyOpen ? 'none' : 'auto',
        opacity: isFullyOpen ? 0 : 1,
      }}
      aria-label="City Scissor introduction"
    >
      {/* 3D WebGL Canvas for Floating Props (fades in as cut starts) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        style={{
          opacity: displayProgress > 0 ? Math.min(1, displayProgress * 15) * Math.max(0, 1 - displayProgress * 1.1) : 0,
        }}
      />

      {/* Splitting Left Curtain Wing (Ahmedabad City - Left 50%) */}
      <div
        className="absolute inset-0 w-full h-full origin-top-left transition-transform duration-100 ease-out pointer-events-auto z-10 overflow-hidden"
        style={{
          transform: `translateX(-${displayProgress * 110}%) rotate(-${displayProgress * 4}deg)`,
          clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
        }}
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <source media="(max-width: 767px)" type="image/webp" srcSet="/images/Ahmedabad_City_Mobile_720.webp" />
          <source media="(max-width: 767px)" type="image/jpeg" srcSet="/images/Ahmedabad_City_Mobile.jpg" />
          <source type="image/webp" srcSet="/images/Ahmedabad_City.webp" />
          <img
            src="/images/Ahmedabad_City.jpg"
            alt="Ahmedabad City"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent sm:from-black/75 sm:via-black/35" />
        <div className="absolute left-[50%] -translate-x-full top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent shadow-[0_0_25px_#D4AF37]" />
      </div>

      {/* Splitting Right Curtain Wing (Ahmedabad City - Right 50%) */}
      <div
        className="absolute inset-0 w-full h-full origin-top-right transition-transform duration-100 ease-out pointer-events-auto z-10 overflow-hidden"
        style={{
          transform: `translateX(${displayProgress * 110}%) rotate(${displayProgress * 4}deg)`,
          clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
        }}
      >
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none">
          <source media="(max-width: 767px)" type="image/webp" srcSet="/images/Ahmedabad_City_Mobile_720.webp" />
          <source media="(max-width: 767px)" type="image/jpeg" srcSet="/images/Ahmedabad_City_Mobile.jpg" />
          <source type="image/webp" srcSet="/images/Ahmedabad_City.webp" />
          <img
            src="/images/Ahmedabad_City.jpg"
            alt="Ahmedabad City"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/15 to-transparent sm:from-black/75 sm:via-black/35" />
        <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent shadow-[0_0_25px_#D4AF37]" />
      </div>

      {/* Center Laser Hair-Parting Line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: displayProgress > 0.02 && displayProgress < 0.85 ? 1 : 0,
          background: 'linear-gradient(180deg, transparent, #F4E295, #D4AF37, transparent)',
          boxShadow: '0 0 30px #D4AF37, 0 0 60px #F4E295',
        }}
      />

      {/* Editorial City Scissor Intro Title (Positioned in the middle of the page below AHMEDABAD text) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pt-28 xs:pt-32 sm:pt-28 md:pt-36 lg:pt-40 pointer-events-none z-30 transition-all duration-300 px-4 sm:px-6 text-center"
        style={{
          opacity: Math.max(0, 1 - displayProgress * 12),
          transform: `scale(${1 - displayProgress * 0.15}) translateY(-${displayProgress * 40}px)`,
        }}
      >
        <div className="relative px-4 sm:px-10 py-3 sm:py-6 rounded-3xl flex flex-col items-center max-w-[95vw]">
          {/* Subtle atmospheric radial vignette to separate title from busy city buildings */}
          <div
            className="absolute inset-0 -z-10 rounded-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(7,7,9,0.85) 0%, rgba(7,7,9,0.5) 55%, transparent 80%)',
              filter: 'blur(10px)',
            }}
          />

          <h1 className="font-cinzel text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-widest text-white select-none drop-shadow-[0_10px_35px_rgba(0,0,0,1)]">
            CITY <span className="gold-gradient-text">SCISSOR</span>
          </h1>

          <p className="mt-2.5 sm:mt-4 text-[9px] xs:text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.16em] sm:tracking-[0.35em] text-[#E6CA65] font-mono font-semibold drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] flex items-center justify-center gap-1.5 sm:gap-3">
            <span className="w-4 sm:w-10 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span>Luxury Unisex Salon • Ambawadi</span>
            <span className="w-4 sm:w-10 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </p>
        </div>
      </div>

      {/* Bottom Control (Progress Scrubber & Enter Button) */}
      <div
        className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 sm:gap-4 z-30 transition-opacity duration-300 pointer-events-auto w-full px-6 max-w-sm"
        style={{
          opacity: Math.max(0, 1 - displayProgress * 2.5),
        }}
      >
        {/* Progress Scrubber */}
        <div className="w-56 xs:w-64 sm:w-80 h-2 sm:h-2.5 bg-[#171722] rounded-full overflow-hidden border border-[#D4AF37]/40 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F4E295] to-[#D4AF37] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${Math.max(6, displayProgress * 100)}%` }}
          />
        </div>

        {/* Enter Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleInstantOpen();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            handleInstantOpen();
          }}
          className="btn-gold pill-large w-full max-w-[260px] sm:max-w-none font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-transform cursor-pointer overflow-hidden touch-manipulation"
        >
          <Scissors className="w-4 h-4 text-black shrink-0" />
          <span>ENTER SALON</span>
        </button>

        <p className="text-[10px] sm:text-xs text-[#E6CA65]/80 tracking-[0.2em] uppercase font-mono">
          Tap or swipe to enter
        </p>
      </div>

    </div>
  );
}
