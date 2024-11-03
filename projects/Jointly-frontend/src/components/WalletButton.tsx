import React from "react"
interface AniProps {
  onClick: () => void;
  text: string;
}
const WalletConnect = ({onClick, text}:AniProps) => {
  return (
      <>
        <button className="py-3 px-5 rounded-full ring-1 ring-white text-white hover:bg-white hover:text-white" onClick={onClick}>{text}</button>
      </>
  )
}

export default WalletConnect;
