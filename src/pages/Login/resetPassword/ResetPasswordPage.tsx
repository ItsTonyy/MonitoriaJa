import React from "react";
import ResetPasswordForm from "../../../components/reset-password-form/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/img/fundo.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
