import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';

function ErrorPage({errorCode="404"}) {
  return (
    <div className="h-full overflow-hidden bg-gray-50 flex flex-col items-center justify-center p-5 text-gray-800">
      {/* Container with content */}
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Top colored band */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        {/* Content area */}
        <div className="p-8 md:p-12">
          {/* Error code */}
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-2">{errorCode}</h1>
          
          {/* Error message */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Page not found</h2>
          <p className="text-gray-600 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors" 
                onClick={() => window.location.href = '/'}
            >
              <ArrowLeft size={18} />
              Go Back Home
            </button>
            
            {/* Search form */}
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search for content..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Bottom section with links */}
        <div className=" border-t border-gray-100 bg-gray-50 p-6">
          <p className="text-gray-500 text-sm mb-3">You might want to check out:</p>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors">Documentation</a>
            <a href="#" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors">Support</a>
            <a href="#" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors">Help Center</a>
            <a href="#" className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
      
      {/* Optional illustration */}
      <div className="mt-10 text-center h-[100%]">
        <div className="inline-block p-4 rounded-full bg-gray-100">
          <Search size={80} className="text-gray-400" />
        </div>
        <p className="text-gray-500 mt-3 text-sm">Need help finding something?</p>
      </div>
    </div>
  );
}

export default ErrorPage;