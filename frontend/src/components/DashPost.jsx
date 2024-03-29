import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashPost = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [userPosts, setUserPosts] = useState([]);

  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/posts/getPosts?userId=${currentUser._id}`
        );

        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser._id]);

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar">
      {currentUser && userPosts.length > 0 ? (
        <>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body>
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>

                <Link to={`/Post/${post.slug}`}>
                  <Table.Cell>
                    <img className="h-10 w-20" src={post.image} />
                  </Table.Cell>
                </Link>
                <Table.Cell>{post.title}</Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-red-500 hover:underline cursor-pointer">
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/Update-Post/${post._id}`}>
                    <span className="text-teal-500 hover:underline">Edit</span>
                  </Link>
                </Table.Cell>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <h2>No Posts</h2>
      )}
    </div>
  );
};

export default DashPost;
