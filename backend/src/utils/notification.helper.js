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




/// Notify ride owner when someone joins their ride
const notifyRideOwner = async (
    ownerId,
    participantId,
    rideId,
    role
) => {

    return await notificationService.createNotification({

        user_id: ownerId,

        type: role === "PASSENGER"
            ? NotificationType.PASSENGER_JOINED
            : NotificationType.DRIVER_JOINED,

        reference_type: "RIDE_PARTICIPANT",

        reference_id: participantId,

        title:
            role === "PASSENGER"
                ? "New Passenger Request"
                : "New Driver Request",

        message:
            role === "PASSENGER"
                ? "A passenger wants to join your ride"
                : "A driver wants to join your ride"

    });

};

const notifyParticipantAccepted = async (
    participantUserId,
    rideId,
    participantId
) => {

    return await notificationService.createNotification({

        user_id: participantUserId,

        type: NotificationType.PASSENGER_ACCEPTED,

        reference_type: "RIDE_PARTICIPANT",

        reference_id: participantId,

        title: "Ride Request Accepted",

        message:
            "Your request to join the ride has been accepted."

    });

};

const notifyParticipantRejected = async (
    participantUserId,
    rideId,
    participantId
) => {

    return await notificationService.createNotification({

        user_id: participantUserId,

        type: NotificationType.PASSENGER_REJECTED,

        reference_type: "RIDE_PARTICIPANT",

        reference_id: participantId,

        title: "Ride Request Rejected",

        message:
            "Your request to join the ride has been rejected."

    });

};

const notifyRideStatusChanged = async (
    participants,
    rideId,
    status
) => {

    const title =
        status === "CANCELLED"
            ? "Ride Cancelled"
            : "Ride Closed";


    const message =
        status === "CANCELLED"
            ? "The ride you joined has been cancelled by the owner."
            : "The ride you joined has been closed by the owner.";


    const notifications = participants.map(participant => ({
        
        user_id: participant.user_id,

        type:
            status === "CANCELLED"
                ? NotificationType.RIDE_CANCELLED
                : NotificationType.RIDE_CLOSED,

        reference_type: "POST",

        reference_id: rideId,

        title,

        message

    }));


    await Promise.all(
        notifications.map(notification =>
            notificationService.createNotification(notification)
        )
    );


    return notifications.length;
};


module.exports = {
    notifyDriversAboutRideRequest,
    notifyRideOwner,
    notifyParticipantAccepted,
    notifyParticipantRejected,
    notifyRideStatusChanged
};