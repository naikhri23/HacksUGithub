import { MessageCircleQuestion } from "lucide-react";

export default function NotificationIcon() {
    return (
      <div className="relative inline-block">
        {/* Bell Icon */}
        <Bell className="w-8 h-8 text-gray-700" />
  
        {/* Notification Dot */}
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </div>
    );
  }