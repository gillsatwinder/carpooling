const notificationService = require("../services/notification.services");
const NotificationType =
    require("../constants/notification.constants");
const userRepository =
    require("../repositories/user.repository");


// Notify driver when someone creates a ride request
const notifyDriversAboutRideRequest = async (ride) => {


    const drivers =
        await userRepository.findAllDriversExceptUser(ride.owner_id);


    const notifications = drivers.map(driver => ({

        user_id: driver.id,

        type: NotificationType.RIDE_REQUEST_CREATED,

        reference_type: "POST",

        reference_id: ride.id,

        title: "New Ride Request",

        message:
        `New ride request from ${ride.pickup_location} to ${ride.destination}.`

    }));


    await Promise.all(
        notifications.map(notification =>
            notificationService.createNotification(notification)
        )
    );


    return notifications.length;

};




// Notify driver when passenger joins
const notifyPassengerJoined = async (
    driverId,
    passengerId,
    rideId
) => {

    return await notificationService.createNotification({

        user_id: driverId,

        type: NotificationType.PASSENGER_JOINED,

        reference_type: "RIDE_PARTICIPANT",

        reference_id: rideId,

        title: "New Passenger Request",

        message:
            "A passenger wants to join your ride"

    });

};



module.exports = {
    notifyDriversAboutRideRequest,
    notifyPassengerJoined
};