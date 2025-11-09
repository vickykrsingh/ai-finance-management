"use client"

import { SignIn } from '@clerk/nextjs';
import React from 'react';

function Page() {
  return (
      <div className="flex flex-col lg:flex-row bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-5xl">
        {/* Left SignIn Section */}
        <div className=" p-8 flex flex-col justify-center items-center bg-gray-50">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Welcome Back!
            </h2>
            <SignIn />
          </div>
        </div>

        {/* Right Test Credentials Section */}
        <div className=" p-10 flex flex-col justify-center bg-white">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Test Credentials
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Use the details below to explore the features without signing up.
          </p>
          <div className="bg-gray-100 p-6 rounded-lg border border-gray-300">
            <p className="text-lg font-medium text-gray-800 mb-3">
              <span className="text-blue-600">Email:</span> test@gmail.com
            </p>
            <p className="text-lg font-medium text-gray-800">
              <span className="text-blue-600">Password:</span> test-user27
            </p>
          </div>
          <p className="text-sm mt-6 text-gray-600">
            * These credentials are for testing purposes only.
          </p>
        </div>
      </div>
  );
}

export default Page;
