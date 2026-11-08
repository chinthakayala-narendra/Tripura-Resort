import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PANORAMA_SCENES } from '../data/resortData';
import { PanoramaScene, HotspotPin } from '../types';
import {
  Compass,
  RotateCw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Bed,
  UtensilsCrossed,
  Sparkles,
  Info,
  ArrowRight,
  Eye,
  Layers,
} from 'lucide-react';

interface Panorama360ViewerProps {
  onSelectRoom?: (slug: string) => void;
  onOpenDining?: () => void;
  onOpenBanquet?: () => void;
}

export const Panorama360Viewer: React.FC<Panorama360ViewerProps> = ({
  onSelectRoom,
  onOpenDining,
  onOpenBanquet,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string>('lagoon-aerial');
  const [activeHotspot, setActiveHotspot] = useState<HotspotPin | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [headingAngle, setHeadingAngle] = useState<number>(0);
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    { id: string; x: number; y: number; visible: boolean; spot: HotspotPin }[]
  >([]);

  const currentScene: PanoramaScene =
    PANORAMA_SCENES.find((s) => s.id === currentSceneId) || PANORAMA_SCENES[0];

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());

  // Spherical coordinate state
  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(currentScene.defaultYaw);
  const latRef = useRef(currentScene.defaultPitch);
  const fovRef = useRef(75);
  const autoRotateRef = useRef(true);

  // Sync state
  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  // Texture loading helper
  const loadSceneTexture = useCallback((imageUrl: string) => {
    if (!sphereRef.current) return;
    textureLoaderRef.current.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        if (sphereRef.current) {
          const material = sphereRef.current.material as THREE.MeshBasicMaterial;
          material.map = texture;
          material.needsUpdate = true;
        }
      },
      undefined,
      (err) => console.error('Failed to load panorama texture:', err)
    );
  }, []);

  // Update hotspots 2D screen positions based on 3D spherical angles
  const updateHotspotPositions = useCallback(() => {
    if (!cameraRef.current || !containerRef.current) return;
    const camera = cameraRef.current;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const positions = currentScene.hotspots.map((spot) => {
      // Convert pitch & yaw to 3D Cartesian coordinates on sphere radius 450
      const phi = THREE.MathUtils.degToRad(90 - spot.pitch);
      const theta = THREE.MathUtils.degToRad(spot.yaw);

      const vector = new THREE.Vector3(
        450 * Math.sin(phi) * Math.sin(theta),
        450 * Math.cos(phi),
        450 * Math.sin(phi) * Math.cos(theta)
      );

      // Check if point is in front of camera
      const ray = vector.clone().sub(camera.position);
      const dot = ray.dot(camera.getWorldDirection(new THREE.Vector3()));
      const isInFront = dot > 0;

      vector.project(camera);

      const x = ((vector.x + 1) * width) / 2;
      const y = ((-vector.y + 1) * height) / 2;

      return {
        id: spot.id,
        x,
        y,
        visible: isInFront && x >= 0 && x <= width && y >= 0 && y <= height,
        spot,
      };
    });

    setHotspotScreenPositions(positions);
  }, [currentScene]);

  // Mount Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    const targetVector = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // Clear previous children
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Inverted Sphere geometry for 360 projection
    const geometry = new THREE.SphereGeometry(500, 64, 32);
    geometry.scale(-1, 1, 1); // Invert faces to view from inside
    const material = new THREE.MeshBasicMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Load initial scene
    loadSceneTexture(currentScene.imageUrl);
    lonRef.current = currentScene.defaultYaw;
    latRef.current = currentScene.defaultPitch;

    // 5. Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isUserInteractingRef.current && autoRotateRef.current) {
        lonRef.current += 0.08;
      }

      // Constrain latitude between -85 and 85 deg
      latRef.current = Math.max(-85, Math.min(85, latRef.current));

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      targetVector.x = 500 * Math.sin(phi) * Math.sin(theta);
      targetVector.y = 500 * Math.cos(phi);
      targetVector.z = 500 * Math.sin(phi) * Math.cos(theta);

      camera.lookAt(targetVector);
      renderer.render(scene, camera);

      // Track compass heading
      const normalizedYaw = ((lonRef.current % 360) + 360) % 360;
      setHeadingAngle(Math.round(normalizedYaw));

      // Calculate hotspot projected screen coordinates
      updateHotspotPositions();
    };
    animate();

    // 6. Resize handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [loadSceneTexture, updateHotspotPositions]);

  // Handle scene change
  const handleSceneChange = (scene: PanoramaScene) => {
    setCurrentSceneId(scene.id);
    setActiveHotspot(null);
    lonRef.current = scene.defaultYaw;
    latRef.current = scene.defaultPitch;
    loadSceneTexture(scene.imageUrl);
  };

  // Pointer controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isUserInteractingRef.current = true;
    onPointerDownPointerXRef.current = e.clientX;
    onPointerDownPointerYRef.current = e.clientY;
    onPointerDownLonRef.current = lonRef.current;
    onPointerDownLatRef.current = latRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isUserInteractingRef.current) return;
    lonRef.current =
      (onPointerDownPointerXRef.current - e.clientX) * 0.15 + onPointerDownLonRef.current;
    latRef.current =
      (e.clientY - onPointerDownPointerYRef.current) * 0.15 + onPointerDownLatRef.current;
  };

  const handlePointerUp = () => {
    isUserInteractingRef.current = false;
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    fovRef.current = Math.max(35, Math.min(100, fovRef.current + delta));
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <section id="panoramas" className="relative w-full py-16 bg-slate-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              <Eye className="w-4 h-4" />
              <span>360° Virtual Panorama Tour</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Interactive WebGL Walkthrough</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
              Explore the Ambiance in Full 360°
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
              Drag to explore our circular lagoon, overwater villas, fine dining deck, and grand
              convention ballroom in high-definition panoramic glory.
            </p>
          </div>

          {/* Scene Selector Pill Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl">
            {PANORAMA_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => handleSceneChange(scene)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  currentSceneId === scene.id
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {scene.title.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Panorama Viewport Container */}
        <div className="relative w-full rounded-2xl md:rounded-3xl border border-slate-800 bg-black overflow-hidden shadow-2xl">
          {/* WebGL Canvas mount */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full h-[500px] md:h-[650px] cursor-grab active:cursor-grabbing select-none"
          />

          {/* Dynamic 3D Hotspot Pins rendered on canvas */}
          {hotspotScreenPositions.map(({ id, x, y, visible, spot }) => {
            if (!visible) return null;
            return (
              <div
                key={id}
                style={{
                  position: 'absolute',
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="z-20 pointer-events-auto"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(spot);
                  }}
                  className="group relative flex items-center justify-center"
                  aria-label={spot.title}
                >
                  {/* Pulsing beacon radar */}
                  <span className="absolute w-10 h-10 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                  <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-slate-950 shadow-lg border-2 border-white transition-transform group-hover:scale-125">
                    {spot.actionType === 'room' && <Bed className="w-4 h-4" />}
                    {spot.actionType === 'dining' && <UtensilsCrossed className="w-4 h-4" />}
                    {spot.actionType === 'banquet' && <Sparkles className="w-4 h-4" />}
                    {spot.actionType === 'scene' && <Layers className="w-4 h-4" />}
                    {spot.actionType === 'info' && <Info className="w-4 h-4" />}
                  </span>

                  {/* Hover Tag */}
                  <span className="absolute left-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/95 border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap pointer-events-none">
                    {spot.title}
                  </span>
                </button>
              </div>
            );
          })}

          {/* Top Bar Overlay Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            {/* Current Scene Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-200 pointer-events-auto shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold text-white">{currentScene.title}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">{currentScene.subtitle}</span>
            </div>

            {/* Viewport Control Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md p-1.5 rounded-xl pointer-events-auto shadow-lg">
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title={isAutoRotating ? 'Pause Auto-Rotation' : 'Start Auto-Rotation'}
                className={`p-2 rounded-lg text-xs font-semibold transition ${
                  isAutoRotating
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(-10)}
                title="Zoom In"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(10)}
                title="Zoom Out"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Left Compass & Guidance Indicator */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm text-xs text-slate-300">
              <Compass
                className="w-4 h-4 text-amber-400 transition-transform"
                style={{ transform: `rotate(${-headingAngle}deg)` }}
              />
              <span className="font-mono tabular-nums">{headingAngle}°</span>
              <span className="text-slate-500">|</span>
              <span>Drag to Pan 360°</span>
            </div>
          </div>

          {/* Active Hotspot Inspector Card */}
          {activeHotspot && (
            <div className="absolute bottom-4 right-4 z-30 max-w-sm w-full rounded-2xl border border-slate-700 bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    {activeHotspot.actionType === 'room'
                      ? 'Accommodation Spotlight'
                      : activeHotspot.actionType === 'dining'
                      ? 'Fine Dining Ambience'
                      : activeHotspot.actionType === 'banquet'
                      ? 'Grand Celebration Venue'
                      : 'Resort Ambiance'}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{activeHotspot.title}</h4>
                </div>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="text-slate-400 hover:text-white text-sm p-1"
                >
                  ✕
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {activeHotspot.description}
              </p>

              {activeHotspot.priceNote && (
                <div className="mt-3 text-xs font-semibold text-amber-300">
                  {activeHotspot.priceNote}
                </div>
              )}

              {/* Action Handlers */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                {activeHotspot.actionType === 'room' && (
                  <button
                    onClick={() => {
                      if (activeHotspot.targetSlug && onSelectRoom) {
                        onSelectRoom(activeHotspot.targetSlug);
                      }
                      setActiveHotspot(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                  >
                    <span>View & Book Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeHotspot.actionType === 'dining' && (
                  <button
                    onClick={() => {
                      if (onOpenDining) onOpenDining();
                      setActiveHotspot(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                  >
                    <span>Reserve Dining Table</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeHotspot.actionType === 'banquet' && (
                  <button
                    onClick={() => {
                      if (onOpenBanquet) onOpenBanquet();
                      setActiveHotspot(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                  >
                    <span>Calculate Event Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeHotspot.actionType === 'scene' && activeHotspot.targetSceneId && (
                  <button
                    onClick={() => {
                      const nextScene = PANORAMA_SCENES.find(
                        (s) => s.id === activeHotspot.targetSceneId
                      );
                      if (nextScene) handleSceneChange(nextScene);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                  >
                    <span>Enter 360° Scene</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {activeHotspot.actionType === 'info' && (
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
