import { useEffect, useState } from "react";
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
      <div className="bg-white rounded-xl p-6 shadow mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Find nearby rides
        </h2>

        <LocationAutocomplete
          name="pickup"
          value={pickupInput}
          placeholder="Enter your pickup location"
          onChange={(e) => {
            setPickupInput(e.target.value);
            setPickup(null);
            setHasSearched(false);
            setRideOffers([]);
            setRideRequests([]);
            setError(null);// invalidate previous selection if user edits text
          }}
          onSelect={(location) => {
            setPickup(location);
            setPickupInput(location.formatted);
          }}
        />

        <button
          onClick={handleSearch}
          disabled={!pickup || loading}
          className="mt-4 bg-[#16213E] text-white px-5 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search Nearby Rides"}
        </button>
      </div>

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


      {!hasSearched ? (
        <div className="text-center py-10 text-gray-500">
          Search for a pickup location to find nearby rides.
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