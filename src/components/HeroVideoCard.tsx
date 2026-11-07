import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { SCENEAI_IMAGES } from '../data/mockData';
import { useMarketplace } from '../contexts/MarketplaceContext';

export const HeroVideoCard: React.FC = () => {
  const { t, language, websiteContent } = useMarketplace();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeQuarter, setActiveQuarter] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);

  const videoSrc = websiteContent.heroVideoUrl || SCENEAI_IMAGES.heroVideo;
  const posterSrc = websiteContent.heroVideoPoster || SCENEAI_IMAGES.latest1;
  const captionText =
    language === 'en' && websiteContent.heroVideoCaption
      ? websiteContent.heroVideoCaption
      : t.hero.videoCaption;

  useEffect(() => {
    setVideoFailed(false);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [videoSrc]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;
    const progress = video.currentTime / video.duration;
    const quarter = Math.min(3, Math.floor(progress * 4));
    if (quarter !== activeQuarter) {
      setActiveQuarter(quarter);
    }
  };

  const handleQuarterClick = (quarterIndex: number) => {
    setActiveQuarter(quarterIndex);
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && !Number.isNaN(video.duration)) {
      video.currentTime = quarterIndex * 0.25 * video.duration;
    }
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full sm:w-[320px] md:w-[340px] bg-white/92 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/60 text-[#161616]">
      <div className="relative w-full h-[168px] rounded-xl overflow-hidden bg-[#0D0D0D]">
        {!videoFailed ? (
          <video
            key={videoSrc}
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            muted
            loop
            playsInline
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={posterSrc}
            alt="MY DREAM PLACE Architectural Preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/15 pointer-events-none" />

        {/* Play/Pause Toggle */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause preview video' : 'Play preview video'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        {/* Four Clickable Video Progress Indicators (Section 4) */}
        <div
          role="group"
          aria-label="Video timeline quarters"
          className="absolute bottom-2.5 left-3 right-3 grid grid-cols-4 gap-1.5"
        >
          {[0, 1, 2, 3].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleQuarterClick(q)}
              aria-label={`${t.hero.quarterLabel} ${q + 1} (${q * 25}% - ${(q + 1) * 25}%)`}
              className="py-1.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-200 ${
                  activeQuarter === q
                    ? 'bg-white shadow-xs scale-y-110'
                    : 'bg-white/40 group-hover:bg-white/70'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Video Caption with 2.15s entrance delay (Section 4 & 5) */}
      <div className="pt-2.5 px-1 flex items-center justify-between gap-2">
        <p
          style={{ animationDelay: '2.15s' }}
          className="animate-word-in font-body text-xs sm:text-[13px] font-medium text-[#161616] leading-snug"
        >
          “{captionText}”
        </p>
        <span className="font-ui text-[10px] font-semibold text-[#737373] tabular-nums shrink-0">
          {activeQuarter + 1}/4
        </span>
      </div>
    </div>
  );
};
