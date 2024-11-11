import { AlertTriangle, CloudRain, Flame, Thermometer, Wind } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Disaster {
  type: string
  location: string
  severity: number
}

interface CurrentThreatProps {
  currentDisaster: Disaster | null
}

export default function CurrentThreat({ currentDisaster }: CurrentThreatProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'Flood': return <CloudRain className="h-6 w-6" />
      case 'Drought': return <Thermometer className="h-6 w-6" />
      case 'Wildfire': return <Flame className="h-6 w-6" />
      case 'Storm': return <Wind className="h-6 w-6" />
      default: return <AlertTriangle className="h-6 w-6" />
    }
  }

  return (
    <Card className="bg-gray-800 border-red-500">
      <CardHeader>
        <CardTitle className="text-red-500 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Current Threat in South Africa
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentDisaster ? (
          <div className="flex items-center space-x-2 text-white">
            {getAlertIcon(currentDisaster.type)}
            <span className="text-lg font-semibold">{currentDisaster.type}</span>
            <span>in {currentDisaster.location}</span>
            <span className="text-yellow-300">Severity: {currentDisaster.severity}/5</span>
          </div>
        ) : (
          <p className="text-gray-300">No immediate threats detected in South Africa</p>
        )}
      </CardContent>
    </Card>
  )
}
