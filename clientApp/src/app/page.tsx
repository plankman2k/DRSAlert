'use client'

import {Button} from "../components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card"
import {
    AlertTriangle,
    Book,
    CloudRain,
    Flame,
    Info,
    LogOut,
    MapPin,
    Siren,
    Thermometer,
    Wind,
} from "lucide-react"
import Link from "next/link"
import {useAuth} from "../context/AuthContext";
import {logout} from "../utils/auth";

export default function Home() {
    const {isAuthenticated} = useAuth();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Siren className="h-8 w-8 text-red-500 mr-2"/>
                        <h1 className="text-2xl font-bold text-yellow-300">DisasterRescue</h1>
                    </div>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><Link href="#features" className="text-yellow-300 hover:text-yellow-100 py-6">Features</Link></li>
                            <li><Link href="#how-it-works" className="text-yellow-300 hover:text-yellow-100 py-6">How It Works</Link></li>
                            {isAuthenticated && (
                                <li>
                                    <Link href="/dashboard" className="text-yellow-300 hover:text-yellow-100 py-2">Dashboard</Link>
                                </li>
                            )}
                            <li>
                                {isAuthenticated ? (
                                    <Button variant="outline" className="text-yellow-300 border-yellow-300" onClick={logout}>
                                        <LogOut className="h-4 w-4 mr-2"/>
                                        Logout
                                    </Button>
                                ) : (
                                    <Link href="/user">
                                        <Button variant="outline" className="text-yellow-300 border-yellow-300">
                                            Login/Sign Up
                                        </Button>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <section className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-yellow-300 mb-4">AI-Powered Emergency Management for South Africa</h2>
                    <p className="text-xl text-gray-300 mb-8">Stay informed, prepared, and safe with real-time disaster monitoring and alerts.</p>
                    {isAuthenticated ? (
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                                Access Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <p className="text-red-500">Please log in to access the dashboard.</p>
                    )}
                </section>

                <section id="features" className="mb-12">
                    <h2 className="text-3xl font-bold text-yellow-300 mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Real-time Alerts",
                                icon: <AlertTriangle className="h-6 w-6"/>,
                                description: "Receive instant notifications about emerging threats and disasters in your area."
                            },
                            {
                                title: "AI Analysis",
                                icon: <Info className="h-6 w-6"/>,
                                description: "Our advanced AI analyzes data from multiple sources to predict and assess potential disasters."
                            },
                            {
                                title: "Interactive Map",
                                icon: <MapPin className="h-6 w-6"/>,
                                description: "Visualize current alerts and threat levels across different regions of South Africa."
                            },
                            {
                                title: "Weather Integration",
                                icon: <CloudRain className="h-6 w-6"/>,
                                description: "Access up-to-date weather forecasts to anticipate potential weather-related disasters."
                            },
                            {
                                title: "Resource Center",
                                icon: <Book className="h-6 w-6"/>,
                                description: "Find comprehensive guides on disaster preparedness, evacuation plans, and emergency kits."
                            },
                            {
                                title: "Historical Data",
                                icon: <Thermometer className="h-6 w-6"/>,
                                description: "Access and analyze past disaster data for better long-term planning and preparedness."
                            },
                        ].map((feature, index) => (
                            <Card key={index} className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-yellow-300">
                                        {feature.icon}
                                        <span className="ml-2">{feature.title}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-300">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section id="disasters" className="mb-12">
                    <h2 className="text-3xl font-bold text-yellow-300 mb-6">Disasters We Monitor</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {type: "Floods", icon: <CloudRain className="h-8 w-8"/>},
                            {type: "Droughts", icon: <Thermometer className="h-8 w-8"/>},
                            {type: "Wildfires", icon: <Flame className="h-8 w-8"/>},
                            {type: "Severe Storms", icon: <Wind className="h-8 w-8"/>},
                        ].map((disaster, index) => (
                            <Card key={index} className="bg-gray-800 border-gray-700">
                                <CardContent className="flex flex-col items-center justify-center p-4">
                                    {disaster.icon}
                                    <h3 className="mt-2 text-lg font-semibold text-yellow-300">{disaster.type}</h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-2xl font-bold text-yellow-300 mb-2">South African Disaster Response System</h2>
                            <p className="text-gray-400">Keeping South Africa safe and prepared</p>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-yellow-300 hover:text-yellow-100">Privacy Policy</Link>
                            <Link href="#" className="text-yellow-300 hover:text-yellow-100">Terms of Service</Link>
                            <Link href="#" className="text-yellow-300 hover:text-yellow-100">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}