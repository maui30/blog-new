import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPost from "../components/DashPost";
import DashUser from "../components/DashUser";
import DashComment from "../components/DashComment";
import DashboardComponent from "../components/DashboardComponent";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) setTab(tabFromUrl);

    console.log(tabFromUrl);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {tab === "profile" && <DashProfile />}
      {tab === "dash" && <DashboardComponent />}
      {tab === "posts" && <DashPost />}
      {tab === "users" && <DashUser />}
      {tab === "comments" && <DashComment />}
    </div>
  );
};

export default Dashboard;
