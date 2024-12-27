export interface UserFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface RegisterFormProps {
  setUserDetails: (details: UserFormValues) => void;
}

export interface CompanyRegistrationFormProps {
  userDetails: UserFormValues | null;
}

export interface CompanyFormValues {
  title: string;
  phone: string;
  website?: string;
  email: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export interface EmailVerificationWindowProps {
  email: string;
  onClose: () => void;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
