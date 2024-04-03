import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import moment from "moment";
import { handle } from "express/lib/router";

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
  const [user, setUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { currentUser } = useSelector((state) => state.user);

  const handleEdit = async () => {
    setIsEdit(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comments/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editedContent,
        }),
      });

      if (res.ok) {
        setIsEdit(false);
        onEdit(comment, editedContent);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/${comment.userId}`);

        const data = await res.json();

        if (res.ok) {
          setUser(data);
        } else {
          console.log("Not");
        }
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [comment]);

  return (
    <div className="flex gap-4 my-5 ">
      <div>
        <img
          className="h-10 w-10 rounded-full"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEdit ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                gradientDuoTone="pinkToOrange"
                type="button"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                outline
                gradientDuoTone="pinkToOrange"
                type="button"
                onClick={() => setIsEdit(false)}
              >
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-800 text-md pb-2">{comment.content}</p>
            <div className="flex items-center max-w-fit gap-2 border-t border-gray-300 pt-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser && comment.likes.includes(currentUser._id)
                    ? "!text-blue-500"
                    : "!text-gray-400"
                }`}
              >
                <FaThumbsUp className="text-sm " />
              </button>

              <p className="text-sm text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    (comment.numberOfLikes === 1 ? " like" : " likes")}
              </p>
              {comment.userId === currentUser?._id && (
                <>
                  <button
                    type="button"
                    className="text-gray-400 text-sm hover:text-blue-400"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 text-sm hover:text-blue-400"
                    onClick={() => onDelete(comment._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
