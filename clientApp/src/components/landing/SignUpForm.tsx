import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function SignUpForm() {
  return (
    <section id="sign-up" className="mb-12">
      <h2 className="text-3xl font-bold text-yellow-300 mb-6">Sign Up for Emergency Alerts</h2>
      <Card className="bg-gray-800 border-yellow-300">
        <CardContent className="pt-6">
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-yellow-300">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" className="bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="email" className="text-yellow-300">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter your email address" className="bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="location" className="text-yellow-300">Location</Label>
              <Input id="location" placeholder="Enter your city or region" className="bg-gray-700 text-white border-gray-600" />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Sign Up for Alerts
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
