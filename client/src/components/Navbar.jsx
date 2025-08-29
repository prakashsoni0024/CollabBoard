import React from "react";
import { Github } from "lucide-react";

export default function Navbar() {
  const openGitHub = () => {
    window.open("https://github.com/prakashsoni0024", "_blank");
  };

  return (
    <nav className="w-full bg-[#212529] shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          CollabBoard
        </div>

        {/* GitHub Button */}
        <button
          onClick={openGitHub}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2b3035] text-white hover:bg-[#343a3f] transition"
        >
          <Github size={20} />
          GitHub
        </button>
      </div>
    </nav>
  );
}
