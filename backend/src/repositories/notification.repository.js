const { Notification } = require("../models");


// Create notification
const create = async (notificationData) => {

    return await Notification.create(notificationData);

};


// Find notifications for user
const findByUserId = async (user_id) => {

    return await Notification.findAll({
        where: {
            user_id
        },
        order: [
            ["created_at", "DESC"]
        ]
    });

};


// Count unread notifications
const countUnread = async (user_id) => {

    return await Notification.count({
        where: {
            user_id,
            is_read: false
        }
    });

};


// Find notification by id and user
const findByIdAndUser = async (
    notification_id,
    user_id
) => {

    return await Notification.findOne({
        where: {
            id: notification_id,
            user_id
        }
    });

};


// Mark notification as read
const markAsRead = async (
    notification_id,
    user_id
) => {

    const notification =
        await findByIdAndUser(
            notification_id,
            user_id
        );


    if (!notification) {
        return null;
    }


    notification.is_read = true;

    await notification.save();


    return notification;
};



// Mark all notifications as read
const markAllAsRead = async (user_id) => {

    return await Notification.update(
        {
            is_read: true
        },
        {
            where: {
                user_id,
                is_read: false
            }
        }
    );

};

const deleteNotification = async (
    notification_id,
    user_id
) => {

    const notification = await Notification.findOne({
        where: {
            id: notification_id,
            user_id
        }
    });


    if (!notification) {
        return null;
    }


    await notification.destroy();

    return notification;

};


module.exports = {
    create,
    findByUserId,
    countUnread,
    findByIdAndUser,
    markAsRead,
    markAllAsRead,
    deleteNotification
};