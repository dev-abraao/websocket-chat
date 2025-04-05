import React from "react";
import SignupForm from "./(components)/auth/SignupForm";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <SignupForm />
      <a href="/login">Login</a>
    </div>
  );
};

export default page;
