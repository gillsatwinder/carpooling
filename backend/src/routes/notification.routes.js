const express = require("express");

const router = express.Router();

const notificationController =
    require("../controllers/notification.controller");

const authenticateToken =
    require("../middleware/auth.middleware");


// Get all notifications
router.get(
    "/",
    authenticateToken,
    notificationController.getNotifications
);


// Get unread count
router.get(
    "/unread-count",
    authenticateToken,
    notificationController.getUnreadCount
);


// Mark one notification as read
router.patch(
    "/:id/read",
    authenticateToken,
    notificationController.markAsRead
);


// Mark all notifications as read
router.patch(
    "/read-all",
    authenticateToken,
    notificationController.markAllAsRead
);

router.delete(
    "/:id",
    authenticateToken,
    notificationController.deleteNotification
);


module.exports = router;