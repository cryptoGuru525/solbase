import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [toggle, setToggle] = useState(false);
  const handleToggle = (e) => {
    e.preventDefault();
    setToggle(!toggle);
  };
  return (
    <div>
      <Header />
      <Sidebar toggle={toggle} handleToggle={handleToggle} />
      <div className="p-4 sm:ml-64">
        <div className="flex w-full justify-center  min-h-[calc(100vh-90px)] pb-[100px] relative px-1">
          {children}
        </div>
      </div>
      {/* {/* <div className="fixed top-[55%] left-[50%]  -translate-x-1/2 -translate-y-1/2  -z-20  rounded-full h-[50px] w-[50px] bg-symbol  blur-3xl"></div> */}
      {/* <div className="fixed top-[55%] left-[50%]  -translate-x-1/2 -translate-y-1/2  -z-20  rounded-full h-[100px] w-[100px] bg-symbol/60  blur-3xl"></div> */}
      {/* <div className="fixed top-[55%] left-[50%]  -translate-x-1/2 -translate-y-1/2  -z-20  rounded-full h-[200px] w-[200px] bg-symbol/50  blur-3xl"></div> */}
      {/* <div className="fixed top-[55%] left-[50%]  -translate-x-1/2 -translate-y-1/2  -z-20  rounded-full h-[400px] w-[400px] bg-symbol/30  blur-3xl"></div> */}
      {/* <div className="fixed top-[60%] left-[50%]  -translate-x-1/2 -translate-y-1/2  -z-20  rounded-full h-[1700px] w-[1700px] bg-blue-500/10  blur-3xl"></div> */}
      {/* <div className="fixed top-[60%] left-[50%]  -translate-x-1/2 -translate-y-1/2  -z-20  rounded-full h-[1300px] w-[1300px] bg-black  blur-3xl"></div> */}
    </div>
  );
}
