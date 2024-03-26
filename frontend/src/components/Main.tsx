import React from "react";
import ContentRouter from "./ContentRouter";

export function Main() {
  return (
    <div className="w-screen h-screen bg-black p-1 md:p-2 overflow-hidden flex flex-col md:flex-row text-neutral-950 ">
      <ContentRouter />
    </div>
  );
}

export default Main;
