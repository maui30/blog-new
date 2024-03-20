import React, { useEffect } from "react";
import { useSelector } from "react-redux";
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

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const fileClick = useRef();

  const handleImg = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImg(file);
      setImgUrl(URL.createObjectURL(file));
    }
  };

  console.log(uploadProgress);

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
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-medium text-2xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          defaultValue="******"
        />

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
