import { useState, useEffect, useMemo } from "react";
import { uploadProfilePicture } from "../../hooks/user.hooks";

export default function ProfileImage({image,onUploadSuccess,}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Derive the preview URL directly from selectedFile instead of
  // syncing it into its own state via an effect (avoids an extra
  // cascading render on every file selection).
  const preview = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    // Only responsible for releasing the previous object URL once it's
    // no longer needed — no setState here.
    if (!preview) return;
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImageClick() {
    // Opens the hidden file picker when user clicks the profile image
    document
      .getElementById("profile-upload")
      .click();

  }
  function handleFileChange(e) {
    // Validates and stores the selected image before uploading
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setError("");
    setSelectedFile(file);
  }

  function handleCancel() {
    // Removes temporary changes and restores the saved profile image
    setSelectedFile(null);
    setError("");

  }

  async function handleUpload() {
    // Sends the selected image to the backend and updates the profile
    if (!selectedFile) return;
    try {
      setUploading(true);
      setError("");
      const response =  await uploadProfilePicture(selectedFile);
        console.log("UPLOAD RESPONSE:", response);
      onUploadSuccess(response.data);
      setSelectedFile(null);
    } catch(err) {
      setError(
        err.message || "Image upload failed"
      );

    } finally {
      setUploading(false);

    }
  }

  function getDisplayImage() {
    // Determines whether to show preview image or saved profile image
    if (preview) {
      return preview;
    }
    if (image) {
      return `http://localhost:8080${image}`;
    }

    return null;
  }

  const displayImage = getDisplayImage();
  return (
    <div className="flex flex-col items-center gap-4">

      <input
        id="profile-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />


      <div
        onClick={handleImageClick}
        className="
          w-32 h-32
          rounded-full
          overflow-hidden
          border-4
          border-purple-500
          cursor-pointer
          bg-gray-200
          flex
          items-center
          justify-center
        "
      >

        {displayImage ? (

          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />

        ) : (

          <span className="text-gray-500 text-sm">
            Add Photo
          </span>

        )}

      </div>

      {selectedFile && (
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="
              bg-purple-600
              text-white
              px-4
              py-2
              rounded-lg
            "
          >
            {uploading ? "Uploading..." : "Save Photo"}
          </button>
          <button
            onClick={handleCancel}
            className="
              border
              px-4
              py-2
              rounded-lg
            "
          >
            Cancel
          </button>
        </div>

      )}

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

    </div>
  );
}