import { useMemo, useEffect, useState } from "react";
import { getAllRideOffers } from "../hooks/user.hooks";
import { getMyJoinedRides } from "../hooks/rideParticipant.hooks";
import CreateRide from "../components/CreateRide"
import DashboardSection from "../components/DashboardSection";
import { Plus, X } from "lucide-react";
const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedRideIds, setJoinedRideIds] = useState([]);
  const [showCreateRide, setShowCreateRide] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {

        const [postsData, joinedData] = await Promise.all([
          getAllRideOffers(),
          getMyJoinedRides()
        ]);

        setPosts(postsData);

        const joinedIds = joinedData.map(
          (ride) => ride.post_id
        );

        setJoinedRideIds(joinedIds);

      } catch (err) {
        console.error(err);
        setError(err?.message || "Failed to fetch data");

      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleRideCreated = (newRide) => {
    if (newRide.type === "RIDE_OFFER") {
      setPosts((prev) => [
        newRide,
        ...prev
      ]);
    }
    setShowCreateRide(false);
  };


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Available Ride Offers
        </h1>

        <button
          onClick={() => setShowCreateRide(true)}
          className="
            flex items-center gap-2
            bg-[#16213E]
            text-white
            px-5 py-3
            rounded-xl
            hover:opacity-90
            transition
          "
        >
          <Plus size={20} />
          Post a Ride
        </button>
      </div>


      <DashboardSection
        title="Ride Offers"
        posts={posts}
        joinedRideIds={joinedRideIds}
      />

      {/* Create Ride Modal */}
      {showCreateRide && (
        <div
          className="
            fixed inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >

          <div
            className="
              bg-white
              rounded-2xl
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              shadow-xl
            "
          >

            <CreateRide
              onClose={() => setShowCreateRide(false)}
              onSuccess={handleRideCreated}
            />

          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;