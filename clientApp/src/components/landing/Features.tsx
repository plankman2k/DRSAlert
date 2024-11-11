import { AlertTriangle, Book, CloudRain, Info, MapPin, Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const features = [
  { title: "Real-time Alerts", icon: <AlertTriangle className="h-6 w-6" />, description: "Receive instant notifications about emerging threats and disasters in your area." },
  { title: "AI Analysis", icon: <Info className="h-6 w-6" />, description: "Our advanced AI analyzes data from multiple sources to predict and assess potential disasters." },
  { title: "Interactive Map", icon: <MapPin className="h-6 w-6" />, description: "Visualize current alerts and threat levels across different regions of South Africa." },
  { title: "Weather Integration", icon: <CloudRain className="h-6 w-6" />, description: "Access up-to-date weather forecasts to anticipate potential weather-related disasters." },
  { title: "Resource Center", icon: <Book className="h-6 w-6" />, description: "Find comprehensive guides on disaster preparedness, evacuation plans, and emergency kits." },
  { title: "Historical Data", icon: <Thermometer className="h-6 w-6" />, description: "Access and analyze past disaster data for better long-term planning and preparedness." },
]

export default function Features() {
  return (
    <section id="features" className="mb-12">
      <h2 className="text-3xl font-bold text-yellow-300 mb-6">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
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
  )
}
