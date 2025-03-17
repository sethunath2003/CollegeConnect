import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children, title = "Book Exchange" }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
