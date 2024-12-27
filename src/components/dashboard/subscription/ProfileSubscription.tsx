import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingPlans } from "./pricing-plan-data";

export default function ProfileSubscription() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("Starter");

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-center mb-4">
        Choose the Perfect Plan for Your Business
      </h1>
      <p className="text-xl text-center text-muted-foreground mb-8">
        Unlock powerful features to streamline your operations
      </p>

      <div className="flex items-center justify-center mb-12">
        <Label
          htmlFor="billing-toggle"
          className="mr-2 text-sm font-medium cursor-pointer"
        >
          MONTHLY
        </Label>
        <Switch
          id="billing-toggle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label
          htmlFor="billing-toggle"
          className="ml-2 text-sm font-medium cursor-pointer"
        >
          YEARLY
        </Label>
        <Badge variant="secondary" className="ml-4">
          SAVE 20%
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative overflow-hidden transition-all duration-300 ${
              plan.popular ? "border-primary shadow-lg scale-105" : ""
            } ${selectedPlan === plan.name ? "ring-2 ring-primary" : ""} 
            hover:shadow-xl cursor-pointer`}
            onClick={() => setSelectedPlan(plan.name)}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground py-1 px-4 rounded-bl-lg font-medium text-sm">
                MOST POPULAR
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-4">
                ${isYearly ? (plan.price * 12 * 0.8).toFixed(2) : plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /{isYearly ? "year" : "mo"}
                </span>
              </div>
              {plan.highlightFeature && (
                <p className="font-medium mb-4 text-primary">
                  {plan.highlightFeature}
                </p>
              )}
              <h3 className="font-medium mb-2">Plan Features:</h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {feature.tooltip ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help border-dotted border-b border-gray-400">
                                {feature.text}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        feature.text
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
              >
                {selectedPlan === plan.name ? "Current Plan" : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
