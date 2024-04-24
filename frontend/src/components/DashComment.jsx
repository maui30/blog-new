import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Modal, Button, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComment = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [delId, setDelId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/comments/getAllComments");

        if (res.ok) {
          setLoading(false);
          const data = await res.json();
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchComments();
  }, [currentUser._id]);

  const handleDelete = async () => {
    setOpenModal(false);

    try {
      const res = await fetch(`api/comments/deleteComment/${delId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== delId));
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await fetch(
        `/api/comments/getAllComments?startIndex=${startIndex}`
      );

      const data = await res.json();

      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);

        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
      {comments.length > 0 && (
        <>
          <Table>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post ID</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            <Table.Body>
              {comments.map((comment) => (
                <Table.Row key={comment._id}>
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>{comment.postId}</Table.Cell>

                  <Table.Cell>{comment.userId}</Table.Cell>

                  <Table.Cell>{comment.content}</Table.Cell>

                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>

                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setOpenModal(true);
                        setDelId(comment._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

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
                  Are you sure you want to delete this comment?
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

          {showMore && (
            <button
              className="w-full self-center py-4 text-orange-500 hover:underline"
              onClick={handleShowMore}
            >
              Show More
            </button>
          )}
        </>
      )}

      {loading && <Spinner color="warning" size="xl" />}

      {!loading && comments.length === 0 && <h2>No Comments.</h2>}
    </div>
  );
};

export default DashComment;
