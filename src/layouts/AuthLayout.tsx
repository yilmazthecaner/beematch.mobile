import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function AuthLayout() {
  const user = useStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Outlet />
    </div>
  );
}