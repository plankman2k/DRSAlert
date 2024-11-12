'use client'

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

export default function AuthForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = isSignUp ? "https://localhost:7155/users/register" : "https://localhost:7155/users/login";
    const body = isSignUp ? { name, email, password, location } : { email, password };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("jwtTokenExpiration", data.expiration);
      setIsAuthenticated(true);
      console.log(`${isSignUp ? "Sign up" : "Sign in"} was successful`);
    } else {
      const errorData = await response.json();
      const errors = Object.values(errorData.errors).flat();
      setErrorMessages(errors);
      console.log(`${isSignUp ? "Sign up" : "Sign in"} failed`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("jwtTokenExpiration");
    setIsAuthenticated(false);
    console.log("Logged out successfully");
  };

  return (
      <section id="auth-section" className="mb-12">
        {isAuthenticated ? (
            <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Logout
            </Button>
        ) : (
            <>
              <h2 className="text-3xl font-bold text-yellow-300 mb-6">{isSignUp ? "Sign Up" : "Sign In"}</h2>
              <Card className="bg-gray-800 border-yellow-300">
                <CardContent className="pt-6">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    {isSignUp && (
                        <>
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
                            <Label htmlFor="location" className="text-yellow-300">Location</Label>
                            <Input
                                id="location"
                                placeholder="Enter your city or region"
                                className="bg-gray-700 text-white border-gray-600"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                          </div>
                        </>
                    )}
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
                      <Label htmlFor="password" className="text-yellow-300">Password</Label>
                      <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          className="bg-gray-700 text-white border-gray-600"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    {errorMessages.length > 0 && (
                        <div className="text-red-500">
                          {errorMessages.map((msg, index) => (
                              <div key={index}>{msg}</div>
                          ))}
                        </div>
                    )}
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                      {isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                  </form>
                  <Button onClick={() => setIsSignUp(!isSignUp)} className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white">
                    {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
                  </Button>
                </CardContent>
              </Card>
            </>
        )}
      </section>
  );
}