import {useState} from 'react'
import { Lock, Link2, Globe } from "lucide-react";

type Privacy = "private" | "unlisted" | "public";


function Privacy() {
    const [privacy, setPrivacy] = useState<Privacy>("private");
    
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        Privacy
      </h4>
      <div className="space-y-2">
        {[
          {
            value: "private",
            icon: Lock,
            label: "Private",
            desc: "Only you",
          },
          {
            value: "unlisted",
            icon: Link2,
            label: "Unlisted",
            desc: "Anyone with link",
          },
          {
            value: "public",
            icon: Globe,
            label: "Public",
            desc: "Searchable",
          },
        ].map(({ value, icon: Icon, label, desc }) => (
          <button
            key={value}
            onClick={() => setPrivacy(value as Privacy)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              privacy === value
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  privacy === value
                    ? "border-blue-500 bg-blue-500"
                    : "border-slate-300"
                }`}
              >
                {privacy === value && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <Icon className="w-4 h-4 text-slate-600" />
              <div className="flex-1">
                <div className="font-medium text-slate-900">{label}</div>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Privacy