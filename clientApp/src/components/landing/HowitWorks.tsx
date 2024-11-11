import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mb-12">
      <h2 className="text-3xl font-bold text-yellow-300 mb-6">How It Works</h2>
      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-gray-800">
          <TabsTrigger value="monitor" className="text-yellow-300">Monitor</TabsTrigger>
          <TabsTrigger value="analyze" className="text-yellow-300">Analyze</TabsTrigger>
          <TabsTrigger value="alert" className="text-yellow-300">Alert</TabsTrigger>
          <TabsTrigger value="respond" className="text-yellow-300">Respond</TabsTrigger>
        </TabsList>
        <TabsContent value="monitor" className="bg-gray-800 p-4 rounded-b-lg">
          <p className="text-gray-300">Our system continuously monitors various data sources, including weather stations, satellite imagery, and social media feeds, to gather real-time information about potential disasters across South Africa.</p>
        </TabsContent>
        <TabsContent value="analyze" className="bg-gray-800 p-4 rounded-b-lg">
          <p className="text-gray-300">Advanced AI algorithms analyze the collected data, identifying patterns and potential threats. This analysis takes into account historical data and geographical factors specific to each region of South Africa.</p>
        </TabsContent>
        <TabsContent value="alert" className="bg-gray-800 p-4 rounded-b-lg">
          <p className="text-gray-300">When a potential disaster is detected, the system immediately sends out alerts to users in the affected areas. Alerts are customized based on the user's location and preferences.</p>
        </TabsContent>
        <TabsContent value="respond" className="bg-gray-800 p-4 rounded-b-lg">
          <p className="text-gray-300">Users receive detailed information about the impending disaster, including safety instructions and evacuation routes if necessary. The system also notifies local authorities to coordinate emergency response efforts.</p>
        </TabsContent>
      </Tabs>
    </section>
  )
}
