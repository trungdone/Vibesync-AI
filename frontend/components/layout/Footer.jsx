"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-400 px-6 py-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Column 1: Brand */}
        <div>
          <h2 className="text-white text-xl font-bold mb-2">VibeSync</h2>
          <p className="text-gray-400">Feel the rhythm, vibe with AI.</p>
        </div>

        {/* Column 2: Navigation */}
        <div className="flex flex-col gap-2">
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link>
          <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
        </div>

        {/* Column 3: Socials */}
        <div>
          <h3 className="text-white font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook size={20} className="hover:text-white" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={20} className="hover:text-white" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} className="hover:text-white" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-neutral-800 mt-8 pt-4 text-xs text-center text-neutral-500">
        &copy; {new Date().getFullYear()} VibeSync. All rights reserved.
      </div>
    </footer>
  );
}
