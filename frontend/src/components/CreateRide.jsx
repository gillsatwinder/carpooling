import { useState } from "react";
import { createPost, updatePost } from "../hooks/user.hooks";
import LocationAutocomplete from "./LocationAutoComplete";
import {
  Car,
  Navigation2,
  X,
} from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  pickup_location: "",
  pickup_lat: null,
  pickup_lng: null,
  destination: "",
  destination_lat: null,
  destination_lng: null,
  ride_datetime: "",
  seats: 1,
  price: "",
  allow_carpool: false,
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
  pickup_lat: ride?.pickup_lat ?? null,
  pickup_lng: ride?.pickup_lng ?? null,
  destination: ride?.destination ?? "",
  destination_lat: ride?.destination_lat ?? null,
  destination_lng: ride?.destination_lng ?? null,
  ride_datetime: toDatetimeLocalValue(ride?.ride_datetime),
  seats: ride?.seats ?? 1,
  price: ride?.price ?? "",
  allow_carpool: ride?.allow_carpool ?? false,
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
  const [step, setStep] = useState(1);
  const isEdit = mode === "edit";

  const [tab, setTab] = useState(ride?.type === "RIDE_OFFER" ? "OFFER" : "REQUEST");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(isEdit ? toFormState(ride) : emptyForm);
  const isOffer = tab === "OFFER";

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {

    setStep((prev) => prev - 1);

  };
  const totalSteps = isOffer ? 5 : 4;

  const isPickupValid =
    form.pickup_location &&
    form.pickup_lat &&
    form.pickup_lng;


  const isDestinationValid =
    form.destination &&
    form.destination_lat &&
    form.destination_lng;

  const canContinue = () => {
    switch (step) {
      case 1:
        return true;

      case 2:
        return (
          isPickupValid &&
          isDestinationValid
        );

      case 3:
        return form.ride_datetime;

      case 4:
        if (!isOffer) {
          return true;
        }

        return (
          Number(form.seats) > 0 &&
          form.price !== "" &&
          Number(form.price) >= 0
        );

      case 5:
        return true;

      default:
        return false;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canContinue() && step === 5) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);

      // Postgres numeric columns reject "" — send null instead, and only
      // include seats/price at all when the post is an offer.
      const payload = {
        type: isOffer ? "RIDE_OFFER" : "RIDE_REQUEST",
        title: `${form.pickup_location} → ${form.destination}`,
        description: form.description,
        pickup_location: form.pickup_location,
        pickup_lat: form.pickup_lat,
        pickup_lng: form.pickup_lng,
        destination: form.destination,
        destination_lat: form.destination_lat,
        destination_lng: form.destination_lng,
        ride_datetime: form.ride_datetime
          ? new Date(form.ride_datetime).toISOString()
          : null,
        seats: isOffer ? Number(form.seats) : 1,
        price: isOffer && form.price !== "" ? Number(form.price) : null,

        // only requests can allow carpool
        allow_carpool: !isOffer && form.allow_carpool,
      };

      console.log(payload);

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
    <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(22,33,62,0.06),0_12px_32px_-16px_rgba(22,33,62,0.15)] border border-slate-100 overflow-visible">
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

      <div className="px-6 pt-4">
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${s <= step
                ? "bg-[#16213E]"
                : "bg-slate-200"
                }`}
            />
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-2">
          Step {step} of {isOffer ? 5 : 4}
        </p>
      </div>






      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {step === 1 && (
          <div className="py-6">
            <h3 className="text-xl font-semibold text-[#16213E] mb-2">
              What do you need?
            </h3>

            <p className="text-slate-500 mb-6">
              Choose whether you're looking for a ride or offering one.
            </p>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setTab("REQUEST")}
                className={`w-full rounded-xl border p-5 text-left transition ${!isOffer
                  ? "border-[#16213E] bg-[#16213E] text-white"
                  : "border-slate-200 hover:border-[#16213E]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Navigation2 size={24} />
                  <div>
                    <h4 className="font-semibold">Request a Ride</h4>
                    <p className="text-sm opacity-80">
                      I'm looking for someone driving my way.
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTab("OFFER")}
                className={`w-full rounded-xl border p-5 text-left transition ${isOffer
                  ? "border-[#16213E] bg-[#16213E] text-white"
                  : "border-slate-200 hover:border-[#16213E]"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <Car size={24} />
                  <div>
                    <h4 className="font-semibold">Offer a Ride</h4>
                    <p className="text-sm opacity-80">
                      I have available seats.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Route: pickup -> destination, connected by a line to read as a journey */}
        {step === 2 && (
          <div className="space-y-6">

            <div>
              <h3 className="text-xl font-semibold text-[#16213E]">
                Where are you going?
              </h3>

              <p className="text-slate-500 mt-1">
                Choose your pickup and destination.
              </p>
            </div>

            <div>

              <label className="font-medium mb-2 block">
                Pickup Location
              </label>

              <LocationAutocomplete
                name="pickup_location"
                value={form.pickup_location}
                onSelect={(location) => {

                  setForm(prev => ({
                    ...prev,

                    pickup_location: location.formatted,
                    pickup_lat: location.lat,
                    pickup_lng: location.lon
                  }));

                }}
                placeholder="Pickup location"
                onChange={handleChange}
              />

            </div>

            <div>

              <label className="font-medium mb-2 block">
                Destination
              </label>

              <LocationAutocomplete
                name="destination"
                value={form.destination}
                onSelect={(location) => {

                  setForm(prev => ({
                    ...prev,

                    destination: location.formatted,
                    destination_lat: location.lat,
                    destination_lng: location.lon
                  }));

                }}
                placeholder="Destination"
                onChange={handleChange}
              />

            </div>

          </div>
        )}


        {/* Date/time + Offer-only fields */}
        {step === 3 && (
          <div className="space-y-6">

            <div>
              <h3 className="text-xl font-semibold text-[#16213E]">
                When are you travelling?
              </h3>

              <p className="text-slate-500">
                Select your departure time.
              </p>
            </div>

            <div>

              <label className="block mb-2 font-medium">
                Date & Time
              </label>

              <input
                type="datetime-local"
                name="ride_datetime"
                value={form.ride_datetime}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-4 py-3"
              />

            </div>
            {!isOffer && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#16213E]">
                  Allow Carpooling?
                </h3>

                <p className="text-sm text-slate-500 mb-4">
                  If enabled, drivers can convert your request into a shared ride
                  and offer additional seats to other passengers.
                </p>

                <div className="flex gap-4">

                  <button
                    type="button"
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        allow_carpool: true
                      }))
                    }
                    className={`px-5 py-3 rounded-xl border ${form.allow_carpool
                        ? "bg-[#16213E] text-white"
                        : "border-slate-300"
                      }`}
                  >
                    Yes, allow carpool
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setForm(prev => ({
                        ...prev,
                        allow_carpool: false
                      }))
                    }
                    className={`px-5 py-3 rounded-xl border ${!form.allow_carpool
                        ? "bg-[#16213E] text-white"
                        : "border-slate-300"
                      }`}
                  >
                    No, just me
                  </button>

                </div>
              </div>
            )}

          </div>
        )}
        {isOffer && step === 4 && (

          <div className="space-y-6">

            <div>
              <h3 className="text-xl font-semibold text-[#16213E]">
                {isOffer ? "Ride Details" : "Ride Requirements"}
              </h3>

              <p className="text-slate-500 mt-1">
                {isOffer
                  ? "Tell riders how many seats you have available."
                  : "Let drivers know how many seats you need or how many seats you’re willing to share."}
              </p>
            </div>

            <div>


              <div>
                <label className="block mb-2 font-medium">
                  Available Seats
                </label>

                <input
                  type="number"
                  min={1}
                  name="seats"
                  value={form.seats}
                  onChange={handleChange}
                  placeholder="Number of available seats"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3"
                />
              </div>


            </div>


            <div>

              <label className="block mb-2 font-medium">
                Price per rider
              </label>

              <input
                type="number"
                min={0}
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0 for free"
                className="w-full rounded-lg border border-slate-200 px-4 py-3"
              />

            </div>


          </div>

        )}

        {((isOffer && step === 5) || (!isOffer && step === 4)) && (

          <div className="space-y-5">

            <h3 className="text-xl font-semibold">

              Review Ride

            </h3>

            <div className="rounded-xl bg-slate-50 p-5">

              <p>

                <strong>Ride Type: </strong>

                {isOffer ? "Offer Ride" : "Request Ride"}

              </p>

              <p>

                <strong>Pickup: </strong>

                {form.pickup_location}

              </p>

              <p>

                <strong>Destination: </strong>

                {form.destination}

              </p>

              <p>

                <strong>Date: </strong>

                {form.ride_datetime
                  ? new Date(form.ride_datetime).toLocaleString()
                  : "-"}

              </p>

              {!isOffer && (
                <p>
                  <strong>Allow Carpooling: </strong>
                  {form.allow_carpool ? "Yes" : "No"}
                </p>
              ) }

              {isOffer && (
                <p>
                  <strong>Available Seats:</strong> {form.seats}
                </p>
              )}

              {isOffer && (
                <p>
                  <strong>Price: </strong>
                  ${form.price}
                </p>
              )}

            </div>

          </div>

        )}


        {/* Actions */}
        <div className="flex justify-between pt-6">


          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-lg border border-slate-300"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading || !canContinue()}
              className="px-6 py-3 rounded-lg bg-[#16213E] text-white disabled:opacity-60"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-[#16213E] text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? (isEdit ? "Updating..." : "Posting...")
                : (isEdit ? "Update Ride" : "Post Ride")}
            </button>
          )}


        </div>
      </form >
    </div >
  );
};

export default CreateRide;