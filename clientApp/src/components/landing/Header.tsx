import { Siren } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Siren className="h-8 w-8 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-yellow-300">South African Disaster Response System</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="#features" className="text-yellow-300 hover:text-yellow-100">Features</Link></li>
            <li><Link href="#how-it-works" className="text-yellow-300 hover:text-yellow-100">How It Works</Link></li>
            <li><Link href="#sign-up" className="text-yellow-300 hover:text-yellow-100">Sign Up</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
