"use client";
import React from "react";
import { Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function PricingPlans() {
  const user = useUser();
  // Payments have been disabled. The UI shows information only.
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-16">
        <h1 className="text-2xl font-semibold mb-2">Plans</h1>
        <p className="text-sm text-gray-600">
          Update your plan to generate unlimited courses for your exam
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <div className="border rounded-lg p-6 flex flex-col items-center text-center shadow-sm bg-white">
          <div className="mb-6">
            <p className="text-base font-medium mb-2">Free</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold">0$</span>
              <span className="text-sm text-gray-600 ml-1">/month</span>
            </div>
          </div>

          <div className="space-y-4 flex-grow w-full max-w-xs">
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>5 PDF Upload</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Unlimited Notes Taking</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Email support</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Help center access</span>
            </div>
          </div>

          <button className="mt-6 w-full max-w-xs py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            Current Plan
          </button>
        </div>

  {/* Monthly Plan */}
  <div className="border rounded-lg p-6 flex flex-col items-center text-center shadow-sm bg-white">
          <div className="mb-6">
            <p className="text-base font-medium mb-2">Monthly</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold">9.99$</span>
              <span className="text-sm text-gray-600 ml-1">/Monthly</span>
            </div>
          </div>

          <div className="space-y-4 flex-grow w-full max-w-xs">
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Unlimited PDF Upload</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Unlimited Notes Taking</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Email support</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Help center access</span>
            </div>
          </div>

          <button
            className="mt-6 w-full max-w-xs py-2 px-4 bg-gray-400 text-white rounded-md cursor-not-allowed"
            disabled
          >
            Payments disabled
          </button>
        </div>

        {/* Premium Plan */}
        <div className="border rounded-lg p-6 flex flex-col items-center text-center shadow-md bg-gradient-to-b from-white to-blue-50 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
            Popular
          </div>

          <div className="mb-6 mt-4">
            <p className="text-base font-medium mb-2">Premium</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold">29.99$</span>
              <span className="text-sm text-gray-600 ml-1">/month</span>
            </div>
          </div>

          <div className="space-y-4 flex-grow w-full max-w-xs">
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Unlimited PDF Upload</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Priority Email & Chat Support</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Team seats (3 users)</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Advanced analytics & premium question bank</span>
            </div>
          </div>

          <button
            className="mt-6 w-full max-w-xs py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled
            title="Payments currently disabled"
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
