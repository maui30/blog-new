import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const [recentPost, setRecentPost] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(false);
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/getPosts?slug=${postSlug}`);
        const data = await res.json();

        if (res.ok) {
          setLoading(false);
          setPost(data.posts[0]);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/getPosts?limit=3");

        if (res.ok) {
          const data = await res.json();
          setRecentPost(data.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="flex flex-col max-w-6xl mx-auto min-h-screen ">
      <h1 className="text-3xl text-center mt-10 font-serif max-w-2xl  mx-auto lg:text-4xl">
        {post.title}
      </h1>

      <Link
        to={`/search?category=${post.category}`}
        className="self-center mt-5"
      >
        <Button pill color="gray" size="xs">
          {post.category}
        </Button>
      </Link>
      <img
        src={post.image}
        className="mt-5 max-h-[600px] w-full object-covers"
      />

      <div className="flex max-w-2xl mx-auto w-full justify-between border-b border-slate-300 p-3 text-xs">
        <span>{new Date(post.updatedAt).toLocaleString()}</span>
        <span>{(post.content?.length / 1000).toFixed(0)} mins to read</span>
      </div>

      <div
        className="p-3 max-w-2xl w-full mx-auto post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      <CommentSection postId={post._id} />

      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="font-semibold mb-10 text-2xl">Recent Articles</h1>
        <div className="flex flex-col gap-2 md:flex-row">
          {recentPost &&
            recentPost.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
