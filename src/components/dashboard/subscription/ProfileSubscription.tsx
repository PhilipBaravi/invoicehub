import { FC, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, CreditCard, Zap } from "lucide-react"

const ProfileSubscription: FC = () => {
  const [currentPlan, setCurrentPlan] = useState("Basic")
  const [isLoading, setIsLoading] = useState(false)

  const plans = [
    { name: "Basic", price: "$9.99", features: ["10 projects", "5 team members", "Basic support"] },
    { name: "Pro", price: "$19.99", features: ["Unlimited projects", "15 team members", "Priority support"] },
    { name: "Enterprise", price: "$49.99", features: ["Unlimited everything", "24/7 support", "Custom features"] },
  ]

  const handleUpgrade = (planName: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planName)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-6 max-w-8xl">
      <h1 className="text-3xl font-bold mb-6">Your Subscription</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan: {currentPlan}</CardTitle>
          <CardDescription>Your subscription renews on August 1, 2023</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
            <CreditCard className="h-5 w-5" />
            <span>Next billing date: July 31, 2023</span>
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/dashboard/payment-methods">
          <Button variant="outline" className="w-full sm:w-auto">Manage Payment Method</Button>
          </Link>
        </CardFooter>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Upgrade Your Plan</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={currentPlan === plan.name ? "border-stone-600" : ""}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {plan.name}
                {currentPlan === plan.name && (
                  <Badge variant="secondary">Current Plan</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-2xl font-bold">{plan.price}/month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-stone-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleUpgrade(plan.name)}
                disabled={currentPlan === plan.name || isLoading}
              >
                {isLoading ? (
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                ) : currentPlan === plan.name ? (
                  "Current Plan"
                ) : (
                  "Upgrade"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-stone-100 rounded-lg flex items-start space-x-4">
        <AlertCircle className="h-6 w-6 text-stone-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-stone-600">
          Upgrading your plan will take effect immediately. You'll be charged the prorated amount for the remainder of your current billing cycle. For more information, please contact our support team.
        </p>
      </div>
    </div>
  )
}

export default ProfileSubscription