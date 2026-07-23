import { useEffect, useState } from "react";
import { getAllRideRequests } from "../hooks/user.hooks";
import { getMyJoinedRides } from "../hooks/rideParticipant.hooks";
import DashboardSection from "../components/DashboardSection";

const RideRequests = () => {
  const [posts, setPosts] = useState([]);
  const [joinedRideIds, setJoinedRideIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rideRequests, joinedRides] = await Promise.all([
          getAllRideRequests(),
          getMyJoinedRides(),
        ]);

        setPosts(rideRequests);
        setJoinedRideIds(joinedRides.map((ride) => ride.post_id));
      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to fetch ride requests");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">
        Ride Requests
      </h1>

      <DashboardSection
        title="Ride Requests"
        posts={posts}
        joinedRideIds={joinedRideIds}
      />
    </div>
  );
};

export default RideRequests;