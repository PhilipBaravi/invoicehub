import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { FC } from "react";

const MockMessage: FC = () => {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>This is mock data</AlertTitle>
      <AlertDescription>
        Start sending invoices to show actual data.
      </AlertDescription>
    </Alert>
  );
};

export default MockMessage;
