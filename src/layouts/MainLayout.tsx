import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../lib/store';
import Navigation from '../components/Navigation';

export default function MainLayout() {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}