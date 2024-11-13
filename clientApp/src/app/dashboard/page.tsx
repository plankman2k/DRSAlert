'use client'

import { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import OpenStreetMap from "../../components/dashboard/OpenStreetMap";
import NewsFeedComponent from '../../components/dashboard/NewsFeedComponent';
import { 
  AlertTriangle, 
  BarChart, 
  CloudRain, 
  Flame, 
  Siren, 
  Thermometer, 
  Wind, 
  LogOut, 
  MapPin, 
  Book, 
  User, 
  Clock 
} from "lucide-react"
import Link from 'next/link'

export default function DashboardPage() {
  const [alerts, setAlerts] = useState([])
  const [currentDisaster, setCurrentDisaster] = useState(null)
  const [weatherForecast, setWeatherForecast] = useState({
    today: { temp: 28, condition: 'Sunny' },
    tomorrow: { temp: 25, condition: 'Partly Cloudy' },
    dayAfter: { temp: 30, condition: 'Hot' }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert = generateRandomAlert()
      setAlerts(prevAlerts => [...prevAlerts.slice(-4), newAlert])
      
      if (Math.random() > 0.7) {
        setCurrentDisaster(newAlert)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const generateRandomAlert = () => {
    const types = ['Flood', 'Drought', 'Wildfire', 'Storm']
    const locations = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria']
    const type = types[Math.floor(Math.random() * types.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const severity = Math.floor(Math.random() * 5) + 1
    return { type, location, severity, time: new Date().toLocaleTimeString() }
  }

  const getAlertIcon = (type) => {
    const icons = {
      'Flood': <CloudRain className="h-6 w-6" />,
      'Drought': <Thermometer className="h-6 w-6" />,
      'Wildfire': <Flame className="h-6 w-6" />,
      'Storm': <Wind className="h-6 w-6" />
    }
    return icons[type] || <AlertTriangle className="h-6 w-6" />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Siren className="h-8 w-8 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-yellow-300">Disaster Response Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Alert
          </Button>
          <Link href="/">
            <Button variant="outline" className="text-yellow-300 border-yellow-300">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-gray-800 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Current Threat Status</CardTitle>
          </CardHeader>
          <CardContent>
            {currentDisaster ? (
              <div className="flex items-center space-x-2">
                {getAlertIcon(currentDisaster.type)}
                <span className="text-lg">{currentDisaster.type} in {currentDisaster.location}</span>
                <span className="text-yellow-300">Level: {currentDisaster.severity}/5</span>
              </div>
            ) : (
              <p>No immediate threats detected</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-yellow-300">
          <CardHeader>
            <CardTitle className="text-yellow-300">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Processing regional data...</p>
              <div className="h-2 bg-gray-700 rounded-full">
                <div className="h-full bg-blue-500 rounded-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="map" className="mb-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="bg-gray-800 p-4">
          <OpenStreetMap />
        </TabsContent>

        <TabsContent value="weather" className="bg-gray-800 p-4">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(weatherForecast).map(([day, data]) => (
              <Card key={day} className="bg-gray-700">
                <CardHeader>
                  <CardTitle>{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{data.temp}°C - {data.condition}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <NewsFeedComponent />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.map((alert, index) => (
            <Card key={index} className="bg-gray-800">
              <CardContent className="flex items-center justify-between p-4">
                {getAlertIcon(alert.type)}
                <span>{alert.type}</span>
                <span>{alert.location}</span>
                <span>Severity: {alert.severity}/5</span>
                <span>{alert.time}</span>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>Emergency Contacts: Police 10111 | Ambulance 10177 | Fire 998</p>
      </footer>
    </div>
  )
}
