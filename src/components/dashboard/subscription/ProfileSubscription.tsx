'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type PricingPlan = {
  name: string
  price: number
  salePrice?: number
  description: string
  credits: string
  features: string[]
  popular?: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    price: 0,
    description: 'For individuals who want to try out the most advanced AI audio',
    credits: '10k credits limit',
    features: [
      '10 minutes of ultra-high quality text to speech per month',
      'Generate speech in 32 languages using thousands of unique voices',
      'Translate content with automatic dubbing',
      'Create custom, synthetic voices',
      'Generate sound effects',
      'API access',
    ],
  },
  {
    name: 'Starter',
    price: 5,
    description: 'For hobbyists creating projects with AI audio',
    credits: '30k credits limit',
    features: [
      '30 minutes of ultra-high quality text to speech per month',
      'Clone your voice with as little as 1 minute of audio',
      'Access to the Dubbing Studio for more control over translation & timing',
      'License to use ElevenLabs for commercial use',
    ],
  },
  {
    name: 'Creator',
    price: 22,
    salePrice: 11,
    description: 'For creators making premium content for global audiences',
    credits: '100k credits limit',
    popular: true,
    features: [
      '100 minutes of ultra-high quality text to speech per month',
      'Professional voice cloning to create the most realistic digital replica of your voice',
      'Projects to create long form content with multiple speakers',
      'Audio Native to add narration to your website and blogs',
      'Higher quality audio - 192 kbps',
      'Usage based billing for additional credits',
    ],
  },
  {
    name: 'Pro',
    price: 99,
    description: 'For creators ramping up their content production',
    credits: '500k credits limit',
    features: [
      '500 minutes of ultra-high quality text to speech per month',
      'Higher quality audio via Projects - 192 kbps',
      '44.1 kHz PCM audio output via API',
      'Usage analytics dashboard',
      'Usage based billing for additional credits',
    ],
  },
]

export default function ProfileSubscription() {
  const [isYearly, setIsYearly] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('Creator')

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Pricing</h1>
      <p className="text-xl mb-8">
        From individual creators to the biggest enterprises, we have a plan for you.
      </p>
      
      <div className="flex items-center justify-end mb-8">
        <span className="mr-2 text-sm font-medium">MONTHLY</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className="ml-2 text-sm font-medium">YEARLY</span>
        <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          2 MONTHS FREE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`border rounded-lg p-6 flex flex-col ${
              plan.popular ? 'border-black' : ''
            } ${selectedPlan === plan.name ? 'ring-2 ring-primary' : ''}`}
          >
            {plan.popular && (
              <div className="bg-black text-white text-center py-1 px-4 rounded-full mb-4 text-sm font-medium">
                MOST POPULAR
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="text-4xl font-bold mb-4">
              ${isYearly ? (plan.price * 10).toFixed(2) : plan.price}
              <span className="text-base font-normal">/mo</span>
            </div>
            {plan.salePrice && (
              <div className="mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  FIRST MONTH 50% OFF
                </span>
                <div className="mt-2">
                  <span className="text-gray-500 line-through">${plan.price}</span>
                  <span className="text-4xl font-bold ml-2">
                    ${plan.salePrice}
                    <span className="text-base font-normal">/mo</span>
                  </span>
                </div>
              </div>
            )}
            <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="mb-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={plan.name} id={`plan-${plan.name}`} />
                <Label htmlFor={`plan-${plan.name}`}>
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {selectedPlan === plan.name ? 'SELECTED' : 'SELECT PLAN'}
                  </Button>
                </Label>
              </div>
            </RadioGroup>
            <p className="font-medium mb-4">{plan.credits}</p>
            <h3 className="font-medium mb-2">What's included</h3>
            <ul className="space-y-2 flex-grow bg-gray-100 p-4 rounded-lg">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}