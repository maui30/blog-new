import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useDispatch } from "react-redux";

import { Sidebar } from "flowbite-react";
import { HiUser, HiLogout } from "react-icons/hi";
import { signOutSuccess } from "../redux/users/userSlice";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const dispatch = useDispatch();

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
              label={"User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to="/Dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiUser}
              labelColor="dark"
              as={"div"}
            >
              Posts
            </Sidebar.Item>
          </Link>

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
