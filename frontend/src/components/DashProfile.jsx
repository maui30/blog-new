import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TextInput, Button, Modal } from "flowbite-react";
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
import { HiOutlineExclamationCircle } from "react-icons/hi";

import {
  updateStart,
  updateSuccess,
  updateFail,
  deleteStart,
  deleteSuccess,
  deleteFail,
} from "../redux/users/userSlice";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  console.log(currentUser);

  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState(null);
  const [profilePicture, setProfilePicture] = useState(
    currentUser.profilePicture
  );

  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const [updateError, setUpdateError] = useState(null);
  const [uploadSuccess, setUploadSucess] = useState(null);
  const [deleteState, setDeleteState] = useState(null);

  const [openModal, setOpenModal] = useState(false);

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
      if (data === null) console.log(data);

      if (!res.ok) {
        dispatch(updateFail(data.message));
        setUpdateError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUploadError(null);
        setUploadSucess("Updated Successfully");
      }
    } catch (err) {
      dispatch(updateFail(err.message));
      setUpdateError(err);
    }
  };

  const handleDelete = async () => {
    setOpenModal(false);
    console.log("del");

    try {
      dispatch(deleteStart());
      const res = await fetch(`api/users/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteError(data.message));
      } else {
        dispatch(deleteSuccess());
      }
    } catch (err) {
      dispatch(err.message);
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
          {/*object-cover for when user did not upload a square pic*/}
        </div>

        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        {uploadSuccess && <Alert color="success">{uploadSuccess}</Alert>}

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
        <Button
          gradientMonochrome="failure"
          pill
          outline
          onClick={() => setOpenModal(true)}
        >
          Delete
        </Button>
      </form>

      <Modal
        show={openModal}
        size="md"
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
