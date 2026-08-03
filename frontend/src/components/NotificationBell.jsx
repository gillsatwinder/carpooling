import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import {
    getNotifications, getUnreadCount, markNotificationsAsRead,
    markAllNotificationsAsRead, deleteNotification
} from "../hooks/notification.hooks";

const NotificationBell = () => {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);


    const fetchUnreadCount = async () => {
        const data = await getUnreadCount();
        setUnreadCount(data.unreadCount);
    };


    const fetchNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
    };


    useEffect(() => {
        fetchUnreadCount();
    }, []);


    const handleClick = async () => {

        setOpen(!open);

        if (!open) {
            await fetchNotifications();
        }
    };

    const handleNotificationClick = async (notification) => {

        if (!notification.is_read) {

            await markNotificationsAsRead(
                notification.id
            );


            setNotifications(prev =>
                prev.map(item =>
                    item.id === notification.id
                        ? {
                            ...item,
                            is_read: true
                        }
                        : item
                )
            );


            setUnreadCount(prev =>
                Math.max(prev - 1, 0)
            );
        }
        setOpen(false);

    };

    const handleMarkAllRead = async () => {

        await markAllNotificationsAsRead();


        setNotifications(prev =>
            prev.map(notification => ({
                ...notification,
                is_read: true
            }))
        );


        setUnreadCount(0);

    };
    const handleDeleteNotification = async (id) => {

        await deleteNotification(id);


        setNotifications(prev =>
            prev.filter(
                notification =>
                    notification.id !== id
            )
        );

    };

    const getNotificationText = (notification) => {

        switch (notification.type) {

            case "PASSENGER_JOINED":
                return {
                    title: "New Passenger Request",
                    message: "Someone wants to join your ride"
                };


            case "RIDE_REQUEST_CREATED":
                return {
                    title: "New Ride Request",
                    message: "A student is looking for a ride"
                };


            case "PASSENGER_ACCEPTED":
                return {
                    title: "Ride Accepted",
                    message: "Your ride request was accepted"
                };


            case "PASSENGER_REJECTED":
                return {
                    title: "Ride Rejected",
                    message: "Your ride request was rejected"
                };


            default:
                return {
                    title: notification.title,
                    message: notification.message
                };
        }

    };

    return (
        <div className="relative">

            <button
                onClick={handleClick}
                className="flex items-center w-full px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >

                <div className="relative">

                    <Bell size={20} />

                    {unreadCount > 0 && (
                        <span
                            className="
              absolute -top-2 -right-2 
              bg-red-500 text-white 
              text-xs rounded-full 
              h-5 w-5 flex items-center justify-center
              "
                        >
                            {unreadCount}
                        </span>
                    )}

                </div>

                <span className="ml-3">
                    Notifications
                </span>

            </button>



            {open && (

                <div
                    className="
          absolute left-64 top-0 
          w-80 bg-white 
          border rounded-lg shadow-lg
          z-50
          "
                >

                    <div className="p-4 border-b flex justify-between items-center">

                        <span className="font-semibold">
                            Notifications
                        </span>

                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="
                                text-xs text-purple-600 
                                hover:underline
                                "
                            >
                                Mark all read
                            </button>
                        )}

                    </div>


                    <div className="max-h-96 overflow-y-auto">

                        {
                            notifications.length === 0 ? (

                                <p className="p-4 text-gray-500 text-sm">
                                    No notifications
                                </p>

                            ) : (

                                notifications.map(notification => {

                                    const notificationText =
                                        getNotificationText(notification);


                                    return (

                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`
                p-4 border-b hover:bg-gray-50 cursor-pointer
                ${!notification.is_read
                                                    ? "bg-purple-50"
                                                    : ""}
            `}
                                        >

                                            <div className="flex justify-between items-start">

                                                <div>

                                                    <p className="font-medium text-sm">
                                                        {notificationText.title}
                                                    </p>


                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {notificationText.message}
                                                    </p>

                                                </div>


                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNotification(notification.id);
                                                    }}
                                                    className="
                        text-gray-400
                        hover:text-red-500
                        transition
                        p-1
                        rounded-full
                        hover:bg-red-50
                    "
                                                    title="Delete notification"
                                                >

                                                    <Trash2 size={16} />

                                                </button>


                                            </div>


                                        </div>

                                    );

                                })

                            )
                        }

                    </div>


                </div>

            )}

        </div>
    );
};


export default NotificationBell;