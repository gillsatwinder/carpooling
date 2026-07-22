import { useMemo,useEffect,useState } from "react";
import { getAllPosts } from "../hooks/user.hooks";
import { getMyJoinedRides } from "../hooks/rideParticipant.hooks";
import DashboardSection from "../components/DashboardSection";

const Dashboard = () => {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joinedRideIds, setJoinedRideIds] = useState([]); 
   useEffect(() => {
    async function fetchData() {
    try {

      const [postsData, joinedData] = await Promise.all([
        getAllPosts(),
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


  const groupedPosts = useMemo(() => {
    return {
      rideOffers: posts.filter((post) => post.type === "RIDE_OFFER"),
      rideRequests: posts.filter((post) => post.type === "RIDE_REQUEST"),
      generalAds: posts.filter((post) => post.type === "GENERAL_AD"),
    };
  }, [posts]);

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

      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <DashboardSection
        title="Ride Offers"
        posts={groupedPosts.rideOffers}
        joinedRideIds={joinedRideIds}
      />

      <DashboardSection
        title="Ride Requests"
        posts={groupedPosts.rideRequests}
        joinedRideIds={joinedRideIds}
      />

      <DashboardSection
        title="General Ads"
        posts={groupedPosts.generalAds}
        joinedRideIds={joinedRideIds}
      />

    </div>
  );
};

export default Dashboard;