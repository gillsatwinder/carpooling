import PostCard from "./Postcard";

const DashboardSection = ({ title, posts , joinedRideIds}) => {
  return (
    <div className="mb-10">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <span className="text-gray-500">
          {posts.length} Posts
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center text-gray-500 shadow">
          No Posts
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isJoined={joinedRideIds.includes(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardSection;