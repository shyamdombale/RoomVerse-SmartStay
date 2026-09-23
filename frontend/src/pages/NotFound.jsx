import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-2">Page Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested URL does not exist or has been relocated within the RoomVerse directory.
        </p>
        <Link to="/">
          <Button variant="primary" className="inline-flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
