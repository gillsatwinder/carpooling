import { useEffect, useState, useCallback, useMemo } from "react";
import { getMyPosts, cancelPost, closePost, deletePost } from "../hooks/user.hooks";
import CreateRide from "../components/CreateRide";
import RideCard from "../components/RideCard"
import {
  Car,
  Plus,
  Loader2,
  Inbox,
  AlertCircle,
} from "lucide-react";



const RideManagement = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ACTIVE"); // ACTIVE | CLOSED | CANCELLED
  const [cancellingId, setCancellingId] = useState(null);
  const [closingId, setClosingId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingRide, setEditingRide] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchRides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyPosts();
      // getMyPosts can include soft-cancelled posts; normalize status casing up front
      const normalized = (Array.isArray(data) ? data : []).map((r) => ({
        ...r,
        status: (r.status || "OPEN").toUpperCase(),
      }));
      setRides(normalized);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load your rides");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRides();
  }, [fetchRides]);

  const activeRides = useMemo(
    () => rides.filter((r) => r.status === "OPEN"),
    [rides]
  );

  const closedRides = useMemo(
    () => rides.filter((r) => r.status === "CLOSED"),
    [rides]
  );

  const cancelledRides = useMemo(
    () => rides.filter((r) => r.status === "CANCELLED"),
    [rides]
  );


  const visibleRides =
    filter === "ACTIVE"
      ? activeRides
      : filter === "CLOSED"
        ? closedRides
        : cancelledRides;

  const openCreate = () => {
    setEditingRide(null);
    setShowForm(true);
  };

  const openEdit = (ride) => {
    setEditingRide(ride);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingRide(null);
  };

  const handleFormSuccess = () => {
    closeForm();
    fetchRides();
  };

  const requestCancel = (postId) => setConfirmCancelId(postId);

  const confirmCancel = async () => {
    const postId = confirmCancelId;
    if (!postId) return;
    try {
      setCancellingId(postId);
      await cancelPost(postId);
      setRides((prev) =>
        prev.map((r) =>
          (r.id ?? r._id) === postId ? { ...r, status: "CANCELLED" } : r
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to cancel ride");
    } finally {
      setCancellingId(null);
      setConfirmCancelId(null);
    }
  };

  const handleClose = async (postId) => {
    try {
      setClosingId(postId);

      await closePost(postId);

      setRides((prev) =>
        prev.map((ride) =>
          (ride.id ?? ride._id) === postId
            ? {
              ...ride,
              status: "CLOSED",
            }
            : ride
        )
      );

    } catch (err) {
      alert(err.message || "Failed to close ride");
    } finally {
      setClosingId(null);
    }
  };

  const handleDelete = async (postId) => {
    try {
      setDeletingId(postId);

      await deletePost(postId);

      setRides((prev) =>
        prev.filter((ride) => (ride.id ?? ride._id) !== postId)
      );
    } catch (err) {
      alert(err.message || "Failed to delete ride");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-full bg-[#F5F7FA] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8312da] text-xs font-semibold tracking-widest uppercase mb-3">
              <Car size={14} strokeWidth={2.5} />
              Carpooling
            </div>
            <h1 className="text-3xl font-bold text-[#16213E] tracking-tight">
              My rides
            </h1>
            <p className="text-slate-500 mt-2 text-[15px]">
              Manage the rides you've offered or requested.
            </p>
          </div>
          {!showForm && (
            <button
              type="button"
              onClick={openCreate}
              className="shrink-0 flex items-center gap-1.5 bg-[#16213E] hover:bg-[#1E2A4A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={16} />
              New ride
            </button>
          )}
        </div>

        {/* Create / edit form */}
        {showForm && (
          <div className="mb-8">
            <CreateRide
              mode={editingRide ? "edit" : "create"}
              ride={editingRide}
              onSuccess={handleFormSuccess}
              onClose={closeForm}
            />
          </div>
        )}

        {/* Filter chips */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setFilter("ACTIVE")}
            className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${filter === "ACTIVE"
              ? "bg-[#16213E] text-white"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            Active ({activeRides.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("CLOSED")}
            className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${filter === "CLOSED"
              ? "bg-[#16213E] text-white"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            Closed ({closedRides.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("CANCELLED")}
            className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${filter === "CANCELLED"
              ? "bg-[#16213E] text-white"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            Cancelled ({cancelledRides.length})
          </button>
        </div>

        {/* List states */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-slate-400 py-16">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading your rides...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-4">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Couldn't load your rides</p>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && visibleRides.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
            <Inbox size={28} className="text-slate-300 mb-3" />
            <p className="text-sm font-medium text-[#16213E]">
              {filter === "ACTIVE" ? "No active rides yet" : "No cancelled rides"}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {filter === "ACTIVE"
                ? "Create a ride offer or request to get started."
                : "Rides you cancel will show up here."}
            </p>
          </div>
        )}

        {!loading && !error && visibleRides.length > 0 && (
          <div className="space-y-3">
            {visibleRides.map((ride) => (
              <RideCard
                key={ride.id ?? ride._id}
                ride={ride}
                onEdit={openEdit}
                onCancel={requestCancel}
                cancellingId={cancellingId}
                onDelete={handleDelete}
                onClose={handleClose}
                closingId={closingId}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirmation */}
      {confirmCancelId && (
        <div className="fixed inset-0 bg-[#16213E]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-[#16213E] mb-2">Cancel this ride?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This will mark the ride as cancelled. Riders or drivers who matched with it
              will be notified. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Keep ride
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={cancellingId === confirmCancelId}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {cancellingId === confirmCancelId ? "Cancelling..." : "Cancel ride"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideManagement;