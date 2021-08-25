import React from "react";
import Page from "src/components/Page";
import Form from "./Form";

const SignUpView = () => {
  return (
    <Page>
      <div className="md:w-2/3 md:mx-auto md:shadow-md md:p-4 md:rounded-md">
        <h1 className="text-2xl">Sign Up</h1>
        <Form />
      </div>
    </Page>
  );
};

export default SignUpView;
