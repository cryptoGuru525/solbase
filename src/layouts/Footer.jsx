import React from "react";
import { socials } from "config";
import moment from "moment";
export default function Footer() {
  return (
    <div className="fixed bottom-3 md:text-md text-sm ml-6">
      <div className=" justify-center flex flex-col items-center w-full">
        <div className="flex justify-center items-center mb-2">
          (C) SOLBASE {moment().format("YYYY")}
          <span className="font-semibold mx-2">( v1.0 )</span>
        </div>
        <div className="mb-2">All rights reserved</div>
        <div>
          <div className="gap-2 flex md:justify-end justify-center  items-center">
            {[].map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  href={item.href}
                  key={index}
                  className={`p-3 flex items-center gap-1 hover:text-gray-400 `}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                  {item.name}
                </a>
              );
            })}
            {socials.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  href={item.href}
                  key={index}
                  className={`p-1 flex items-center justify-center gap-2 my-auto hover:text-gray-400 bg-secondary rounded-full h-[37px] w-[37px]`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                  {item.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
