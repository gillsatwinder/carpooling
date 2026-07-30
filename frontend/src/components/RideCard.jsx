import {
  getParticipants,
  acceptParticipant,
  rejectParticipant,
} from "../hooks/rideParticipant.hooks";
import { useState } from "react";
import {
  Car,
  MapPin,
  Navigation2,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  Pencil,
  Ban,
} from "lucide-react";

const STATUS_STYLES = {
  ACTIVE: "bg-[#0F9D8E]/10 text-[#0F9D8E]",
  PENDING: "bg-[#F5A623]/10 text-[#B4790E]",
  CANCELLED: "bg-slate-100 text-slate-400",
  COMPLETED: "bg-[#16213E]/10 text-[#16213E]",
};

const formatDateTime = (value) => {
  if (!value) return "No date set";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const RideCard = ({ ride, onEdit, onCancel, onClose, onDelete, cancellingId, closingId, deletingId }) => {
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const id = ride.id ?? ride._id;
  const isOffer = ride.type === "RIDE_OFFER";
  const status = (ride.status || "ACTIVE").toUpperCase();
  const isCancelled = status === "CANCELLED";
  const isCancelling = cancellingId === id;
  const isClosed = status === "CLOSED";
  const isClosing = closingId === id;
  const isDeleting = deletingId === id;

  const handleViewParticipants = async () => {
    try {
      setLoadingParticipants(true);

      const data = await getParticipants(id);

      setParticipants(data);
      setShowParticipants(true);

    } catch (err) {
      alert(err.message || "Failed to fetch participants");
    } finally {
      setLoadingParticipants(false);
    }
  };


  const handleAccept = async (participantId) => {
    try {

      await acceptParticipant(participantId);

      // refresh participants
      const data = await getParticipants(id);
      setParticipants(data);

    } catch (err) {
      alert(err.message);
    }
  };


  const handleReject = async (participantId) => {
    try {

      await rejectParticipant(participantId);

      const data = await getParticipants(id);
      setParticipants(data);

    } catch (err) {
      alert(err.message);
    }
  };
  const isOpen = status === "OPEN";

  return (
    <div
      className={`bg-white rounded-xl border border-slate-100 shadow-sm p-5 transition-opacity ${isCancelled ? "opacity-60" : ""
        }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md ${isOffer ? "bg-[#F5A623]/10 text-[#B4790E]" : "bg-[#0F9D8E]/10 text-[#0F9D8E]"
              }`}
          >
            <Car size={11} />
            {isOffer ? "Offer" : "Request"}
          </span>
          <h3 className="font-semibold text-[#16213E] truncate">
            {ride.title || "Untitled ride"}
          </h3>
        </div>
        <span
          className={`shrink-0 text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md ${STATUS_STYLES[status] || STATUS_STYLES.ACTIVE
            }`}
        >
          {status}
        </span>
      </div>

      {ride.description && (
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{ride.description}</p>
      )}

      {/* Route */}
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1.5">
        <MapPin size={14} className="text-[#0F9D8E] shrink-0" />
        <span className="truncate">{ride.pickup_location || "—"}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
        <Navigation2 size={14} className="text-[#F5A623] shrink-0" />
        <span className="truncate">{ride.destination || "—"}</span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDateTime(ride.ride_datetime)}
        </span>
        {isOffer && (
          <>
            <span className="flex items-center gap-1">
              <Users size={12} />
              {ride.seats ?? 1} seat{(ride.seats ?? 1) === 1 ? "" : "s"}
            </span>
            {ride.price !== "" && ride.price != null && (
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                {ride.price}
              </span>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">

        {/* OPEN */}
        {isOpen && (
          <>
            <button
              type="button"
              onClick={() => onEdit(ride)}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium border border-slate-200 rounded-lg py-2 hover:bg-slate-50"
            >
              <Pencil size={13} />
              Edit
            </button>

            {isOffer && (
              <button
                type="button"
                onClick={handleViewParticipants}
                className="flex-1 text-sm font-medium text-[#16213E] border border-slate-200 rounded-lg py-2 hover:bg-slate-50"
              >
                {loadingParticipants
                  ? "Loading..."
                  : showParticipants
                    ? "Hide Participants"
                    : "View Participants"}
              </button>
            )}

            <button
              type="button"
              onClick={() => onClose(id)}
              disabled={isClosing}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-orange-600 border border-orange-100 rounded-lg py-2 hover:bg-orange-50"
            >
              {isClosing ? "Closing..." : "Close"}
            </button>

            <button
              type="button"
              onClick={() => onCancel(id)}
              disabled={isCancelling}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-red-600 border border-red-100 rounded-lg py-2 hover:bg-red-50"
            >
              {isCancelling ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Ban size={13} />
              )}
              {isCancelling ? "Cancelling..." : "Cancel"}
            </button>
          </>
        )}

        {/* CLOSED */}
        {isClosed && (
          <>
            <button
              type="button"
              onClick={() => {}}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-green-600 border border-green-100 rounded-lg py-2 hover:bg-green-50"
            >
              Reopen
            </button>

            <button
              type="button"
              onClick={() => onDelete(id)}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-red-600 border border-red-100 rounded-lg py-2 hover:bg-red-50"
            >
              {isDeleting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Ban size={13} />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        )}

        {/* CANCELLED */}
        {isCancelled && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            disabled={isDeleting}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-600 rounded-lg py-2 hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Ban size={14} />
            )}
            {isDeleting ? "Deleting..." : "Delete Ride"}
          </button>
        )}
      </div>
      {showParticipants && (
        <div className="mt-4 border-t border-slate-100 pt-4">

          <h4 className="font-semibold text-[#16213E] mb-3">
            Ride Requests
          </h4>


          {participants.length === 0 ? (

            <p className="text-sm text-slate-400">
              No participants yet
            </p>

          ) : (

            <div className="space-y-2">

              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                >

                  <div>
                    <p className="font-medium text-sm">
                      {participant.participant?.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {participant.participant?.email}
                    </p>
                    <p className="text-xs text-slate-500">
                      {participant.role}
                    </p>

                    <span className="text-xs text-slate-500">
                      {participant.status}
                    </span>
                  </div>


                  {participant.status === "PENDING" && (
                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleAccept(participant.id)
                        }
                        className="text-xs px-3 py-1 rounded-md bg-[#0F9D8E] text-white"
                      >
                        Accept
                      </button>


                      <button
                        onClick={() =>
                          handleReject(participant.id)
                        }
                        className="text-xs px-3 py-1 rounded-md bg-red-100 text-red-600"
                      >
                        Reject
                      </button>

                    </div>
                  )}

                </div>
              ))}

            </div>

          )}

        </div>
      )}
    </div>


  );
};

export default RideCard;