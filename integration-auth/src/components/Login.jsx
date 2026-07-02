import React from "react";

const Login = ({ setToggle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Login to your account
        </p>

        <form className="space-y-5">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?
          <span
            onClick={() => setToggle((prev) => !prev)}
            className="text-indigo-600 font-semibold cursor-pointer ml-1 hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
