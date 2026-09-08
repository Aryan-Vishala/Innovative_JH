import { db } from '../data/store.js';

export function sendNotification({
  recipientUserId,
  recipientRole = null,
  title,
  message,
  link = null,
  relatedProblemId = null
}) {
  const notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    recipientUserId,
    recipientRole,
    title,
    message,
    link,
    relatedProblemId,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  db.notifications.unshift(notification);
  db.saveSnapshot();
  return notification;
}

export function broadcastToRole(role, { title, message, link = null, relatedProblemId = null }) {
  const targetUsers = db.users.filter((u) => u.role === role);
  return targetUsers.map((u) =>
    sendNotification({
      recipientUserId: u.id,
      recipientRole: role,
      title,
      message,
      link,
      relatedProblemId
    })
  );
}

export function getUserNotifications(userId) {
  const user = db.users.find((u) => u.id === userId);
  return db.notifications.filter(
    (n) => n.recipientUserId === userId || (user && n.recipientRole === user.role)
  );
}
