import { useEffect, useState, useCallback } from "react";
import {
  getMyJoinedRides,
  cancelRequest,
  leaveRide,
} from "../hooks/rideParticipant.hooks";

import {
  MapPin,
  Navigation2,
  Calendar,
  Users,
  Loader2,
  XCircle,
  LogOut,
  Inbox,
} from "lucide-react";


const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};


const formatDateTime = (value) => {
  if (!value) return "No date";

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};



const RequestedRideCard = ({
  rideRequest,
  onCancel,
  onLeave,
}) => {

  const [loading, setLoading] = useState(false);

  const ride = rideRequest.post;


  const handleCancel = async () => {

    try {

      setLoading(true);

      await onCancel(rideRequest.id);

    } finally {

      setLoading(false);

    }

  };


  const handleLeave = async () => {

    try {

      setLoading(true);

      await onLeave(rideRequest.id);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">


      {/* Header */}

      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg text-[#16213E]">
            {ride.title || "Ride"}
          </h2>

          <span
            className={`text-xs px-2 py-1 rounded-full font-small ${ride.type === "RIDE_OFFER"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
              }`}
          >
            {ride.type === "RIDE_OFFER" ? "Ride Offer" : "Ride Request"}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[rideRequest.status]}`}
          >
            {rideRequest.status}
          </span>
        </div>

        <p className="text-sm text-slate-500 mt-1">
          Requested by you
        </p>
      </div>



      {/* Route */}

      <div className="space-y-2 text-sm text-slate-600">

        <div className="flex gap-2">
          <MapPin size={15} />
          {ride.pickup_location}
        </div>


        <div className="flex gap-2">
          <Navigation2 size={15} />
          {ride.destination}
        </div>


        <div className="flex gap-2">
          <Calendar size={15} />
          {formatDateTime(ride.ride_datetime)}
        </div>


        {ride.seats && (
          <div className="flex gap-2">
            <Users size={15} />
            {ride.seats} seats
          </div>
        )}

      </div>



      {/* Actions */}

      {
        rideRequest.status === "PENDING" && (

          <button
            onClick={handleCancel}
            disabled={loading}
            className="
              mt-5 w-full flex items-center justify-center gap-2
              border border-red-200 text-red-600
              rounded-lg py-2 hover:bg-red-50
            "
          >

            {
              loading
                ? <Loader2 size={15} className="animate-spin" />
                : <XCircle size={15} />
            }

            Cancel Request

          </button>

        )
      }



      {["ACCEPTED", "REJECTED"].includes(rideRequest.status) && (
        <button
          onClick={handleLeave}
          disabled={loading}
          className="
          mt-5 w-full flex items-center justify-center gap-2
          border border-orange-200 text-orange-600
          rounded-lg py-2 hover:bg-orange-50
        "
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <LogOut size={15} />
          )}

          Leave Ride
        </button>
      )}


    </div>

  );
};





const MyRequestedRides = () => {


  const [rides, setRides] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  const fetchRides = useCallback(async () => {

    try {

      setLoading(true);

      const data = await getMyJoinedRides();

      setRides(data);


    } catch (err) {

      setError(
        err.message || "Failed to load rides"
      );

    } finally {

      setLoading(false);

    }


  }, []);



  useEffect(() => {

    fetchRides();

  }, [fetchRides]);





  const handleCancel = async (participantId) => {

    await cancelRequest(participantId);

    fetchRides();

  };



  const handleLeave = async (participantId) => {


    await leaveRide(participantId);

    fetchRides();

  };





  if (loading) {

    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  }



  if (error) {

    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );

  }



  return (

    <div className="min-h-screen bg-[#F5F7FA] p-8">


      <div className="max-w-3xl mx-auto">


        <h1 className="text-3xl font-bold text-[#16213E] mb-8">
          My Requested Rides
        </h1>



        {
          rides.length === 0 ? (

            <div className="bg-white rounded-xl p-10 text-center">

              <Inbox className="mx-auto text-slate-300 mb-3" />

              <p className="text-slate-500">
                You have not requested any rides yet
              </p>

            </div>


          ) : (

            <div className="space-y-4">

              {
                rides.map((ride) => (
                  <RequestedRideCard
                    key={ride.id}
                    rideRequest={ride}
                    onCancel={handleCancel}
                    onLeave={handleLeave}
                  />
                ))
              }

            </div>

          )
        }


      </div>


    </div>

  );

};


export default MyRequestedRides;