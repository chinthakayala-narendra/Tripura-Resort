import React, { useRef, useState, useEffect } from 'react';
import { PRESET_VIDEO_TIMESTAMPS, RESORT_IMAGES } from '../data/resortData';
import { VideoCapturedFrame } from '../types';
import {
  Camera,
  Play,
  Pause,
  Download,
  Trash2,
  Film,
  Sparkles,
  Upload,
  Check,
  ChevronLeft,
  ChevronRight,
  Terminal,
} from 'lucide-react';

interface VideoFrameGrabberProps {
  onAddImageToGallery?: (imageSrc: string) => void;
}

export const VideoFrameGrabber: React.FC<VideoFrameGrabberProps> = ({
  onAddImageToGallery,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(24);
  const [videoSource, setVideoSource] = useState<string>('');
  const [useCanvasVideo, setUseCanvasVideo] = useState<boolean>(true);
  const [capturedFrames, setCapturedFrames] = useState<VideoCapturedFrame[]>([]);
  const [showFfmpegHelper, setShowFfmpegHelper] = useState<boolean>(false);
  const [copiedFfmpeg, setCopiedFfmpeg] = useState<boolean>(false);

  // Initialize canvas-based video simulation if no direct video file
  // This generates an animated cinematic drone reel using high-resolution resort assets and canvas
  const canvasPlayerRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Set initial default captured frames so the user immediately sees working results!
  useEffect(() => {
    setCapturedFrames([
      {
        id: 'frame-1',
        timestampSeconds: 2.4,
        timeFormatted: '00:02.40',
        dataUrl: RESORT_IMAGES.droneAerial,
        label: 'Golden Hour Lagoon Flyover',
        resolution: '1920 × 1080',
        capturedAt: 'Extracted from Drone Reel',
      },
      {
        id: 'frame-2',
        timestampSeconds: 6.8,
        timeFormatted: '00:06.80',
        dataUrl: RESORT_IMAGES.waterCottage,
        label: 'Waterfront Cottage Teak Deck',
        resolution: '1920 × 1080',
        capturedAt: 'Extracted from Drone Reel',
      },
      {
        id: 'frame-3',
        timestampSeconds: 11.2,
        timeFormatted: '00:11.20',
        dataUrl: RESORT_IMAGES.oasisRestaurant,
        label: 'Oasis Restaurant Candlelit Pergola',
        resolution: '1920 × 1080',
        capturedAt: 'Extracted from Drone Reel',
      },
      {
        id: 'frame-4',
        timestampSeconds: 15.6,
        timeFormatted: '00:15.60',
        dataUrl: RESORT_IMAGES.vedikaBanquet,
        label: 'Vedika Ballroom Chandeliers',
        resolution: '1920 × 1080',
        capturedAt: 'Extracted from Drone Reel',
      },
    ]);
  }, []);

  // Video playback simulation on canvas using smooth keyframe interpolation
  useEffect(() => {
    if (!useCanvasVideo) return;
    const canvas = canvasPlayerRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img1 = new Image();
    img1.src = RESORT_IMAGES.droneAerial;
    const img2 = new Image();
    img2.src = RESORT_IMAGES.waterCottage;
    const img3 = new Image();
    img3.src = RESORT_IMAGES.oasisRestaurant;
    const img4 = new Image();
    img4.src = RESORT_IMAGES.vedikaBanquet;
    const img5 = new Image();
    img5.src = RESORT_IMAGES.poolAmenities;

    const imageList = [img1, img2, img3, img4, img5];

    let lastTimestamp = performance.now();
    const renderLoop = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          return next >= duration ? 0 : next;
        });
      }

      // Determine active scene based on currentTime
      const segmentDuration = duration / 5;
      const index = Math.min(4, Math.floor(currentTime / segmentDuration));
      const nextIndex = (index + 1) % 5;
      const progress = (currentTime % segmentDuration) / segmentDuration;

      const currentImg = imageList[index];
      const nextImg = imageList[nextIndex];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentImg && currentImg.complete) {
        // Subtle pan/zoom effect to simulate drone flight
        const zoom = 1.0 + Math.sin(progress * Math.PI) * 0.08;
        const panX = Math.sin(progress * Math.PI) * 30;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-canvas.width / 2 + panX, -canvas.height / 2);
        ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        // Blend next image smoothly during last 20% of segment
        if (progress > 0.8 && nextImg && nextImg.complete) {
          const blendAlpha = (progress - 0.8) / 0.2;
          ctx.save();
          ctx.globalAlpha = blendAlpha;
          ctx.drawImage(nextImg, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }
      }

      // Draw subtle telemetry HUD overlay on canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(16, 16, 210, 48);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 16, 210, 48);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('DRONE AERIAL CAM 4K · 60 FPS', 26, 34);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`ALT: 120M · REC ${formatTime(currentTime)}`, 26, 52);

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentTime, duration, useCanvasVideo]);

  // Video time formatting
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Extract High-Res Still Frame Handler
  const captureFrame = () => {
    let dataUrl = '';
    const width = 1920;
    const height = 1080;

    if (useCanvasVideo && canvasPlayerRef.current) {
      // Extract from the simulated high-res canvas player
      dataUrl = canvasPlayerRef.current.toDataURL('image/jpeg', 0.95);
    } else if (videoRef.current && canvasRef.current) {
      // Extract from real loaded HTML5 video tag
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || width;
      canvas.height = video.videoHeight || height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      }
    }

    if (!dataUrl) return;

    // Find nearest preset label or create timestamp label
    const nearestPreset = PRESET_VIDEO_TIMESTAMPS.reduce((prev, curr) =>
      Math.abs(curr.seconds - currentTime) < Math.abs(prev.seconds - currentTime)
        ? curr
        : prev
    );

    const isCloseToPreset = Math.abs(nearestPreset.seconds - currentTime) < 2.5;
    const label = isCloseToPreset
      ? nearestPreset.label
      : `Drone Still @ ${formatTime(currentTime)}`;

    const newFrame: VideoCapturedFrame = {
      id: `frame-${Date.now()}`,
      timestampSeconds: Number(currentTime.toFixed(2)),
      timeFormatted: formatTime(currentTime),
      dataUrl,
      label,
      resolution: `${width} × ${height}`,
      capturedAt: new Date().toLocaleTimeString(),
    };

    setCapturedFrames((prev) => [newFrame, ...prev]);

    if (onAddImageToGallery) {
      onAddImageToGallery(dataUrl);
    }
  };

  // Custom video file upload handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSource(url);
      setUseCanvasVideo(false);
      setIsPlaying(false);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.src = url;
      }
    }
  };

  // Step 1 frame forward or backward (assuming 30fps = ~0.033s)
  const stepFrame = (forward: boolean) => {
    const delta = forward ? 0.033 : -0.033;
    setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + delta)));
  };

  const jumpToTimestamp = (seconds: number) => {
    setCurrentTime(seconds);
    setIsPlaying(false);
  };

  const removeFrame = (id: string) => {
    setCapturedFrames((prev) => prev.filter((f) => f.id !== id));
  };

  const downloadFrame = (frame: VideoCapturedFrame) => {
    const link = document.createElement('a');
    link.download = `tripura-resort-drone-${frame.timeFormatted.replace(/[:.]/g, '-')}.jpg`;
    link.href = frame.dataUrl;
    link.click();
  };

  const copyFfmpegCommand = () => {
    const cmd = `ffmpeg -ss 00:${Math.floor(currentTime / 60)
      .toString()
      .padStart(2, '0')}:${Math.floor(currentTime % 60)
      .toString()
      .padStart(2, '0')} -i resort-drone-4k.mp4 -frames:v 1 -q:v 2 output_frame.jpg`;
    navigator.clipboard.writeText(cmd);
    setCopiedFfmpeg(true);
    setTimeout(() => setCopiedFfmpeg(false), 2000);
  };

  return (
    <section id="video-studio" className="w-full py-16 bg-slate-900/60 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              <Film className="w-4 h-4" />
              <span>Drone Video Media Lab</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Frame Extractor & Stills Gallery</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif-luxury font-bold text-white tracking-tight">
              Get High-Resolution Images from Video
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-2xl">
              Scrub through our 4K cinematic drone footage and extract high-resolution still
              photographs on the fly for room brochures, social media, and digital menus.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFfmpegHelper(!showFfmpegHelper)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition"
            >
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>CLI / FFmpeg Command</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 cursor-pointer transition">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Upload Custom Video</span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* FFmpeg CLI Modal / Accordion */}
        {showFfmpegHelper && (
          <div className="mb-6 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-amber-300">
                Automated High-Res Video Extraction (FFmpeg Production Recipe):
              </span>
              <button
                onClick={copyFfmpegCommand}
                className="flex items-center gap-1 text-[11px] px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 transition"
              >
                {copiedFfmpeg ? <Check className="w-3 h-3" /> : null}
                <span>{copiedFfmpeg ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-black/80 font-mono text-emerald-400 overflow-x-auto text-[11px]">
              {`# 1. Extract still at current scrubber time (${formatTime(currentTime)}):
ffmpeg -ss 00:${Math.floor(currentTime / 60).toString().padStart(2, '0')}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} -i resort-drone-aerial.mp4 -frames:v 1 -qscale:v 2 still_capture.jpg

# 2. Batch extract 1 keyframe every 5 seconds for full room catalog:
ffmpeg -i resort-drone-aerial.mp4 -vf "fps=1/5,scale=1920:1080:flags=lanczos" -q:v 2 frames/frame_%04d.jpg`}
            </pre>
          </div>
        )}

        {/* Main Grid: Player + Frame Extraction Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Video Scrubber & Canvas Player (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl md:rounded-3xl border border-slate-800 bg-black overflow-hidden shadow-2xl">
              {/* Either Canvas-driven drone player or real video element */}
              {useCanvasVideo ? (
                <canvas
                  ref={canvasPlayerRef}
                  width={1920}
                  height={1080}
                  className="w-full aspect-video object-cover block"
                />
              ) : (
                <video
                  ref={videoRef}
                  playsInline
                  onTimeUpdate={() => {
                    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) setDuration(videoRef.current.duration);
                  }}
                  className="w-full aspect-video object-cover block"
                />
              )}

              {/* Invisible scratchpad canvas for real video grabs */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Scrubber Overlays */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
                {/* Time Scrubber Slider */}
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-amber-400 tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.05"
                    value={currentTime}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentTime(val);
                      if (videoRef.current) videoRef.current.currentTime = val;
                    }}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-500 bg-slate-700 hover:bg-slate-600 transition"
                  />
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Player Controls Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? 'Pause' : 'Play Drone Reel'}</span>
                    </button>

                    <button
                      onClick={() => stepFrame(false)}
                      title="Step Back 1 Frame"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => stepFrame(true)}
                      title="Step Forward 1 Frame"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Primary Extract Still Button */}
                  <button
                    onClick={captureFrame}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Extract High-Res Still</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Scene Jump Timeline Markers */}
            <div>
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Key Scenic Timestamps in Drone Reel:
              </span>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_VIDEO_TIMESTAMPS.map((preset) => (
                  <button
                    key={preset.seconds}
                    onClick={() => jumpToTimestamp(preset.seconds)}
                    className="flex flex-col text-left p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-amber-500/50 hover:bg-slate-800/80 transition"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                      <span>{formatTime(preset.seconds)}</span>
                      <Sparkles className="w-3 h-3 text-amber-400 opacity-60" />
                    </div>
                    <span className="text-xs font-medium text-slate-200 truncate mt-0.5">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Captured Stills Gallery (Col 5) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Extracted Stills ({capturedFrames.length})</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">1080p Resolution</span>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {capturedFrames.map((frame) => (
                <div
                  key={frame.id}
                  className="group relative flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border border-slate-800 bg-slate-900/90 hover:border-slate-700 transition"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-36 h-24 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={frame.dataUrl}
                      alt={frame.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 font-mono text-[10px] text-amber-400 backdrop-blur">
                      {frame.timeFormatted}
                    </span>
                  </div>

                  {/* Info & Actions */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 truncate">{frame.label}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span>{frame.resolution}</span>
                        <span>·</span>
                        <span>{frame.capturedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => downloadFrame(frame)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>

                      <button
                        onClick={() => {
                          if (onAddImageToGallery) onAddImageToGallery(frame.dataUrl);
                          alert('Added frame to Resort Gallery!');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium hover:bg-slate-700 transition"
                      >
                        Use in Gallery
                      </button>

                      <button
                        onClick={() => removeFrame(frame.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 transition ml-auto"
                        title="Remove frame"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {capturedFrames.length === 0 && (
                <div className="py-12 text-center border border-dashed border-slate-800 rounded-2xl p-6">
                  <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No frames extracted yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Play the drone reel or drag the scrubber, then click "Extract High-Res Still".
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
