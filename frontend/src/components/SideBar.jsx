import React, { useState } from "react";
import Logo from "../assets/react.svg";
import { AiOutlineMenuFold } from "react-icons/ai";
import { GoHomeFill } from "react-icons/go";
import { FaProductHunt } from "react-icons/fa6";
import { LuTestTubeDiagonal } from "react-icons/lu";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserNurse } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const menuItem = [
  {
    icon: <GoHomeFill size={25} />,
    label: "Dashboard",
  },
  {
    icon: <FaProductHunt size={25} />,
    label: "Patients",
  },
  {
    icon: <LuTestTubeDiagonal size={25} />,
    label: "Tests",
  },
  {
    icon: <FaUserDoctor size={25} />,
    label: "Doctors",
  },
  {
    icon: <FaUserNurse size={25} />,
    label: "Staff",
  },
];

export default function SlideBar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div
        className={`shadow-md h-screen p-2 bg-blue-700 flex flex-col duration-500 ${
          open ? "w-60" : "w-16"
        }`}
      >
        <div className="border-none px-3 py-2 h-20 flex justify-between items-center">
          <img
            src={Logo}
            alt="Logo"
            className={`${open ? "w-10" : "w-0"} rounded-md`}
          />
          <div>
            <AiOutlineMenuFold
              size={34}
              className={`duration-500 cursor-pointer text-white ${
                !open && "rotate-180"
              }`}
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>
        <ul className="flex-1">
          {menuItem.map((item, index) => {
            return (
              <li
                key={index}
                className="px-3 py-2 my-3 text-white hover:bg-blue-600 rounded-md duration-300 cursor-pointer flex gap-1.5 items-center group"
              >
                <div>{item.icon}</div>
                <p
                  className={`${
                    !open && "w-0 translate-x-24"
                  } duration-500 overflow-hidden`}
                >
                  {item.label}
                </p>
                <p
                  className={`${
                    open && "hidden"
                  } absolute ml-14 shadow-md rounded-md text-black w-0 p-0 duration-150 overflow-hidden group-hover:w-fit group-hover:p-2`}
                >
                  {item.label}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="px-3 py-2 my-3 text-white hover:bg-blue-600 rounded-md duration-300 cursor-pointer flex gap-1.5 items-center group">
          <div>
            <FiLogOut size={25} />
          </div>
          <p
            className={`${
              !open && "w-0 translate-x-24"
            } duration-500 overflow-hidden`}
          >
            Logout
          </p>
          <p
            className={`${
              open && "hidden"
            } absolute ml-14 shadow-md rounded-md text-black w-0 p-0 duration-150 overflow-hidden group-hover:w-fit group-hover:p-2`}
          >
            Logout
          </p>
        </div>
      </div>
    </>
  );
}
