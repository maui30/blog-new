import { useState, useEffect } from "react";
import { Label, Select, TextInput, Button, Spinner } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Post = () => {
  const [filter, setFilter] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchFromUrl || sortFromUrl || categoryFromUrl) {
      setFilter({
        ...filter,
        searchTerm: searchFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/posts/getPosts?${searchQuery}`);

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    if (filter.searchTerm !== "") {
      urlParams.set("searchTerm", filter.searchTerm);
    }
    urlParams.set("sort", filter.sort);
    urlParams.set("category", filter.category);

    const searchQuery = urlParams.toString();
    console.log(searchQuery);

    navigate(`/Post?${searchQuery}`);
  };

  const handleClear = () => {
    setFilter({
      searchTerm: "",
      sort: "desc",
      category: "uncategorized",
    });

    navigate(`/Post`);
  };

  return (
    <div>
      <div className="my-6">
        <form
          className="flex gap-6 justify-center flex-wrap"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-2">
            <Label>Sort:</Label>
            <Select
              onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label>Category:</Label>
            <Select
              onChange={(e) =>
                setFilter({ ...filter, category: e.target.value })
              }
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Programming">Programming</option>
              <option value="Life">Life</option>
              <option value="others">Others</option>
            </Select>
          </div>
          <Button type="submit" pill gradientDuoTone="pinkToOrange">
            Apply Filters
          </Button>

          <Button
            onClick={handleClear}
            outline
            pill
            gradientDuoTone="pinkToOrange"
          >
            Clear
          </Button>
        </form>
      </div>

      <div className="w-full flex flex-wrap justify-center gap-4 m-4">
        {!loading &&
          posts &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
        {posts.length === 0 && !loading && (
          <h2 className="font-semibold text-2xl">No Posts</h2>
        )}

        {loading && <Spinner color="warning" size="xl" />}
      </div>
    </div>
  );
};

export default Post;
