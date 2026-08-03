import { fetchClient } from "./fetchClient";

export async function getNotifications() {
  return await fetchClient("/notifications");

}

export async function getUnreadCount() {
return await fetchClient("/notifications/unread-count");
  
}

export async function markNotificationsAsRead(id) {
    return await fetchClient(`/notifications/${id}/read`,{
        method:"PATCH"
    });
}

export async function markAllNotificationsAsRead() {
    return await fetchClient("/notifications/read-all",{
        method:"PATCH"
    });
}

export async function deleteNotification(id) {
    return await fetchClient(`/notifications/${id}`,{
        method:"DELETE"
    });
}