import {useState} from 'react'

type VideoFormat = "mp4-h264" | "mp4-h265" | "webm-vp9" | "avi";


function OutputFFormat() {
    const [videoFormat, setVideoFormat] = useState<VideoFormat>("mp4-h264");
    
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        Output Video Format
      </h4>
      <select
        value={videoFormat}
        onChange={(e) => setVideoFormat(e.target.value as VideoFormat)}
        className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
      >
        <option value="mp4-h264">MP4 (H.264)</option>
        <option value="mp4-h265">MP4 (H.265)</option>
        <option value="webm-vp9">WebM (VP9)</option>
        <option value="avi">AVI</option>
      </select>
    </div>
  );
}

export default OutputFFormat