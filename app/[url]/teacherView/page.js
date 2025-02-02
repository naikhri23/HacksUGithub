import React from 'react';
import { MessageCircleQuestion, ChevronLeft, ChevronRight, Share } from "lucide-react";

export default function TeacherPage() {
  return (
      <div className="bg-blue-200 py-6 text-center">
          <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-300">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-300">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute top-5 left-5 flex items-center space-x-4">
            <button className="w-10 h-10">
              <Share className="w-10 h-10 text-gray-700" />
            </button>
          </div>

          <div classname="absolute top-5 right-5 flex items-center">
            {/* Notification Icon with Dot */}
            <button className="w-10 h-10 relative">
              <MessageCircleQuestion className="w-10 h-10 text-gray-700" />

              {/* Notification Dot positioned on top-right of the icon */}
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
          <h1 className="text-3xl text-center font-bold text-gray-800 mb-8">Welcome TeacherName!</h1>
          
      </div>
  );
}