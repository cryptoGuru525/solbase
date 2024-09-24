import React, { useState, useEffect } from "react";
import { useNFTContract } from "hooks/useContract";

export default function NFTCard({ tokenId }) {
  const [tokenUri, setTokenUri] = useState("");
  const nftContract = useNFTContract();

  const handleImageError = (event) => {
    event.target.src = "/assets/stickers/NFT.webp";
  };

  const getTokenUri = async (_tokenId) => {
    const url = await nftContract.tokenURI(_tokenId);
    console.log(url);
    setTokenUri(url || "/assets/stickers/NFT.webp");
  };
  useEffect(() => {
    getTokenUri(tokenId);
  }, [tokenId]);
  return (
    <div className="w-full max-w-[300px] max-h-[400px] p-4 rounded-lg bg-[#0d223de8]">
      <img
        src={tokenUri}
        onError={handleImageError}
        alt="NFT"
        srcSet=""
        className="w-full border-opacity-30"
      />
    </div>
  );
}
