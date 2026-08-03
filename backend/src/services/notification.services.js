const notificationRepository = require("../repositories/notification.repository");



// Create notification
const createNotification = async(data)=>{

    return await notificationRepository.create(data);

};



// Get user notifications
const getUserNotifications = async(user_id)=>{

    return await notificationRepository.findByUserId(
        user_id
    );

};



// Get unread count
const getUnreadCount = async(user_id)=>{

    return await notificationRepository.countUnread(
        user_id
    );

};



// Mark notification read
const markAsRead = async(
    notification_id,
    user_id
)=>{

    const notification =
        await notificationRepository.markAsRead(
            notification_id,
            user_id
        );


    if(!notification){
        throw new Error(
            "Notification not found"
        );
    }


    return notification;

};



// Mark all read
const markAllAsRead = async(user_id)=>{

    await notificationRepository.markAllAsRead(
        user_id
    );


    return {
        message:
        "All notifications marked as read"
    };

};

const deleteNotification = async (
    notification_id,
    user_id
) => {

    const notification =
        await notificationRepository.deleteNotification(
            notification_id,
            user_id
        );


    if (!notification) {
        throw new Error("Notification not found");
    }


    return {
        message: "Notification deleted successfully"
    };

};



module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};