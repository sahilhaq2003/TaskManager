// components/common/ProfilePhotoSelector.jsx
import React from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValidImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
    if (!isValidImage) {
      alert('Only JPG and PNG files are allowed.');
      return;
    }

    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <label className="text-sm font-medium text-gray-700">Profile Picture</label>

      <div className="flex items-center gap-4">
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Profile Preview"
            className="w-20 h-20 rounded-full object-cover border"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border text-gray-400 text-3xl">
            <LuUser />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="profile-upload"
            className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md cursor-pointer hover:bg-blue-100 transition"
          >
            <LuUpload />
            Upload
          </label>
          {image && (
            <button
              type="button"
              onClick={removeImage}
              className="flex items-center gap-2 text-sm text-red-600 hover:underline"
            >
              <LuTrash />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        id="profile-upload"
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/jpg"
        className="hidden"
      />
    </div>
  );
};

export default ProfilePhotoSelector;
