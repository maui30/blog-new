import React from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center flex flex-col justify-center items-center">
        <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">
          Welcome to the Blog Site
        </h1>
        <p className="mb-6 text-md font-normal text-gray-500 lg:text-lg sm:px-16 xl:px-48 dark:text-gray-400">
          Explore a diverse collection of stories, insights, and experiences
          shared by individuals from all walks of life. Join our vibrant
          community of writers and readers on a journey of discovery,
          connection, and inspiration. Here, every voice is heard, every
          perspective valued. Whether you're here to share your own story or to
          uncover new perspectives, you're invited to be part of our collective
          narrative.
        </p>

        {!currentUser ? (
          <div className="items-center">
            <Link to="/SignUp">
              <Button
                outline
                gradientDuoTone="pinkToOrange"
                pill
                className="w-48"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        ) : (
          <div className="items-center">
            <Link to="/Create-Post">
              <Button
                outline
                gradientDuoTone="pinkToOrange"
                pill
                className="w-48"
              >
                Create a Post
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
