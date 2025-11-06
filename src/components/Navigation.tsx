"use client"

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Car, LogOut, User, LayoutDashboard } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <Car className="h-6 w-6" />
            <span>CarRental</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/cars" className="text-gray-700 hover:text-primary transition-colors">
              Available Cars
            </Link>
            
            {user ? (
              <>
                <Link href="/my-rentals" className="text-gray-700 hover:text-primary transition-colors">
                  My Rentals
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-primary transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-1">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/auth">
                <Button size="sm">Login / Register</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
