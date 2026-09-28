"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type RegisterEmailContextType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const RegisterEmailContext = createContext<
  RegisterEmailContextType | undefined
>(undefined);

export const RegisterEmailProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [email, setEmail] = useState<string>("");

  return (
    <RegisterEmailContext value={{ email, setEmail }}>
      {children}
    </RegisterEmailContext>
  );
};
export const useRegisterEmailContext = () => {
  const context = useContext(RegisterEmailContext);
  if (!context) {
    throw new Error(
      "useRegisterEmailContext must be used within an RegisterEmailProvider",
    );
  }
  return context;
};
