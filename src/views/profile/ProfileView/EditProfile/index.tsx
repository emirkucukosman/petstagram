import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { updateProfile, selectUpdateProfileStatus } from "src/slices/profileSlice";
import { selectUser } from "src/slices/authSlice";
import { selectError, clearErrors } from "src/slices/errorSlice";
import { User, X } from "react-feather";

type EditProfileProps = {
  handleClose: () => void;
};

const EditProfile: React.FC<EditProfileProps> = ({ handleClose }) => {
  const dispatch = useReduxDispatch();
  const user = useReduxSelector(selectUser);
  const updateProfileStatus = useReduxSelector(selectUpdateProfileStatus);
  const error = useReduxSelector(selectError);
  const [file, setFile] = React.useState(null);
  const [filename, setFilename] = React.useState("");
  const [fileURL, setFileURL] = React.useState(user?.photoURL);
  const [username, setUsername] = React.useState(user?.username || "");

  useEffect(() => {
    if (error.id === "UPDATE_PROFILE_ERROR") {
      window.alert(error.message);
      dispatch(clearErrors());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const handleUpdateClick = () => {
    dispatch(updateProfile({ file, username }));
    setFile(null);
    setFilename("");
  };

  const handleFileChange = (e: any) => {
    if (e.target.files[0].size > 3000000) {
      return window.alert("Maximum file size is 3 MB.");
    }

    setFilename(e.target.value);
    setFile(e.target.files[0]);

    if (FileReader) {
      const fr = new FileReader();
      fr.onload = () => {
        setFileURL(String(fr.result));
      };
      fr.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div
      className="fixed left-0 top-0 w-screen h-screen"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="absolute top-5 right-5" onClick={handleClose}>
        <X className="bg-white w-6 h-6 rounded-full cursor-pointer" />
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="w-10/12 h-1/2 md:w-1/3 md:h-1/2 bg-gray-100 shadow-md rounded-md p-4">
          {updateProfileStatus !== "loading" ? (
            <div className="flex flex-col items-center justify-between h-full">
              <div className="flex flex-col items-center mt-12">
                <div className="flex flex-col items-center space-x-4 md:flex-row">
                  {fileURL ? (
                    <img src={fileURL} alt="user profile" className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="flex items-center justify-center rounded-full p-6 bg-gray-200">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    value={filename}
                    onChange={handleFileChange}
                    className="mt-4 text-xs md:text-sm"
                  />
                </div>
                <div className="mt-8 w-3/4 md:w-full">
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="bg-gray-200 w-full p-2 outline-none rounded-md transition duration-300 hover:bg-gray-300 focus-within:bg-gray-300"
                  />
                </div>
              </div>
              <div className="mt-12">
                <button
                  type="button"
                  className="text-red-500 text-white px-4 py-1 rounded-md transition duration-300 hover:bg-gray-200"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="ml-4 bg-blue-500 text-white px-4 py-1 rounded-md transition duration-300 hover:bg-blue-600"
                  onClick={handleUpdateClick}
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
