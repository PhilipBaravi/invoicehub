import { FC, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PrivacyPolicy: FC = () => {
  const [activeTab, setActiveTab] = useState("terms")

  return (
    <div className="container mx-auto p-4 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">Legal Documents</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>
        <TabsContent value="terms">
          <ScrollArea className="h-[70vh] w-full rounded-md border p-4">
            <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
            <p className="mb-4">Last Updated: [Date]</p>
            <h3 className="text-xl font-semibold mb-2">1. Overview</h3>
            <p className="mb-4">
              Welcome to [Project Name], a subscription-based invoice and management system for managing invoices, generating invoices, and managing employees and clients. By accessing or using our service, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully.
            </p>
            <h3 className="text-xl font-semibold mb-2">2. Subscription Plans</h3>
            <p className="mb-4">We offer a range of subscription plans:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Basic Plan: Free version with limited features.</li>
              <li>Monthly and Annual Plans: Paid plans with expanded features and access.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">3. Billing and Payment</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Payment Method: All payments are processed through card payments.</li>
              <li>Automatic Renewal: Subscriptions are set to automatically renew by default. Users may disable automatic renewal at any time.</li>
              <li>Missed Payments: If a payment is missed, the account will automatically revert to the Basic (free) plan. The user will lose access to paid features but retain basic functionality.</li>
              <li>Cancellation: Users may cancel their subscription at any time. Access to paid features will continue until the end of the billing period, at which point the account will revert to the Basic plan.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">4. Account Usage</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Account Responsibility: Users are responsible for maintaining the confidentiality of their login credentials and for all activities under their account.</li>
              <li>Account Sharing: Sharing the main account is prohibited. Only authorized users are allowed to access the account.</li>
              <li>User Obligations: Users agree to use the service responsibly and in accordance with all applicable laws and these terms.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">5. Data Ownership and Privacy</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Data Ownership: Users retain ownership of all data they enter into the system, including invoices, client information, and employee records.</li>
              <li>Data Access: Only authorized users and developers have access to the data, which is stored securely in our database.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">6. Termination of Account</h3>
            <p className="mb-4">
              We reserve the right to suspend or terminate an account if the user violates these terms or engages in prohibited activities. Users may export their data before account termination.
            </p>
            <h3 className="text-xl font-semibold mb-2">7. Limitation of Liability</h3>
            <p className="mb-4">
              [Project Name] is provided "as is" without warranties of any kind. We are not liable for any data loss, interruptions, or other issues that may arise from using the service.
            </p>
            <h3 className="text-xl font-semibold mb-2">8. Modifications to the Terms</h3>
            <p className="mb-4">
              We may modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the revised terms.
            </p>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="privacy">
          <ScrollArea className="h-[70vh] w-full rounded-md border p-4">
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
            <p className="mb-4">Last Updated: [Date]</p>
            <h3 className="text-xl font-semibold mb-2">1. Introduction</h3>
            <p className="mb-4">
              [Project Name] is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and protect your information.
            </p>
            <h3 className="text-xl font-semibold mb-2">2. Data Collection</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal Information: We collect personal information necessary for account creation and subscription processing, such as name, email, and payment details.</li>
              <li>User-Generated Data: Information entered by users, including invoices, employee data, and client records, is stored in our system.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">3. Data Usage</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Service Improvement: We use collected data to enhance and maintain our services.</li>
              <li>Billing: Payment information is used solely for processing subscription payments.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">4. Data Sharing</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Third-Party Processors: We may share certain information with trusted third-party providers, such as payment processors, to facilitate service delivery.</li>
              <li>Access by Developers: Our developers may access data strictly for technical support and maintenance purposes.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">5. Data Security</h3>
            <p className="mb-4">
              We implement various security measures to protect user data and prevent unauthorized access. All data is stored securely, and only authorized users and developers can access it.
            </p>
            <h3 className="text-xl font-semibold mb-2">6. User Rights</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Access and Correction: Users can access and correct their personal information at any time.</li>
              <li>Data Deletion: Upon account cancellation, data will remain in our database as per our data retention policy, accessible only by users and developers.</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">7. Data Retention</h3>
            <p className="mb-4">
              User data is retained as long as the account remains active. Upon cancellation or downgrade to the Basic plan, data will remain in our system unless the user requests deletion.
            </p>
            <h3 className="text-xl font-semibold mb-2">8. Changes to the Privacy Policy</h3>
            <p className="mb-4">
              We may update this Privacy Policy periodically. Users will be notified of significant changes, and continued use of the service implies acceptance of the updated policy.
            </p>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <div className="mt-6 flex justify-center">
        <Link to='/login'>
        <Button onClick={() => console.log("Agreed to terms and privacy policy")}>
          Back To Login Page
        </Button>
        </Link>
      </div>
    </div>
  )
}

export default PrivacyPolicy