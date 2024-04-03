import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Textarea, Button, Modal, Alert } from "flowbite-react";
import { useState, useEffect } from "react";

import { HiOutlineExclamationCircle } from "react-icons/hi";

import Comment from "./Comment";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [delCommentId, setdelCommetId] = useState("");
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    try {
      const res = await fetch("/api/comments/createComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComments([data, ...comments]);
        setComment("");
        console.log(data);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/getComments/${postId}`);

        if (res.ok) {
          const data = await res.json();
          setComments(data);
        } else {
          console.log("Not");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) navigate("/Signin");

      const res = await fetch(`/api/comments/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (commentId) => {
    setOpenModal(false);

    try {
      const res = await fetch(`/api/comments/deleteComment/${commentId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (comment, editComment) => {
    setComments(
      comments.map((com) =>
        com._id === comment._id ? { ...com, content: editComment } : com
      )
    );
  };

  return (
    <div className="max-x--2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-2 text-sm my-5">
          <p className="">Signed in as: </p>
          <img
            className="h-5 w-5 rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={`/Dashboard?tab=profile`}
            className="text-blue-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div>
          <Link to="/Signin">You must be signed in to comment.</Link>
        </div>
      )}

      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-gray-300 rounded-md p-3"
        >
          <Textarea
            placeholder="Add comment..."
            required
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></Textarea>

          <div className="flex justify-between items-center mt-5">
            <p className="text-sm text-zinc-500">
              {200 - comment.length} characters remaining.
            </p>
            <Button type="submit" outline gradientDuoTone="pinkToOrange">
              Submit
            </Button>
          </div>
        </form>
      )}

      {comments.length !== 0 ? (
        <>
          <div className="flex gap-2 my-3 items-center">
            <p className="font-medium ">Comments</p>
            <div className="border border-gray-300 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comm) => (
            <Comment
              key={comm._id}
              comment={comm}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setOpenModal(true);
                setdelCommetId(commentId);
              }}
            />
          ))}
        </>
      ) : (
        <div>
          <p className="text-sm my-5">There are no comments.</p>
        </div>
      )}

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
              <Button
                color="failure"
                onClick={() => handleDelete(delCommentId)}
              >
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

export default CommentSection;
