import React, { useState } from "react";

interface ConfirmationButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string; 
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  type = "button",
  onClick,
  disabled,
  children,
}) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: disabled
          ? "#ccc"
          : hover
          ? "#1565c0"
          : "#1976d2",
        color: disabled ? "#666" : "#ffffff",
        padding: "10px 20px",
        borderRadius: "6px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.2s",
      }}
    >
      {children}
    </button>
  );
};

export default ConfirmationButton;
