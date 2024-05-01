import React from "react";
import { SiMongodb, SiExpress } from "react-icons/si";
import { RiReactjsFill } from "react-icons/ri";
import { FaNodeJs } from "react-icons/fa";

const About = () => {
  return (
    <div className=" mx-10 my-3 flex flex-col justify-center items-center">
      <div className="grid md:grid-cols-2 ">
        <div className="p-4">
          <img
            src="https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/06/How_To_Start_A_Blog_-_article_image.jpg"
            alt=""
            className="rounded-lg w-full "
          />
        </div>
        <div className="p-4 flex flex-col items-center justify-center gap-5">
          <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl ">
            About
          </h1>
          <p className="text-lg font-normal text-gray-950 lg:text-xl text-center ">
            This personal blogging website project offers a comprehensive
            platform for users to share their thoughts, experiences, and stories
            with the world. Built with a focus on user interaction and
            simplicity, it incorporates essential features such as SignIn and
            SignUp functionalities, CRUD (Create, Read, Update, Delete)
            operations, a straightforward dashboard, and interactive comment
            sections.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 w-full">
        <h1 className="md:col-span-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl text-center pt-8 pb-3">
          Stack Used
        </h1>
        <div className=" flex flex-col items-center grid-cols-1 p-5">
          <SiMongodb
            size={60}
            className="text-green-400 bg-gray-800 rounded-full p-2  transform transition-transform hover:scale-110"
          />
          <span className="text-lg font-semibold">MongoDb</span>
        </div>
        <div className=" flex flex-col items-center p-5">
          <SiExpress
            size={60}
            className="text-white bg-gray-800 rounded-full p-2 transform transition-transform hover:scale-110"
          />
          <span className="text-lg font-semibold">Express JS</span>
        </div>
        <div className=" flex flex-col items-center p-5">
          <RiReactjsFill
            size={60}
            className="text-blue-300 bg-gray-800 rounded-full p-2 transform transition-transform hover:scale-110"
          />
          <span className="text-lg font-semibold">React JS</span>
        </div>
        <div className="  flex flex-col items-center p-5">
          <FaNodeJs
            size={60}
            className="text-white bg-green-600 rounded-full p-2 transform transition-transform hover:scale-110"
          />
          <span className="text-lg font-semibold">Node JS</span>
        </div>
      </div>
    </div>
  );
};

export default About;
