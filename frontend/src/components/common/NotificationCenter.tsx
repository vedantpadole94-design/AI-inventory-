import { useEffect, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { ProcurementSocket } from '../../services/websocket';

export default function NotificationCenter() {
  const notifications = useStore((state) => state.notifications);
  const addNotification = useStore((state) => state.addNotification);
  const markNotificationRead = useStore((state) => state.markNotificationRead);
  const preferences = useStore((state) => state.preferences);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!preferences.enableRealtime) return;

    const socket = new ProcurementSocket();
    socket.connect('http://127.0.0.1:8000/ws/notifications', (event) => {
      const data = JSON.parse(event.data || '{}');
      addNotification({
        id: String(Date.now()),
        title: data.title || 'Realtime update',
        message: data.message || 'A new event has been received.',
        type: data.type || 'info',
        createdAt: new Date().toISOString(),
        read: false,
      });
    });

    return () => socket.disconnect();
  }, [preferences.enableRealtime, addNotification]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="relative">
      <button
        aria-label="Open notifications"
        onClick={() => setOpen((state) => !state)}
        className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:border-sky-300"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-14 z-50 w-80 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-md"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              <span className="text-xs text-slate-500">{unreadCount} new</span>
            </div>

            <div className="space-y-2">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex gap-2 rounded-xl border p-3 ${notification.read ? 'border-slate-200 bg-slate-50' : 'border-sky-200 bg-sky-50'}`}>
                  <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${notification.type === 'warning' ? 'bg-amber-400' : notification.type === 'success' ? 'bg-emerald-500' : notification.type === 'alert' ? 'bg-rose-500' : 'bg-sky-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                      {!notification.read && (
                        <button type="button" aria-label="Mark as read" onClick={() => markNotificationRead(notification.id)}>
                          <Check size={14} className="text-slate-500" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{notification.message}</p>
                  </div>
                  <button type="button" aria-label="Dismiss notification" onClick={() => markNotificationRead(notification.id)}>
                    <X size={12} className="text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
