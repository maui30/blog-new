import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea, Button } from "flowbite-react";
import { useState } from "react";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

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
        setComment("");
        console.log(data);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
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
    </div>
  );
};

export default CommentSection;
