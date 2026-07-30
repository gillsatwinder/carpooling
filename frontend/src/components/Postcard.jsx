import { useState } from "react";
import { joinRide, getParticipants } from "../hooks/rideParticipant.hooks";
const PostCard = ({ post, isJoined }) => {
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);

  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);


  const handleJoinRide = async (role) => {
    try {
      await joinRide(post.id, role);
      alert(`Ride request sent successfully as ${role.toLowerCase()}`);
      setSelectedRole(role);
      setShowRoleSelection(false);
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
        <div className="mt-5">

          <div className="flex gap-3">
            <button
              disabled={isJoined}
              onClick={() => setShowRoleSelection(true)}
              className={`px-4 py-2 rounded ${isJoined
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
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

          {/* Role Selection */}
          {showRoleSelection && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <p className="font-semibold mb-3">
                How would you like to join this ride?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleJoinRide("PASSENGER")}
                  className="flex-1 px-4 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Passenger
                </button>

                <button
                  onClick={() => handleJoinRide("DRIVER")}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  Driver
                </button>
              </div>

              <button
                onClick={() => setShowRoleSelection(false)}
                className="mt-3 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}

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
                  className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0"
                >
                  {/* Participant */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {participant.participant?.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {participant.participant?.email}
                    </p>
                  </div>

                  {/* Role */}
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${participant.role === "DRIVER"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {participant.role}
                  </span>

                  {/* Status */}
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${participant.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : participant.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : participant.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                  >
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