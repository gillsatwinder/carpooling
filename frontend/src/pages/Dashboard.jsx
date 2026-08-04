import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchNearbyPosts } from "../hooks/user.hooks";
import { getMyJoinedRides } from "../hooks/rideParticipant.hooks";
import CreateRide from "../components/CreateRide"
import DashboardSection from "../components/DashboardSection";
import { Plus } from "lucide-react";
import LocationAutocomplete from "../components/LocationAutoComplete";
const Dashboard = () => {
  const [pickup, setPickup] = useState(null);
  const [pickupInput, setPickupInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [rideOffers, setRideOffers] = useState([]);
  const [rideRequests, setRideRequests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joinedRideIds, setJoinedRideIds] = useState([]);
  const [showCreateRide, setShowCreateRide] = useState(false);
  useEffect(() => {
    async function loadJoinedRides() {
      try {
        const joined = await getMyJoinedRides();

        setJoinedRideIds(
          joined.map(ride => ride.post_id)
        );
      } catch (err) {
        console.error(err);
      }
    }

    loadJoinedRides();
  }, []);

  const handleRideCreated = async () => {
    setShowCreateRide(false);

    try {
      if (pickup) {
        await handleSearch();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleSearch = async () => {
    if (!pickup) return;

    setError(null);
    try {
      setLoading(true);

      const data = await searchNearbyPosts({
        lat: pickup.lat,
        lng: pickup.lon
      });
      setRideOffers(data.offers);
      setRideRequests(data.requests);

      setHasSearched(true);

    } catch (err) {
      setError(err?.error || err?.message || "Failed to search nearby rides.");

    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-600">
          {error}
        </div>
      )}
      {/* NEW: moved here — sits at the true top-left corner of the content area */}
    <div className="max-w-6xl mx-auto px-6 flex gap-4 mb-2">
      <Link
        to="/ride-management"
        className="text-sm text-gray-500 hover:text-purple-600 transition"
      >
        My Rides
      </Link>
      <Link
        to="/my-requested-rides"
        className="text-sm text-gray-500 hover:text-purple-600 transition"
      >
        Joined Rides
      </Link>
    </div>
      <button
        onClick={() => setShowCreateRide(true)}
        className="
        fixed
        bottom-8
        right-8
        flex
        items-center
        gap-2
        bg-[#16213E]
        text-white
        px-6
        py-4
        rounded-full
        shadow-lg
        hover:bg-[#1c2d55]
        hover:shadow-xl
        hover:-translate-y-0.5
        transition-all
        duration-200
      "
      >
        <Plus size={22} />
        <span className="font-medium whitespace-nowrap">
          Create Ride
        </span>
      </button>
      {/* Hero Search */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
             
        <h1 className="text-5xl font-bold text-center text-[#16213E] mb-10">
          Where are you heading?
        </h1>

        <div className="bg-white rounded-3xl shadow-lg p-4 flex gap-4 items-center">

          <div className="flex-1">
            <LocationAutocomplete
              name="pickup"
              value={pickupInput}
              placeholder="Pickup location"
              onChange={(e) => {
                setPickupInput(e.target.value);
                setPickup(null);
                setHasSearched(false);
                setRideOffers([]);
                setRideRequests([]);
                setError(null);
              }}
              onSelect={(location) => {
                setPickup(location);
                setPickupInput(location.formatted);
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!pickup || loading}
            className="
          bg-[#16213E]
          text-white
          px-8
          py-3
          rounded-2xl
          font-semibold
          disabled:opacity-50
        "
          >
            {loading ? "Searching..." : "Search Rides"}
          </button>

        </div>

      </section>

      {/* Results */}

      <section className="max-w-6xl mx-auto px-6 py-10">

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!hasSearched ? (
          <div className="text-center text-gray-500 py-16">
            Search for a pickup location to discover nearby rides.
          </div>
        ) : (
          <>
            <DashboardSection
              title="Nearby Ride Offers"
              posts={rideOffers}
              joinedRideIds={joinedRideIds}
            />

            <DashboardSection
              title="Nearby Ride Requests"
              posts={rideRequests}
              joinedRideIds={joinedRideIds}
            />
          </>
        )}

      </section>

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