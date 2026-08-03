const notificationService = require("../services/notification.services");


// GET /notifications
const getNotifications = async (req, res) => {

    try {

        const user_id = req.user.id;

        const notifications =
            await notificationService.getUserNotifications(user_id);


        res.status(200).json(notifications);

    } catch(error){

        res.status(500).json({
            error: error.message
        });

    }
};



// GET /notifications/unread-count
const getUnreadCount = async (req,res)=>{

    try{

        const user_id=req.user.id;

        const count =
            await notificationService.getUnreadCount(user_id);


        res.status(200).json({
            unreadCount: count
        });


    }catch(error){

        res.status(500).json({
            error:error.message
        });
    }
};




// PATCH /notifications/:id/read
const markAsRead = async(req,res)=>{

    try{

        const user_id=req.user.id;

        const notification =
            await notificationService.markAsRead(
                req.params.id,
                user_id
            );


        res.status(200).json(notification);


    }catch(error){

        res.status(404).json({
            error:error.message
        });
    }
};




// PATCH /notifications/read-all
const markAllAsRead = async(req,res)=>{

    try{

        const user_id=req.user.id;

        const result =
            await notificationService.markAllAsRead(user_id);


        res.status(200).json(result);


    }catch(error){

        res.status(500).json({
            error:error.message
        });
    }
};

const deleteNotification = async(req,res)=>{

    try{

        const user_id = req.user.id;


        const result =
            await notificationService.deleteNotification(
                req.params.id,
                user_id
            );


        res.status(200).json(result);


    }catch(error){

        res.status(404).json({
            error:error.message
        });

    }

};

module.exports={
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};