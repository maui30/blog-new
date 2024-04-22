import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post.slug}`}>
      <Card
        className="max-w-sm hover:bg-gray-200 cursor-pointer hover:scale-105"
        renderImage={() => (
          <img width={500} height={500} src={post.image} alt="image 1" />
        )}
      >
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {post.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Category - <span className="italic">{post.category}</span>
        </p>
      </Card>
    </Link>
  );
};

export default PostCard;
