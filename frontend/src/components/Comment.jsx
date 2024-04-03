import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import moment from "moment";

const Comment = ({ comment, onLike }) => {
  const [user, setUser] = useState({});

  const { currentUser } = useSelector((state) => state.user);

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
      <div>
        <div className="flex-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user.username}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default Comment;
