import { Bell, Plus, Search } from "lucide-react";
import { useRef } from "react";
import Inputfile from './Inputfile';
import { useUser } from '@clerk/clerk-react';


function Header() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {user} = useUser();
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button
            onClick={() => inputRef.current!.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <label className="font-medium">Quick Upload</label>
            <Inputfile
              type="file"
              id="fileUpload"
              name="fileUpload"
              ref={inputRef}
              accept="video/*"
              className="hidden"
            />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer">
            {user?.firstName?.charAt(0).toUpperCase()}
            {user?.lastName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;