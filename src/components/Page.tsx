import React from "react";

type PageProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const Page: React.FC<PageProps> = ({ children, style }) => {
  return (
    <div className="p-2 md:p-0 md:w-2/3 md:mx-auto" style={style}>
      {children}
    </div>
  );
};

export default Page;
