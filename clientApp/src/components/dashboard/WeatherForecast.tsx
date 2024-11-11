import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface WeatherData {
  temp: number
  condition: string
}

interface WeatherForecast {
  today: WeatherData
  tomorrow: WeatherData
  dayAfter: WeatherData
}

interface WeatherForecastProps {
  forecast: WeatherForecast
}

export default function WeatherForecast({ forecast }: WeatherForecastProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(forecast).map(([day, data]) => (
        <Card key={day} className="bg-gray-700">
          <CardHeader>
            <CardTitle className="text-yellow-300">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white">{data.temp}°C, {data.condition}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
