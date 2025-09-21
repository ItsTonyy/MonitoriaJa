import { Button } from "@mui/material";

import { styled } from "@mui/material/styles";
import "./ConfirmationButton.module.css";

const CustomLoginButton = styled(Button)({
  backgroundColor: "var(--cor-secundaria)",
  color: "white",
  fontWeight: "bold",
  borderRadius: "20px",
  padding: "12px 0",
  "&:hover": {
    backgroundColor: "var(--cor-primaria)",
  },
  "&:disabled": {
    backgroundColor: "#ccc",
    color: "#666",
  },
});

export default CustomLoginButton;
