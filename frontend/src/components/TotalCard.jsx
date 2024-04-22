import React from "react";

import {
  HiArrowUp,
  HiUserGroup,
  HiDocumentText,
  HiAnnotation,
} from "react-icons/hi";

const TotalCard = ({ type, total, lastMonth }) => {
  return (
    <div className="flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md">
      <div className="flex justify-between">
        <div className="">
          <h3 className="text-gray-500 text-md uppercase">Total {type}</h3>
          <p className="text-2xl">{total}</p>
        </div>
        {type === "Users" ? (
          <HiUserGroup className="bg-orange-400 rounded-full text-white text-5xl p-3" />
        ) : type === "Posts" ? (
          <HiDocumentText className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
        ) : (
          <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
        )}
      </div>
      <div className="flex gap-2 text-sm">
        <span className="text-green-500 flex items-center">
          <HiArrowUp />
          {lastMonth}
        </span>
        <p className="text-gray-500">New {type} Last Month</p>
      </div>
    </div>
  );
};

export default TotalCard;
