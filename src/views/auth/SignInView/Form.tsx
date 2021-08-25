import React, { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "src/app/hook";
import { login, selectLoginStatus } from "src/slices/authSlice";
import { selectError, clearErrors } from "src/slices/errorSlice";
import { Link } from "react-router-dom";
import TextField from "src/components/TextField";

const Form = () => {
  const dispatch = useReduxDispatch();
  const loginStatus = useReduxSelector(selectLoginStatus);
  const error = useReduxSelector(selectError);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(login({ email, password }));
  };

  if (loginStatus === "loading") {
    return <div className="mt-4">Loading...</div>;
  }

  return (
    <form className="flex flex-col mt-4 space-y-4" onSubmit={handleSignInSubmit}>
      <div className="flex flex-col">
        <label htmlFor="email">E-mail :</label>
        <TextField
          type="email"
          name="email"
          placeholder="example@provider.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password">Password :</label>
        <TextField
          type="password"
          name="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error.id === "LOGIN_ERROR" && (
        <div className="mt-2">
          <span className="text-red-500 text-sm">{error.message}</span>
        </div>
      )}
      <div className="flex flex-col flex-col-reverse md:flex md:flex-row md:items-center md:justify-between">
        <div className="text-sm mt-2 md:mt-0">
          <span>Don't have an account?</span>{" "}
          <Link className="text-blue-500 hover:underline" to="/auth/sign-up">
            Sign Up
          </Link>
        </div>
        <button
          type="submit"
          className="w-full md:w-max py-2 px-4 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600 "
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default Form;
