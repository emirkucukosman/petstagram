import React from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { logout, selectIsAuthenticated, selectUser } from "src/slices/authSlice";
import { Home, PlusSquare, User, LogOut } from "react-feather";
import { Link } from "react-router-dom";

const TopBar = () => {
  const dispatch = useReduxDispatch();
  const isAuthenticated = useReduxSelector(selectIsAuthenticated);
  const user = useReduxSelector(selectUser);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleToggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-full shadow-md p-2">
      <div className="flex items-center justify-between px-2 mx-auto md:p-0 md:w-2/3">
        <Link to="/">
          <span className="logo text-3xl">Petstagram</span>
        </Link>
        <div className="hidden md:flex">
          <input type="text" placeholder="Search" className="bg-gray-100 px-2 py-1 rounded-sm" />
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Home className="cursor-pointer" />
          </Link>
          <Link to={isAuthenticated ? "/post/share" : "/auth/sign-in"}>
            <PlusSquare className="cursor-pointer" />
          </Link>
          <div className="relative" onClick={handleToggleDropdown}>
            {isAuthenticated && (
              <>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="user avatar"
                    className="w-7 h-7 rounded-full cursor-pointer"
                  />
                ) : (
                  <User className="cursor-pointer" />
                )}
                {showDropdown && (
                  <div className="absolute right-0 top-8 shadow-md rounded-md bg-white w-32">
                    <div className="flex flex-col">
                      <Link to="/profile" className="px-4 py-1 rounded-md hover:bg-gray-200">
                        <div className="flex items-center space-x-2">
                          <User size="18" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      {isAuthenticated && (
                        <div
                          className="px-4 py-1 cursor-pointer rounded-md hover:bg-gray-200"
                          onClick={handleLogout}
                        >
                          <div className="flex items-center space-x-2">
                            <LogOut size="18" />
                            <span>Logout</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            {!isAuthenticated && (
              <Link to="/auth/sign-in">
                <User />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
