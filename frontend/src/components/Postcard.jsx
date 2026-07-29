import { useState } from "react";
import { joinRide, getParticipants } from "../hooks/rideParticipant.hooks";
const PostCard = ({ post, isJoined }) => {
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);


  const handleJoinRide = async () => {
    try {
      await joinRide(post.id);
      alert("Ride request sent successfully");
    } catch (err) {
      alert(err.message)
    }
  };


  const handleViewParticipants = async () => {
    try {
      const data = await getParticipants(post.id);

      setParticipants(data);
      setShowParticipants(true);

    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-lg">
            {post.title}
          </h3>


          {post.owner && (
            <p className="text-sm text-gray-500 mt-1">
              👤 {post.owner.name} • {post.owner.email}
            </p>
          )}

        </div>


        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
          {post.type.replace("_", " ")}
        </span>

      </div>


      {/* Description */}
      <p className="text-gray-600 mt-3">
        {post.description}
      </p>


      {/* Details */}
      <div className="mt-5 space-y-2 text-sm">

        <div>
          <strong>Pickup:</strong> {post.pickup_location}
        </div>

        <div>
          <strong>Destination:</strong> {post.destination}
        </div>

        <div>
          <strong>Date:</strong>{" "}
          {post.ride_datetime
            ? new Date(post.ride_datetime).toLocaleString()
            : "N/A"}
        </div>

        {post.type === "RIDE_OFFER" && (
          <>
            <div>
              <strong>Seats:</strong> {post.seats ?? "N/A"}
            </div>

            <div>
              <strong>Price:</strong>{" "}
              {post.price != null ? `$${post.price}` : "Free"}
            </div>
          </>
        )}

      </div>


      {/* Ride Actions */}
      {post.type === "RIDE_OFFER" && (
        <div className="mt-5 flex gap-3">

          <button
            disabled={isJoined}
            onClick={handleJoinRide}
            className={`px-4 py-2 rounded ${isJoined
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-purple-600 text-white"
              }`}
          >
            {isJoined ? "Joined" : "Join Ride"}
          </button>


          <button
            onClick={handleViewParticipants}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            View Participants
          </button>

        </div>
      )}



      {/* Participants */}
      {showParticipants && (
        <div className="mt-5 border-t pt-4">

          <h4 className="font-semibold mb-2">
            Participants
          </h4>


          {participants.length === 0 ? (
            <p className="text-gray-500">
              No participants yet
            </p>
          ) : (

            participants.map((participant) => (
              <div
                key={participant.id}
                className="text-sm flex justify-between"
              >

                <span>
                  {participant.participant?.name}
                </span>

                <span className="text-gray-500">
                  {participant.status}
                </span>

              </div>
            ))

          )}

        </div>
      )}

    </div>
  );
};
export default PostCard;