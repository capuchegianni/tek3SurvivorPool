import React from "react";
import './homepage.css';

export default function Home() {
  return (
    <div className="bg-color">
      <div className="container">
        <img className="image" src="women_catch.png" />
        <div className="title"> Soul Connection </div>
        <img className="image" src="men_catch.png" />
      </div>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="title-signup"> Sign in to your account </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="box">
            <Email />
            <Password />
            <ButtonSign />
            <CreateAccount />
          </form>
        </div>
      </div>
    </div>
  );
}

function Email() {
  return (
    <div>
      <label htmlFor="email" className="email-text"> Email address </label>
      <div>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
    </div>
  )
}

function Password() {
  return (
    <div>
      <label htmlFor="password" className="password-text"> Password </label>
      <div className="mt-2">
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
    </div>
  )
}

function ButtonSign() {
  return (
    <button type="submit" className="button-signin" >
        <div className="button-signin-text"> Sign in </div>
    </button>
  );
}

function CreateAccount() {
  return (
    <div className="create-account">
      <div className="create-account-text"> Don't have an account?&thinsp;</div>
      <a href="create-account">
        <div className="create-account-text"> Create an account </div>
      </a>
    </div>
  );
}
