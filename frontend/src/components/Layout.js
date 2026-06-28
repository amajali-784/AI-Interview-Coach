import React from 'react';
import ChatWidget from './ChatWidget'; // Adjust the path if needed
 // Import the widget

const Layout = ({ children }) => {
  return (
    <div>
      <ChatWidget /> {/* Tawk.to widget visible on all pages */}
      {children} {/* Render page content */}
    </div>
  );
};

export default Layout;
