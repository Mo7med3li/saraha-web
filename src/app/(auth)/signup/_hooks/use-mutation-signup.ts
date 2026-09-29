import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../_actions/signup.api";
import { RegistrationFields } from "../_schema/signup.schema";

export const useMutationSignup = () => {
  const { mutateAsync: signup, isPending } = useMutation({
    mutationFn: async (data: RegistrationFields) => await signupApi(data),
    meta: {
      loadingMessage: "Creating your account....",
      errorMessage: "Fail to create your account",
      successMessage: "Your account created successfully",
    },
  });
  return { signup, isPending };
};
