import { Bell, Calendar, CreditCard, MessageCircle, Info } from "lucide-react";

/* ================= TYPES ================= */

export type NotificationType =
  | "BOOKING"
  | "PAYMENT"
  | "MESSAGE"
  | "SYSTEM"
  | string;

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type?: NotificationType;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string | null;
};

/* ================= FORMAT TIME ================= */

export function formatNotificationTime(date: string) {
  const now = new Date();
  const d = new Date(date);

  if (isNaN(d.getTime())) return "";

  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHour < 24) return `${diffHour} hr ago`;
  if (diffDay === 1) return "Yesterday";

  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

/* ================= GET LABEL ================= */

export function getNotificationLabel(type?: NotificationType) {
  switch (type) {
    case "BOOKING":
      return "Booking";
    case "PAYMENT":
      return "Payment";
    case "MESSAGE":
      return "Message";
    case "SYSTEM":
      return "System";
    default:
      return "Notification";
  }
}

/* ================= GET ICON ================= */

export function getNotificationIcon(type?: NotificationType) {
  switch (type) {
    case "BOOKING":
      return Calendar;
    case "PAYMENT":
      return CreditCard;
    case "MESSAGE":
      return MessageCircle;
    case "SYSTEM":
      return Info;
    default:
      return Bell;
  }
}

/* ================= GROUP BY TIME ================= */

export function groupNotifications(notifications: NotificationItem[]) {
  const groups = {
    today: [] as NotificationItem[],
    yesterday: [] as NotificationItem[],
    older: [] as NotificationItem[],
  };

  const now = new Date();

  const yesterdayDate = new Date();
  yesterdayDate.setDate(now.getDate() - 1);

  notifications.forEach((n) => {
    const d = new Date(n.createdAt);

    if (isNaN(d.getTime())) return;

    const isToday = d.toDateString() === now.toDateString();
    const isYesterday =
      d.toDateString() === yesterdayDate.toDateString();

    if (isToday) groups.today.push(n);
    else if (isYesterday) groups.yesterday.push(n);
    else groups.older.push(n);
  });

  return groups;
}