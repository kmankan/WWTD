"use client";

import React from "react";
import Link from 'next/link';

export default function Home() {

  return (
    <div className="wrapper">

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-5xl font-bold mb-6">
          What Would <span className="text-blue-600">They Do?</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Get advice from your friends <em>anytime</em>
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href={{
              pathname: '/chat',
              query: { name: 'Varun' },
            }}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg"
          >
            Varun
          </Link>
          <Link
            href={{
              pathname: '/chat',
              query: { name: 'Malin' },
            }}
            className="px-8 py-4 bg-red-600 text-white rounded-lg text-lg"
          >
            Malin
          </Link>
        </div>
      </div>
    </div>
  );
}
