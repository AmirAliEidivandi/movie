import { useEffect } from "react";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

export function Notification({ message, onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
}
