import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { sharePost, selectShareStatus, clearSuccess } from "src/slices/postSlice";
import { selectUser } from "src/slices/authSlice";
import { selectError, clearErrors } from "src/slices/errorSlice";
import Page from "src/components/Page";

const SharePostView = () => {
  const dispatch = useReduxDispatch();
  const shareStatus = useReduxSelector(selectShareStatus);
  const user = useReduxSelector(selectUser);
  const error = useReduxSelector(selectError);
  const [file, setFile] = React.useState(null);
  const [filename, setFilename] = React.useState("");
  const [fileURL, setFileURL] = React.useState("");
  const [description, setDescription] = React.useState("");

  useEffect(() => {
    if (error.id === "SHARE_POST_ERROR") {
      window.alert(error.message);
      dispatch(clearErrors());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (shareStatus === "success") {
      setDescription("");
      setFile(null);
      setFilename("");
      dispatch(clearSuccess());
      window.alert("Post shared.");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareStatus]);

  const handleShareSubmit = () => {
    if (!file || !description) {
      return window.alert("Please select a file and enter an description.");
    }

    if (!user?.username || !user.photoURL) {
      return window.alert("Please set your username and profile photo before sharing a post.");
    }

    dispatch(sharePost({ file, description }));

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
    <Page>
      <div className="p-2 md:w-4/5 md:mx-auto md:p-0">
        {shareStatus !== "loading" ? (
          <div className="flex flex-col items-start">
            <div>
              {fileURL !== "" && <img src={fileURL} alt="post" className="w-48 h-48" />}
              <input
                type="file"
                name="file"
                accept="image/png, image/jpeg"
                className="text-sm mt-4"
                value={filename}
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-4 w-full">
              <textarea
                name="description"
                placeholder="Description"
                rows={5}
                maxLength={255}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-200 resize-none outline-none transition duration-300 hover:bg-gray-300"
              ></textarea>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="bg-blue-500 px-4 py-2 rounded-md text-white transition duration-300 hover:bg-blue-600"
                onClick={handleShareSubmit}
              >
                Share
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </Page>
  );
};

export default SharePostView;
