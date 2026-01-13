import React from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Dumbbell, User, LogOut } from "lucide-react";

const Navbar = ({ isAuthenticated = true, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/program", label: "Program" },
    { path: "/exercises", label: "Exercises" },
    { path: "/workout-log", label: "Workout Log" },
    { path: "/chat-coach", label: "Chat Coach" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Dumbbell className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              ANGRIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`angrit-nav-link font-medium text-sm ${
                      isActive(link.path) ? "active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
                  <Link
                    to="/profile"
                    className={`p-2 rounded-xl transition-colors ${
                      isActive("/profile")
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-muted"
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-xl bg-secondary hover:bg-destructive/20 hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="angrit-btn-secondary text-sm">
                  Log In
                </Link>
                <Link to="/register" className="angrit-btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-secondary"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-border my-2" />
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium hover:bg-secondary"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium hover:bg-secondary text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium bg-primary text-primary-foreground text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;