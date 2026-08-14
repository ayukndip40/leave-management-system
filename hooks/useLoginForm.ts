import { useForm } from "react-hook-form";

export interface LoginFormData {
  login: string;
  password: string;
}

export default function useLoginForm() {
  return useForm<LoginFormData>({
    defaultValues: {
      login: "",
      password: "",
    },
    mode: "onChange",
  });
}