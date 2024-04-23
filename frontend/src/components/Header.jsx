import { useState, useEffect } from "react";
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/users/userSlice";

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get("searchTerm");

    if (searchFromUrl) setSearchTerm(searchFromUrl);
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();

    navigate(`/Post?${searchQuery}`);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/users/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <>
      <Navbar className="b-2">
        <Link to="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Blog
          </span>
        </Link>

        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>

        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>

        <div className="flex gap-2 md:order-2">
          {currentUser ? (
            <>
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar alt="user" img={currentUser.profilePicture} rounded />
                }
              >
                <Dropdown.Header>
                  <span className="block text-sm">{currentUser.username}</span>
                  <span className="block text-sm font-medium">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>
                <Link to="/Dashboard?tab=profile">
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
              </Dropdown>
            </>
          ) : (
            <>
              <Link to="/SignIn">
                <Button
                  className="hidden sm:inline"
                  outline
                  gradientDuoTone="pinkToOrange"
                  pill
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}

          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            {" "}
            {/*navbar link causes error so we put as */}
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/About"} as={"div"}>
            <Link to="/About">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/Post"} as={"div"}>
            <Link to="/Post">Post</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
