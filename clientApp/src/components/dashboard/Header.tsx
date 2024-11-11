import { AlertTriangle, LogOut, Siren } from 'lucide-react'
import { Button } from '../ui/button'

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Siren className="h-8 w-8 text-red-500 mr-2" />
        <h1 className="text-2xl font-bold text-yellow-300">South African Disaster Response Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Trigger Emergency Alert
        </Button>
        <Button variant="outline" className="text-yellow-300 border-yellow-300 hover:bg-yellow-300 hover:text-gray-900">
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </header>
  )
}
