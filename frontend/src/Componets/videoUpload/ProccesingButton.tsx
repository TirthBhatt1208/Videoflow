import React from 'react'

function ProccesingButton() {
  return (
    <button className="w-full py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-200 shadow-lg shadow-slate-900/30 hover:shadow-xl hover:shadow-slate-900/40 hover:-translate-y-0.5 flex items-center justify-center gap-2">
      Start Processing
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </button>
  );
}

export default ProccesingButton