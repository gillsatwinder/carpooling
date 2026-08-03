const notificationController = require("../controllers/notification.controller");

const notificationService = require("../services/notification.services");

jest.mock("../services/notification.services");


describe("Notification Controller", () => {


    let req;
    let res;


    beforeEach(() => {

        req = {
            user: {
                id: 1
            },
            params: {}
        };


        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };


        jest.clearAllMocks();

    });



    describe("getNotifications", () => {


        it("should return user notifications", async () => {

            const notifications = [
                {
                    id: 1,
                    title: "New Ride Request"
                }
            ];


            notificationService.getUserNotifications
                .mockResolvedValue(notifications);



            await notificationController.getNotifications(
                req,
                res
            );


            expect(
                notificationService.getUserNotifications
            )
            .toHaveBeenCalledWith(1);



            expect(res.status)
                .toHaveBeenCalledWith(200);



            expect(res.json)
                .toHaveBeenCalledWith(notifications);

        });



        it("should return 500 when service fails", async()=>{


            notificationService.getUserNotifications
                .mockRejectedValue(
                    new Error("Database error")
                );


            await notificationController.getNotifications(
                req,
                res
            );


            expect(res.status)
                .toHaveBeenCalledWith(500);


            expect(res.json)
                .toHaveBeenCalledWith({
                    error:"Database error"
                });

        });

    });





    describe("getUnreadCount",()=>{


        it("should return unread notification count", async()=>{


            notificationService.getUnreadCount
                .mockResolvedValue(5);



            await notificationController.getUnreadCount(
                req,
                res
            );


            expect(
                notificationService.getUnreadCount
            )
            .toHaveBeenCalledWith(1);



            expect(res.status)
                .toHaveBeenCalledWith(200);



            expect(res.json)
                .toHaveBeenCalledWith({
                    unreadCount:5
                });


        });


    });





    describe("markAsRead",()=>{


        it("should mark notification as read", async()=>{


            req.params.id = 10;


            const notification = {
                id:10,
                is_read:true
            };


            notificationService.markAsRead
                .mockResolvedValue(notification);



            await notificationController.markAsRead(
                req,
                res
            );



            expect(
                notificationService.markAsRead
            )
            .toHaveBeenCalledWith(
                10,
                1
            );


            expect(res.status)
                .toHaveBeenCalledWith(200);



            expect(res.json)
                .toHaveBeenCalledWith(notification);


        });



        it("should return 404 if notification not found", async()=>{


            req.params.id = 99;


            notificationService.markAsRead
                .mockRejectedValue(
                    new Error("Notification not found")
                );



            await notificationController.markAsRead(
                req,
                res
            );


            expect(res.status)
                .toHaveBeenCalledWith(404);


            expect(res.json)
                .toHaveBeenCalledWith({
                    error:"Notification not found"
                });


        });


    });






    describe("markAllAsRead",()=>{


        it("should mark all notifications as read", async()=>{


            const result = {
                message:"All notifications marked as read"
            };


            notificationService.markAllAsRead
                .mockResolvedValue(result);



            await notificationController.markAllAsRead(
                req,
                res
            );



            expect(
                notificationService.markAllAsRead
            )
            .toHaveBeenCalledWith(1);



            expect(res.status)
                .toHaveBeenCalledWith(200);



            expect(res.json)
                .toHaveBeenCalledWith(result);


        });


    });






    describe("deleteNotification",()=>{


        it("should delete notification", async()=>{


            req.params.id = 5;


            const result = {
                message:"Notification deleted successfully"
            };


            notificationService.deleteNotification
                .mockResolvedValue(result);



            await notificationController.deleteNotification(
                req,
                res
            );



            expect(
                notificationService.deleteNotification
            )
            .toHaveBeenCalledWith(
                5,
                1
            );



            expect(res.status)
                .toHaveBeenCalledWith(200);



            expect(res.json)
                .toHaveBeenCalledWith(result);


        });



        it("should return 404 when delete fails", async()=>{


            req.params.id = 5;


            notificationService.deleteNotification
                .mockRejectedValue(
                    new Error("Notification not found")
                );



            await notificationController.deleteNotification(
                req,
                res
            );



            expect(res.status)
                .toHaveBeenCalledWith(404);



            expect(res.json)
                .toHaveBeenCalledWith({
                    error:"Notification not found"
                });


        });


    });



});