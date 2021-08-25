import React from "react";
import TopBar from "./TopBar";

type MainLayoutProps = {
  children: React.ReactChildren;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-full bg-gray-50">
      <TopBar />
      <div className="flex min-h-full">
        <div className="flex-1 min-h-full p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
