import { useState } from "react";
import { createPost } from "../hooks/user.hooks";

const RideManagement = () => {
  const [tab, setTab] = useState("REQUEST");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    pickup_location: "",
    destination: "",
    ride_datetime: "",
    seats: 1,
    price: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        type: tab === "REQUEST" ? "RIDE_REQUEST" : "RIDE_OFFER",
        ...form,
      };

      await createPost(payload);

      alert("Posted successfully!");

      setForm({
        title: "",
        description: "",
        pickup_location: "",
        destination: "",
        ride_datetime: "",
        seats: 1,
        price: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("REQUEST")}
          className={`px-4 py-2 rounded-lg ${
            tab === "REQUEST"
              ? "bg-purple-600 text-white"
              : "bg-gray-100"
          }`}
        >
          🚗 Request Ride
        </button>

        <button
          onClick={() => setTab("OFFER")}
          className={`px-4 py-2 rounded-lg ${
            tab === "OFFER"
              ? "bg-purple-600 text-white"
              : "bg-gray-100"
          }`}
        >
          📢 Offer Ride
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Pickup */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Pickup Location
          </label>
          <input
            name="pickup_location"
            value={form.pickup_location}
            onChange={handleChange}
            placeholder="Enter pickup location"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Destination
          </label>
          <input
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="Enter destination"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Ride Date & Time
          </label>
          <input
            type="datetime-local"
            name="ride_datetime"
            value={form.ride_datetime}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Seats (Only OFFER) */}
        {tab === "OFFER" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">
                Seats
              </label>
              <input
                type="number"
                name="seats"
                value={form.seats}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          {loading ? "Posting..." : "Submit"}
        </button>

      </form>
    </div>
  );
};

export default RideManagement;