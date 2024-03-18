import React from "react";
import { useSelector } from "react-redux";
import { TextInput, Button } from "flowbite-react";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-center my-7 font-medium text-2xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="h-32 w-32 self-center cursor-pointer rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-4 border-gray-300"
          />
          {/*object-cover for when user did not upload a square pic */}
        </div>

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          defaultValue="******"
        />

        <Button gradientDuoTone="pinkToOrange" pill type="submit" outline>
          Update
        </Button>
        <Button gradientMonochrome="failure" pill outline>
          Delete
        </Button>
      </form>
    </div>
  );
};

export default DashProfile;
