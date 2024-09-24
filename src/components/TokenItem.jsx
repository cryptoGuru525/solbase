import React, { useState, useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";
import { toFixed } from "utils/customHelpers";
export default function TokenItem({ token, disabledToken, handleToken }) {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);

  return (
    <>
      <li
        className={`flex p-2 justify-between items-center border border-secondary transition ease-in-out relative  ${
          token.lpSymbol === disabledToken
            ? "bg-black opacity-40"
            : "hover:bg-primary hover:bg-opacity-40"
        }`}
        onClick={(e) => {
          token.lpSymbol !== disabledToken && handleToken(token);
        }}
      >
        <div className="flex items-center">
          {token.isTokenOnly ? (
            <img className="w-8 h-8 rounded-full" src={token?.logoA} alt="" />
          ) : (
            <div className="w-8 h-8 relative ml-2">
              <img
                className="w-8 h-8 rounded-full absolute left-1/2 -translate-x-[80%]"
                src={token?.logoA}
                alt=""
              />{" "}
              <img
                className="w-8 h-8 rounded-full  absolute left-1/2 -translate-x-[30%]"
                src={token?.logoB}
                alt=""
              />
            </div>
          )}

          <div className="block ml-3 py-1">
            <h1 className="text-symbol text-base">{token?.lpSymbol}</h1>
            <p className="text-gray-400 text-sm">{token.title}</p>
          </div>
        </div>
        {!loading ? (
          <p className={`text-md text-gray-400`}>{toFixed(balance, 5)}</p>
        ) : (
          <div>
            <ImSpinner9 className="text-gray-500 animate-spin" />
          </div>
        )}
      </li>
    </>
  );
}
