import React, { useState } from 'react';
import { Link } from 'react-router';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-white font-bold text-2xl hover:text-blue-200 transition duration-300"
            >
              MyApp
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link 
                  to="/" 
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link 
                  to="/tailwind-showcase" 
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Tailwind Showcase
                </Link>
              </li>
              <li>
                <Link 
                  to="/portfolio" 
                  className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu} 
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link 
                to="/" 
                onClick={toggleMenu}
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </Link>
              <Link 
                to="/books" 
                onClick={toggleMenu}
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Book List
              </Link>
              <Link 
                to="/add-book" 
                onClick={toggleMenu}
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Add Book
              </Link>
              <Link 
                to="/tailwind-showcase" 
                onClick={toggleMenu}
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Tailwind Showcase
              </Link>
              <Link 
                to="/portfolio" 
                onClick={toggleMenu}
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Portfolio
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;