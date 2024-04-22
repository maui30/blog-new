import { useState, useEffect } from "react";
import { Button, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import TotalCard from "./TotalCard";
import { Link } from "react-router-dom";

const DashboardComponent = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  useEffect(() => {
    const fetchData = async (type, endpoint) => {
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      }

      if (type === "user") {
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
      } else if (type === "post") {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.countLastMonthPosts);
      } else {
        setComments(data.comments);
        setTotalComments(data.totalComment);
        setLastMonthComments(data.lastMonthComments);
      }
    };

    fetchData("user", "/api/users?limit=5");
    fetchData("post", "/api/posts/getPosts?limit=5");
    fetchData("comments", "/api/comments/getAllComments?limit=5");
  }, [currentUser]);

  return (
    <div className="md:mx-auto p-3">
      <div className="flex-wrap flex gap-4 justify-center">
        <TotalCard
          type={"Users"}
          total={totalUsers}
          lastMonth={lastMonthUsers}
        />
        <TotalCard
          type={"Posts"}
          total={totalPosts}
          lastMonth={lastMonthPosts}
        />
        <TotalCard
          type={"Comments"}
          total={totalComments}
          lastMonth={lastMonthComments}
        />
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="pinkToOrange" pill>
              <Link to="/dashboard?tab=users">See All</Link>
            </Button>
          </div>

          <Table>
            <Table.Head>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {users &&
                users.map((user) => (
                  <Table.Row key={user._id}>
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    </Table.Cell>

                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="pinkToOrange" pill>
              <Link to="/dashboard?tab=users">See All</Link>
            </Button>
          </div>

          <Table>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {posts &&
                posts.map((post) => (
                  <Table.Row key={post._id}>
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    </Table.Cell>

                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone="pinkToOrange" pill>
              <Link to="/dashboard?tab=users">See All</Link>
            </Button>
          </div>

          <Table>
            <Table.Head>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Number Of Likes</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {comments &&
                comments.map((comment) => (
                  <Table.Row key={comment._id}>
                    <Table.Cell>{comment.content}</Table.Cell>

                    <Table.Cell className="text-center">
                      {comment.numberOfLikes}
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
