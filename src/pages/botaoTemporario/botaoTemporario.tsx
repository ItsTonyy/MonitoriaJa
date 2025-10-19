import React from "react";

interface ConfirmationButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  type = "button",
  onClick,
  disabled,
  children,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? "#ccc" : "#007BFF",
        color: "white",
        padding: "10px 20px",
        borderRadius: "6px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
};

export default ConfirmationButton;
