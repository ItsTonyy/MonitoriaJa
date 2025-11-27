import { Button } from "@mui/material";

import { styled } from "@mui/material/styles";
import "./ConfirmationButton.module.css";

const CustomLoginButton = styled(Button)({
  backgroundColor: "primary",
  color: "white",
  fontWeight: "bold",
  borderRadius: "none",
  padding: "12px 0",
  "&:hover": {
    backgroundColor: "var(--cor-secundaria)",
  },
  "&:disabled": {
    backgroundColor: "#ccc",
    color: "#665",
  },
});

export default CustomLoginButton;
