import React from "react";
import { FaLinkedin, FaInstagram, FaFacebookF} from "react-icons/fa"; // Importing React Icons
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 flex-col md:flex-row  justify-between items-center">
          {/* Logo/Brand */}
          <div className="hidden lg:block">
            <h2 className="text-2xl font-semibold">Draw</h2>
            <p className="text-gray-400 text-sm">The best online drawing tool</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex  space-x-6">
            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/in/prakash-soni0024/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gray-100"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>

            {/* Instagram Icon */}
            <a
              href="https://www.instagram.com/prakashsoni08/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gray-100"
            >
              <FaInstagram className="w-5 h-5" />
            </a>

            {/* Facebook Icon */}
            <a
              href="https://www.facebook.com/profile.php?id=100043143820081"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gray-100"
            >
              <FaFacebookF className="w-5 h-5" />
            </a>

            {/* Twitter (X) Icon */}
            <a
              href="https://x.com/Prakashsoni0024"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gray-100"
            >
              <FaXTwitter className="w-5 h-5"/>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Draw. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
