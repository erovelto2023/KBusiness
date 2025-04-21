
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Globe,
  Home,
  LinkIcon,
  Package,
  Settings,
  ShoppingCart,
  Wrench,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/programs", label: "Programs", icon: Package },
    { path: "/links", label: "Links", icon: LinkIcon },
    { path: "/sales", label: "Sales", icon: ShoppingCart },
    { path: "/sales-manager", label: "Sales Manager", icon: Wrench }, // Direct link to sales entry/management
    { path: "/manage", label: "Manage", icon: Settings },
    { path: "/tools", label: "Tools", icon: Wrench },
    { path: "/forum", label: "Community", icon: Globe },
    { path: "/lms/catalog", label: "LMS", icon: BarChart3 }, // New LMS link
    { path: "/classes", label: "Classes", icon: BarChart3 },
  ];

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-affiliate-purple rounded-full flex items-center justify-center mr-2">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold hidden md:block">Affiliate Business Manager</span>
              <span className="text-xl font-semibold md:hidden">ABM</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  isActive(item.path)
                    ? "text-affiliate-purple"
                    : "text-gray-600 hover:text-affiliate-purple"
                }`}
              >
                <item.icon className="h-4 w-4 mr-1" />
                {item.label}
              </Link>
            ))}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-affiliate-purple"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive(item.path)
                    ? "text-affiliate-purple"
                    : "text-gray-600 hover:text-affiliate-purple"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
