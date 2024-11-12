'use client'

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("https://localhost:7155/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, location })
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("jtwToken", data.token);
      localStorage.setItem("jwtTokenExpiration", data.expiration);
      console.log("Sign up was successful");
    } else {
      console.log("Sign up failed");
    }
  };

  return (
      <section id="sign-up" className="mb-12">
        <h2 className="text-3xl font-bold text-yellow-300 mb-6">Sign Up for Emergency Alerts</h2>
        <Card className="bg-gray-800 border-yellow-300">
          <CardContent className="pt-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name" className="text-yellow-300">Full Name</Label>
                <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="bg-gray-700 text-white border-gray-600"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-yellow-300">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-gray-700 text-white border-gray-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-yellow-300">Location</Label>
                <Input
                    id="location"
                    placeholder="Enter your city or region"
                    className="bg-gray-700 text-white border-gray-600"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                Sign Up for Alerts
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
  );
}