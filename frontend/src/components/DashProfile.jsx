import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextInput, Button } from "flowbite-react";
import { useState, useRef } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  updateStart,
  updateSuccess,
  updateFail,
} from "../redux/users/userSlice";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState(currentUser.password);
  const [profilePicture, setProfilePicture] = useState(
    currentUser.profilePicture
  );

  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [updateError, setUpdateError] = useState(null);
  const [uploadSuccess, setUploadSucess] = useState(null);

  const dispatch = useDispatch();
  const fileClick = useRef();

  const handleImg = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImg(file);
      setImgUrl(URL.createObjectURL(file));
    }
  };

  console.log(username);
  console.log(updateError);

  useEffect(() => {
    if (img) {
      uploadFile();
    }
  }, [img]);

  const uploadFile = async () => {
    console.log("uploading...");

    const storage = getStorage(app);
    const fileName = img.name + new Date().getTime();
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, img);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setUploadError("Could not Upload");
        setUploadProgress(null);
        setImg(null);
        setImgUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
          setProfilePicture(downloadURL);
        });
      }
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUploadSucess(null);
    if (username.length === 0 && email.length === 0 && password === 0) {
      return setUpdateError("There were no changess");
    }

    try {
      setUpdateError(null);
      dispatch(updateStart());
      const res = await fetch(`/api/users/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, profilePicture }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFail(data.message));
        setUpdateError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUploadError(null);
        // setUploadSucess("Updated Successfully");
      }
    } catch (err) {
      dispatch(updateFail(err.message));
      setUpdateError(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-medium text-2xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImg}
          ref={fileClick}
          hidden
        />
        <div
          className="relative h-32 w-32 self-center cursor-pointer rounded-full"
          onClick={() => fileClick.current.click()}
        >
          {uploadProgress && (
            <CircularProgressbar
              value={uploadProgress || 0}
              strokeWidth={4}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(135, 211, 124, ${uploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imgUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-4 border-gray-300 ${
              uploadProgress && uploadProgress < 100 && "opacity-60"
            }`}
          />
          {/*object-cover for when user did not upload a square pic */}
        </div>

        {uploadError && <Alert color="failure">{uploadError}</Alert>}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {updateError && <Alert color="failure">{updateError}</Alert>}

        <Button gradientDuoTone="pinkToOrange" pill type="submit" outline>
          Update
        </Button>
        <Button gradientMonochrome="failure" pill outline>
          Delete
        </Button>
      </form>
    </div>
  );
};

export default DashProfile;
