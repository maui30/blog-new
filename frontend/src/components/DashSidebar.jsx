import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiLogout,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { signOutSuccess } from "../redux/users/userSlice";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) setTab(tabFromUrl);
    console.log(tabFromUrl);
  }, [location.search]);

  const handleSignOut = async () => {
    const res = await fetch("/api/users/signout", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
    } else {
      dispatch(signOutSuccess());
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/Dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to="/Dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                labelColor="dark"
                as={"div"}
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/Dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              labelColor="dark"
              as={"div"}
            >
              Posts
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to="/Dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiDocumentText}
                labelColor="dark"
                as={"div"}
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiLogout}
            labelColor="dark"
            onClick={handleSignOut}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
