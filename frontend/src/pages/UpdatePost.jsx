import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useState, useRef, useEffect } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { CircularProgressbar } from "react-circular-progressbar";

import { useNavigate, useParams } from "react-router-dom";

const UpdatePost = () => {
  const [errMsg, setErrMsg] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("uncategorized");

  const navigate = useNavigate();
  const { postId } = useParams();

  //for uploading img
  const [img, setImg] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedImg, setUploadedImg] = useState(
    "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png"
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/getPosts?postId=${postId}`);

        const data = await res.json();

        if (res.ok) {
          console.log(data.posts[0].title);
          setTitle(data.posts[0].title);
          setContent(data.posts[0].content);
          setCategory(data.posts[0].category);
          setUploadedImg(data.posts[0].image);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [postId]);

  const handleImg = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImg(file);
      console.log(uploadedImg);
    }
  };

  const handleUpload = async () => {
    try {
      console.log("uploading...");
      if (!img) {
        setUploadError("Select an Image");
        console.log(uploadError);
        return;
      }

      const storage = getStorage();
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
        (err) => {
          setUploadError("Image Upload Failed");
          setUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadProgress(null);
            setUploadError(null);
            setUploadedImg(downloadURL);
          });
        }
      );
    } catch (err) {
      console.log(err);
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/posts/updatePost/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          image: uploadedImg,
          category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrMsg(data.message);
        console.log(data.message);
      } else {
        setErrMsg(null);
        console.log(data.message);
        navigate("/");
      }
    } catch (err) {
      setErrMsg("Something went wrong");
      console.log(err);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl text-center my-3 font-semibold">Update Post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <TextInput
            className="flex-1"
            type="text"
            required
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="uncategorized">Select a Catergoryy</option>
            <option value="JavaScript">Entertainment</option>
            <option value="Programming">Programming</option>
            <option value="Life">Life</option>
            <option value="others">Others</option>
          </Select>
        </div>

        <div className="flex gap-4 justify-between items-center p-3 border-4 border-dotted border-orange-400">
          <FileInput type="file" accept="image/*" onChange={handleImg} />
          <Button
            gradientDuoTone="pinkToOrange"
            onClick={handleUpload}
            disabled={uploadProgress}
          >
            {uploadProgress ? (
              <div className="w-10 h-10">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${uploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>

        {uploadError && <Alert color="failure">{uploadError}</Alert>}

        {uploadedImg && (
          <img src={uploadedImg} className="w-full h-72 object-cover" />
        )}

        <ReactQuill
          className="h-64 mb-12"
          theme="snow"
          value={content}
          onChange={(value) => setContent(value)}
        />

        {errMsg && <Alert color="failure">{errMsg}</Alert>}
        <Button
          type="submit"
          gradientDuoTone="pinkToOrange"
          className="min-w-full"
        >
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
