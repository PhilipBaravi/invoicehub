import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/lib/hooks/use-toast";

const ResetPasswordConfirmationForm: FC = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");

    // After add endpoint
    // Password validation
    // if (!validatePassword(newPassword)) {
    //   newErrors.newPassword =
    //     "Password must include uppercase, lowercase, a number, and a special character.";
    //   valid = false;
    //   toast({
    //     title: "Error",
    //     description:
    //       "Password must include uppercase, lowercase, a number, and a special character.",
    //     variant: "destructive",
    //     duration: 3000,
    //   });
    // }

    // if (newPassword !== confirmNewPassword) {
    //   newErrors.confirmNewPassword = "Passwords do not match.";
    //   valid = false;
    //   toast({
    //     title: "Error",
    //     description: "Passwords do not match.",
    //     variant: "destructive",
    //     duration: 3000,
    //   });
    // }

    // if (!valid) {
    //   setErrors(newErrors);
    //   return;
    // }

    // setIsLoading(true);

    // if (true) {
    //   toast({
    //     title: "Success",
    //     description: "Password reset succesfull",
    //     variant: "success",
    //     duration: 3000,
    //   });
    // }
    // navigate("/login");
    // if (false) {
    //   toast({
    //     title: "Failed!",
    //     description: "Failed to updated password",
    //     variant: "destructive",
    //     duration: 3000,
    //   });
    // }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium mb-1"
          >
            New Password
          </label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formValues.newPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmNewPassword"
            className="block text-sm font-medium mb-1"
          >
            Confirm New Password
          </label>
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={formValues.confirmNewPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500 text-sm">{errors.confirmNewPassword}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          {isLoading ? "Loading..." : "Submit"}
        </Button>

        <p className="mt-6 text-xs">
          <Link to="/login" className="underline">
            {isLoading ? "Loading..." : "Back to Login"}
          </Link>
        </p>
      </form>
    </>
  );
};

export default ResetPasswordConfirmationForm;
