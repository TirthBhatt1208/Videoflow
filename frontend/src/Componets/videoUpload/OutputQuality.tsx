import { useState } from "react";
import type { UploadFile } from "../../Types/videoUpload";
import { Lock } from "lucide-react";


type OutputQuality = "480p" | "720p" | "1080p" | "4k";

function OutputQuality({ files }: { files: UploadFile[] }) {
  const totalSize = files.reduce((acc, file: UploadFile) => acc + file.size, 0);

  const [selectedQualities, setSelectedQualities] = useState<OutputQuality[]>([
    "720p",
    "1080p",
  ]);

  const toggleQuality = (quality: OutputQuality) => {
    setSelectedQualities((prev) =>
      prev.includes(quality)
        ? prev.filter((q) => q !== quality)
        : [...prev, quality]
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          Output Quality
        </h4>
        <span className="text-xs text-slate-400">
          ~{totalSize.toFixed(0)}MB Total
        </span>
      </div>
      <div className="space-y-2">
        {[
          {
            value: "480p",
            label: "480p (Save space)",
            desc: "Low resolution, fast load",
          },
          {
            value: "720p",
            label: "720p (Recommended)",
            desc: "Standard HD quality",
          },
          {
            value: "1080p",
            label: "1080p (High quality)",
            desc: "Full HD resolution",
          },
          {
            value: "4k",
            label: "4K (Premium only)",
            desc: "Upgrade to unlock",
            locked: true,
          },
        ].map(({ value, label, desc, locked }) => (
          <button
            key={value}
            onClick={() => !locked && toggleQuality(value as OutputQuality)}
            disabled={locked}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedQualities.includes(value as OutputQuality)
                ? "border-blue-500 bg-blue-50/50"
                : locked
                ? "border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                  selectedQualities.includes(value as OutputQuality)
                    ? "border-blue-500 bg-blue-500"
                    : "border-slate-300"
                }`}
              >
                {selectedQualities.includes(value as OutputQuality) && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{label}</span>
                  {locked && <Lock className="w-4 h-4 text-slate-400" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                {locked && (
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-1 font-medium">
                    Upgrade to unlock
                  </button>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default OutputQuality;
