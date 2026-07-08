import { useState } from "react";
import { createPost, updatePost } from "../hooks/user.hooks";
import {
  Car,
  MapPin,
  Navigation2,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  Send,
  X,
} from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  pickup_location: "",
  destination: "",
  ride_datetime: "",
  seats: 1,
  price: "",
};

// <input type="datetime-local"> only accepts "YYYY-MM-DDTHH:mm" (local time,
// no seconds, no timezone). API values usually come back as full ISO strings
// (e.g. "2026-07-10T14:30:00.000Z"), which the input silently rejects.
const toDatetimeLocalValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// Normalizes a ride record from the API into the form's shape.
const toFormState = (ride) => ({
  title: ride?.title ?? "",
  description: ride?.description ?? "",
  pickup_location: ride?.pickup_location ?? "",
  destination: ride?.destination ?? "",
  ride_datetime: toDatetimeLocalValue(ride?.ride_datetime),
  seats: ride?.seats ?? 1,
  price: ride?.price ?? "",
});

/**
 * CreateRide
 *
 * Handles both creating a new ride post and editing an existing one.
 *
 * Props:
 * - mode: "create" | "edit" (default "create")
 * - ride: the existing ride record, required when mode === "edit"
 * - onSuccess(updatedOrCreatedRide): called after a successful create/update
 * - onClose(): called when the user dismisses the form (X button / cancel)
 */
const CreateRide = ({ mode = "create", ride = null, onSuccess, onClose }) => {
  const isEdit = mode === "edit";

  const [tab, setTab] = useState(ride?.type === "RIDE_OFFER" ? "OFFER" : "REQUEST");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(isEdit ? toFormState(ride) : emptyForm);

  const isOffer = tab === "OFFER";
  const isFormValid = (() => {
  const commonFieldsValid =
    form.title.trim() &&
    form.pickup_location.trim() &&
    form.destination.trim() &&
    form.ride_datetime;

  if (!commonFieldsValid) return false;

  if (isOffer) {
    return (
      Number(form.seats) > 0 &&
      form.price !== "" &&
      Number(form.price) >= 0
    );
  }

  return true;
})();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
    alert("Please fill in all required fields.");
    return;
    }
    try {
      setLoading(true);

      // Postgres numeric columns reject "" — send null instead, and only
      // include seats/price at all when the post is an offer.
      const payload = {
        type: isOffer ? "RIDE_OFFER" : "RIDE_REQUEST",
        title: form.title,
        description: form.description,
        pickup_location: form.pickup_location,
        destination: form.destination,
        ride_datetime: form.ride_datetime
          ? new Date(form.ride_datetime).toISOString()
          : null,
        seats: isOffer ? Number(form.seats) || 1 : null,
        price: isOffer && form.price !== "" ? Number(form.price) : null,
      };

      const result = isEdit
        ? await updatePost(ride.id ?? ride._id, payload)
        : await createPost(payload);

      onSuccess?.(result, { isEdit });
      if (!isEdit) setForm(emptyForm);
    } catch (err) {
      console.error(err);
      alert(err.message || `Failed to ${isEdit ? "update" : "post"} ride`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(22,33,62,0.06),0_12px_32px_-16px_rgba(22,33,62,0.15)] border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-lg font-bold text-[#16213E]">
          {isEdit ? "Edit ride" : "Create a ride"}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Segmented tab toggle — locked once editing, since type shouldn't change mid-edit */}
      <div className="p-6 pb-0">
        <div className="relative flex bg-slate-100 rounded-xl p-1">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[#16213E] shadow-sm transition-transform duration-300 ease-out ${
              isOffer ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
            }`}
          />
          <button
            type="button"
            disabled={isEdit}
            onClick={() => setTab("REQUEST")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              !isOffer ? "text-white" : "text-slate-500 hover:text-slate-700"
            } ${isEdit ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <Navigation2 size={15} />
            Request a ride
          </button>
          <button
            type="button"
            disabled={isEdit}
            onClick={() => setTab("OFFER")}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isOffer ? "text-white" : "text-slate-500 hover:text-slate-700"
            } ${isEdit ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <Car size={15} />
            Offer a ride
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#16213E] mb-1.5">
            Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={
              isOffer ? "e.g. Friday evening ride to downtown" : "e.g. Need a ride to campus"
            }
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-[#16213E] placeholder:text-slate-400 outline-none transition focus:border-[#0F9D8E] focus:ring-4 focus:ring-[#0F9D8E]/10"
          />
        </div>

        {/* Route: pickup -> destination, connected by a line to read as a journey */}
        <div className="relative pl-8">
          <div className="absolute left-[7px] top-3 bottom-8 w-px bg-slate-200" />

          <div className="relative mb-5">
            <span className="absolute -left-8 top-3 h-3 w-3 rounded-full border-2 border-[#0F9D8E] bg-white" />
            <label className="block text-sm font-medium text-[#16213E] mb-1.5">
              Pickup location
            </label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="pickup_location"
                value={form.pickup_location}
                onChange={handleChange}
                placeholder="Enter pickup location"
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm text-[#16213E] placeholder:text-slate-400 outline-none transition focus:border-[#0F9D8E] focus:ring-4 focus:ring-[#0F9D8E]/10"
              />
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-8 top-3 h-3 w-3 rounded-full border-2 border-[#F5A623] bg-white" />
            <label className="block text-sm font-medium text-[#16213E] mb-1.5">
              Destination
            </label>
            <div className="relative">
              <Navigation2
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="Enter destination"
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm text-[#16213E] placeholder:text-slate-400 outline-none transition focus:border-[#0F9D8E] focus:ring-4 focus:ring-[#0F9D8E]/10"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#16213E] mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add any details riders or drivers should know"
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-[#16213E] placeholder:text-slate-400 outline-none transition resize-none focus:border-[#0F9D8E] focus:ring-4 focus:ring-[#0F9D8E]/10"
          />
        </div>

        {/* Date/time + Offer-only fields */}
        <div className={`grid gap-4 ${isOffer ? "grid-cols-3" : "grid-cols-1"}`}>
          <div className={isOffer ? "col-span-3 sm:col-span-1" : ""}>
            <label className="block text-sm font-medium text-[#16213E] mb-1.5">
              Date &amp; time
            </label>
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="datetime-local"
                name="ride_datetime"
                value={form.ride_datetime}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm text-[#16213E] outline-none transition focus:border-[#0F9D8E] focus:ring-4 focus:ring-[#0F9D8E]/10"
              />
            </div>
          </div>

          {isOffer && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#16213E] mb-1.5">
                  Seats
                </label>
                <div className="relative">
                  <Users
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    min={1}
                    name="seats"
                    value={form.seats}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm text-[#16213E] outline-none transition focus:border-[#0F9D8E] focus:ring-4 focus:ring-[#0F9D8E]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#16213E] mb-1.5">
                  Price
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    min={0}
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-3.5 py-2.5 text-sm text-[#16213E] placeholder:text-slate-400 outline-none transition focus:border-[#0F9D8E] focus:ring-4 focus:ring-[#0F9D8E]/10"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-lg transition-colors ${
            loading || !isFormValid
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#16213E] hover:bg-[#1E2A4A]"
            }`}
            >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isEdit ? "Saving..." : "Posting..."}
              </>
            ) : (
              <>
                <Send size={15} />
                {isEdit ? "Save changes" : isOffer ? "Post ride offer" : "Post ride request"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRide;