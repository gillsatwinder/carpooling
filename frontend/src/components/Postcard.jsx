const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h3 className="font-semibold text-lg">
            {post.title}
          </h3>

          {/* USER INFO */}
          {post.user && (
            <p className="text-sm text-gray-500 mt-1">
              👤 {post.user.name} • {post.user.email}
            </p>
          )}
        </div>

        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
          {post.type.replace("_", " ")}
        </span>

      </div>

      {/* Description */}
      <p className="text-gray-600 mt-3">
        {post.description}
      </p>

      {/* Details */}
      <div className="mt-5 space-y-2 text-sm">

        <div>
          <strong>Pickup:</strong> {post.pickup_location}
        </div>

        <div>
          <strong>Destination:</strong> {post.destination}
        </div>

        <div>
          <strong>Date:</strong>{" "}
          {post.ride_datetime
            ? new Date(post.ride_datetime).toLocaleString()
            : "N/A"}
        </div>

        <div>
          <strong>Seats:</strong> {post.seats ?? "N/A"}
        </div>

        <div>
          <strong>Price:</strong>{" "}
          {post.price != null ? `$${post.price}` : "Free"}
        </div>

      </div>

    </div>
  );
};

export default PostCard;