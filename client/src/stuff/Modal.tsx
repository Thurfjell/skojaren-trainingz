import React from "react";

export default (props: React.PropsWithChildren) => {
  return (
    <div className="z-10 absolute w-screen h-screen top-0 left-0  backdrop-blur-sm flex justify-center items-center">
      <div className="z-20">{props.children}</div>
    </div>
  );
};
