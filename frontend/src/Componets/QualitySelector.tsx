import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface QualitySelectorProps {
  player: any;
}

const QualitySelector: React.FC<QualitySelectorProps> = ({ player }) => {
  const [qualities, setQualities] = useState<any[]>([]);
  const [currentQuality, setCurrentQuality] = useState<string>("auto");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!player) return;

    const qualityLevels = player.qualityLevels();
    let intervalId: NodeJS.Timeout;

    const checkQualities = () => {
      if (qualityLevels.length > 0) {
        const newQualities = [];
        for (let i = 0; i < qualityLevels.length; i++) {
          newQualities.push({
            height: qualityLevels[i].height,
            bitrate: qualityLevels[i].bitrate,
          });
        }

        if (newQualities.length !== qualities.length) {
          setQualities(newQualities);
        }

        if (newQualities.length >= 4) {
          clearInterval(intervalId);
        }
      }
    };

    checkQualities();
    intervalId = setInterval(checkQualities, 300);

    qualityLevels.on("change", () => {
      const selected = qualityLevels[qualityLevels.selectedIndex];
      if (selected) {
        let allEnabled = true;
        for (let i = 0; i < qualityLevels.length; i++) {
          if (!qualityLevels[i].enabled) {
            allEnabled = false;
            break;
          }
        }
        setCurrentQuality(allEnabled ? "auto" : `${selected.height}p`);
      }
    });

    // ✅ Listen for fullscreen changes
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isNowFullscreen);
      console.log("Fullscreen changed:", isNowFullscreen);
      setIsOpen(false); // Close dropdown on fullscreen change
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
    };
  }, [player]);

  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 180,
      });
    }
  };

  const handleSelectQuality = (height: number | "auto") => {
    const qualityLevels = player.qualityLevels();

    if (height === "auto") {
      for (let i = 0; i < qualityLevels.length; i++) {
        qualityLevels[i].enabled = true;
      }
      setCurrentQuality("auto");
      console.log("✅ Auto quality enabled");
    } else {
      for (let i = 0; i < qualityLevels.length; i++) {
        qualityLevels[i].enabled = qualityLevels[i].height === height;
      }
      setCurrentQuality(`${height}p`);
      console.log(`✅ Quality locked to ${height}p`);
    }

    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    calculateDropdownPosition();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = () => setIsOpen(false);
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  if (qualities.length === 0) {
    return (
      <div className="absolute top-2 right-2 z-50 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded text-xs">
        ⏳
      </div>
    );
  }

  // ✅ Get fullscreen element
  const fullscreenElement =
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement;

  // ✅ Button component
  const buttonComponent = (
    <div
      className={
        isFullscreen
          ? "fixed top-4 right-4 z-[9999]"
          : "absolute top-2 right-2 z-50"
      }
    >
      <button
        ref={buttonRef}
        onClick={handleToggle}
        type="button"
        className="bg-black bg-opacity-90 hover:bg-opacity-100 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition shadow-xl border border-gray-600"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {currentQuality}
      </button>
    </div>
  );

  // ✅ Dropdown component
  const dropdownComponent = isOpen ? (
    <div
      className="fixed bg-gray-900 rounded-lg shadow-2xl min-w-[180px] border-2 border-blue-500"
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        zIndex: 999999,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Auto */}
      <button
        onClick={() => handleSelectQuality("auto")}
        type="button"
        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition ${
          currentQuality === "auto"
            ? "bg-blue-600 text-white font-bold"
            : "text-gray-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">🔄 Auto</span>
          {currentQuality === "auto" && <span className="text-xl">✓</span>}
        </div>
      </button>

      <div className="h-px bg-gray-600" />

      {/* Qualities */}
      {qualities
        .sort((a, b) => b.height - a.height)
        .map((q, idx) => {
          const isSelected = currentQuality === `${q.height}p`;
          return (
            <button
              key={`quality-${idx}-${q.height}`}
              onClick={() => handleSelectQuality(q.height)}
              type="button"
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-700 transition ${
                isSelected
                  ? "bg-blue-600 text-white font-bold"
                  : "text-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-base">{q.height}p</div>
                  <div className="text-xs opacity-70">
                    {(q.bitrate / 1000000).toFixed(1)} Mbps
                  </div>
                </div>
                {isSelected && <span className="text-xl">✓</span>}
              </div>
            </button>
          );
        })}
    </div>
  ) : null;

  // ✅ Return based on fullscreen state
  if (isFullscreen && fullscreenElement) {
    // Render both button and dropdown to fullscreen element
    return (
      <>
        {createPortal(buttonComponent, fullscreenElement)}
        {dropdownComponent &&
          createPortal(dropdownComponent, fullscreenElement)}
      </>
    );
  }

  // Normal mode - button inline, dropdown in body
  return (
    <>
      {buttonComponent}
      {dropdownComponent && createPortal(dropdownComponent, document.body)}
    </>
  );
};

export default QualitySelector;
