import { CloudRain, Flame, Thermometer, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Alert {
  type: string
  location: string
  severity: number
  time: string
}

interface AlertsListProps {
  alerts: Alert[]
}

export default function AlertsList({ alerts }: AlertsListProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Flood': return <CloudRain className="h-6 w-6" />
      case 'Drought': return <Thermometer className="h-6 w-6" />
      case 'Wildfire': return <Flame className="h-6 w-6" />
      case 'Storm': return <Wind className="h-6 w-6" />
      default: return <CloudRain className="h-6 w-6" />
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-yellow-200">Recent Alerts in South Africa</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alerts.map((alert, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-100">{alert.type}</CardTitle>
              {getAlertIcon(alert.type)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{alert.location}</div>
              <p className="text-xs text-gray-400">Severity: {alert.severity}/5</p>
              <p className="text-xs text-gray-400">{alert.time}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
