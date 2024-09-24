import React, { useState } from "react";
import Footer from "./Footer";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

export default function Sidebar({ toggle, handleToggle }) {
  const currentUrl = window.location.pathname;
  console.log(toggle);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClickDoc = (e) => {
    e.preventDefault();
    onOpen();
  };

  return (
    <div
      className={` ${
        toggle ? "absolute z-[59] top-2 w-screen h-screen max-w-screen" : ""
      } items-center `}
    >
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        onClick={(e) => handleToggle(e)}
        className={`fixed transition-transform ${
          toggle
            ? "translate-x-[250px] w-screen h-screen max-w-screen bg-[#0c1221c7]"
            : "translate-x-0 top-2 p-2 mt-2  bg-[#0c1221c7]"
        } z-[9999] ms-3 sm:fixed text-sm text-gray-500 rounded-lg sm:hidden focus:outline-none dark:text-gray-400`}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen  transition-transform -translate-x-full sm:translate-x-0  ${
          toggle ? "translate-x-0" : ""
        } `}
        aria-label="Sidebar"
      >
        <div
          className={`h-full px-3 py-4 overflow-y-auto ${
            toggle ? "bg-gray-900" : "bg-sidebar"
          }   rounded-md w-full`}
        >
          <ul className="space-y-4 font-medium sidebar_list">
            <li>
              <div className="">
                <a href="/" className="items-center gap-2 flex">
                  <img src="/logo-2.webp" className="h-16 w-18" alt="" />
                  <span className="font-semibold text-xl sol-text">
                    MYSTERY DAPP
                  </span>
                </a>
              </div>
            </li>
            <li
              className={`sidebar_item ${
                currentUrl === "/farms" ? "bg-[#122142] rounded-md" : ""
              }`}
            >
              <a
                href="/farms"
                className="flex items-center p-2  text-xl text-white rounded-lg dark:text-white hover:bg-[#122142] dark:hover:bg-gray-700 group"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6  dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>

                <span className="ms-3 ">Staking</span>
              </a>
            </li>
            <li
              className={`sidebar_item ${
                currentUrl === "/swap" ? "bg-[#122142] rounded-md" : ""
              }`}
            >
              <a
                href="/swap"
                className="flex items-center p-2  text-xl text-white rounded-lg dark:text-white hover:bg-[#122142] dark:hover:bg-gray-700 group"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6  dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
                  />
                </svg>

                <span className="ms-3 ">Swap</span>
              </a>
            </li>
            <li
              className={`sidebar_item ${
                currentUrl === "/nfts" ? "bg-[#122142] rounded-md" : ""
              }`}
            >
              <a
                href="/nfts"
                className="flex items-center p-2  text-xl text-white rounded-lg dark:text-white hover:bg-[#122142] dark:hover:bg-gray-700 group"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6  dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"
                  />
                </svg>

                <span className="ms-3 ">NFT's</span>
              </a>
            </li>
            <li
              className={`sidebar_item ${
                currentUrl === "/presale" ? "bg-[#122142] rounded-md" : ""
              }`}
            >
              <a
                href="/presale"
                className="flex items-center p-2  text-xl text-white rounded-lg dark:text-white hover:bg-[#122142] dark:hover:bg-gray-700 group"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-6 h-6  dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                  />
                </svg>

                <span className="ms-3 ">Mystery Boxes</span>
              </a>
            </li>
            <li className="sidebar_item">
              <a
                href=""
                target="_blank"
                className="flex items-center p-2  text-xl text-white rounded-lg dark:text-white hover:bg-[#122142] dark:hover:bg-gray-700 group"
                rel="noopener noreferrer"
                onClick={(e) => handleClickDoc(e)}
              >
                <svg
                  className="w-6 h-6  dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"
                  />
                </svg>

                <span className="ms-3 ">Docs</span>
              </a>
            </li>
            <li>
              <div className="flex items-center justify-center gap-2 w-full mb-2">
                <a className="main_btn base_bg w-2/3" href="/presale">
                  Buy BiLL
                </a>
              </div>
            </li>
          </ul>
          <Footer />
        </div>
      </aside>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>SOLBASE DOC</ModalHeader>
          <ModalBody>
            <div className="flex items-center justify-center flex-col p-2">
              <img src="/assets/book.webp" className="my-5" alt="Docs" />
              <a
                href="https://sol-2.gitbook.io/docs"
                target="_blank"
                className="flex items-center p-2  text-xl text-white rounded-lg hover:text-blue-700 dark:hover:bg-gray-700 group"
                rel="noopener noreferrer"
              >
                <span className="ms-3 mb-8"> - READ FULL DOCS - </span>
              </a>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
