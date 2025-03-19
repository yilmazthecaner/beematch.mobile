import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, MessageCircle, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

export default function Navigation() {
  const location = useLocation();
  const { t } = useTranslation();
  
  const links = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/matches', icon: Heart, label: t('matches') },
    { to: '/chat', icon: MessageCircle, label: t('messages') },
    { to: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-end items-center space-x-4">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            {links.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center space-y-1 ${
                  location.pathname === to
                    ? 'text-yellow-500'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}