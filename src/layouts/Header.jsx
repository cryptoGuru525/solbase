import React, { useState } from "react";
import { Fade as Hamburger } from "hamburger-react";
import { WalletConnect } from "components/UI/ConnectButton";

export default function Header() {
  const [isMobile, setMobile] = useState(false);

  return (
    <>
      <div className="py-3 w-full h-[50px]">
        <div className="mx-2 p-1 relative">
          <div className="flex justify-between">
            <div className=""></div>

            <div className="nav_action">
              <WalletConnect />
              <div
                className="text-symbol ml-2 hidden sm:block lg:hidden"
                onClick={() => setMobile(!isMobile)}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
