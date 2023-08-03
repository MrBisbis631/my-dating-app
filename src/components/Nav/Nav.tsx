import React from 'react';
import styles from './Nav.module.css';
import { ClientSpace, MatchMakerSpace, AdminSpace } from './links';

// Define the user types and their corresponding spaces
export enum UserType {
  Client = "client",
  MatchMaker = "matchmaker",
  Admin = "admin",
}

const Navbar: React.FC<{ userType: UserType | undefined }> = ({ userType }) => {
  const getSpace = () => {
    switch (userType) {
      case UserType.Client:
        return ClientSpace;
      case UserType.MatchMaker:
        return MatchMakerSpace;
      case UserType.Admin:
        return AdminSpace;
      default:
        return new Map<string, string>(); // Empty map if the user type is not recognized
    }
  };

  // Handling the undefined case
  if (userType === undefined) {
    return <div>Loading...</div>;
  }

  const space = getSpace();

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
  <div className="text-white font-bold text-xl">
    <span>Logo</span>
  </div>
  <div>
    <ul className="flex space-x-4">
      {Array.from(space.entries()).map(([label, url]) => (
        <li key={label}>
          <a href={url} className="text-white hover:underline">{label}</a>
        </li>
      ))}
    </ul>
  </div>
</nav>
  );
};

export default Navbar;