import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Sun, Moon, Calculator } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const location = useLocation();

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${
      darkMode 
        ? 'bg-slate-900/80 border-purple-500/20' 
        : 'bg-white/80 border-blue-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold transition-colors ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              CGPA Calculator
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location.pathname === '/'
                    ? darkMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-purple-600/20'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/calculator"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  location.pathname === '/calculator'
                    ? darkMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-purple-600/20'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>Calculator</span>
              </Link>
            </div>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                darkMode 
                  ? 'bg-purple-600/20 text-purple-300 hover:bg-purple-600/30' 
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;