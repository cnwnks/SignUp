import React, { useState, useEffect } from "react";
import { Fade, List, ListItem, ListItemIcon, ListItemText,} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const PasswordRequirements = ({ requirements }) => {
  const [visibleRequirements, setVisibleRequirements] = useState({
    hasLowerCase: true,
    hasUpperCase: true,
    hasNumber: true,
    hasSpecialChar: true,
    hasMinLength: true,
  });

  useEffect(() => {
    Object.keys(requirements).forEach((key) => {
      if (!requirements[key]) {
        setVisibleRequirements((prev) => ({ ...prev, [key]: true }));
      }
    });
  }, [requirements]);

  useEffect(() => {
    const timers = Object.keys(requirements).map((key) => {
      if (requirements[key] && visibleRequirements[key]) {
        return setTimeout(() => {
          setVisibleRequirements((prev) => ({ ...prev, [key]: false }));
        }, 1000);
      }
      return null;
    });

    return () => timers.forEach((timer) => timer && clearTimeout(timer));
  }, [requirements]);

  const requirementsList = [
    {
      label: "at least one lower case letter(a-z)",
      met: requirements.hasLowerCase,
      key: "hasLowerCase",
    },
    {
      label: "at least one Upper case letter(A-Z)",
      met: requirements.hasUpperCase,
      key: "hasUpperCase",
    },
    {
      label: "at least add one number (0-9)",
      met: requirements.hasNumber,
      key: "hasNumber",
    },
    {
      label: "at least one special car(!@#$%^&*)",
      met: requirements.hasSpecialChar,
      key: "hasSpecialChar",
    },
    {
      label: "at least 8 cars",
      met: requirements.hasMinLength,
      key: "hasMinLength",
    },
  ];

  return (
    <div style={{ marginTop: "8px" }}>
      <List dense sx={{ padding: 0 }}>
        {requirementsList.map((req) => (
          <Fade
            in={visibleRequirements[req.key]}
            timeout={300}
            key={req.key}
            unmountOnExit
          >
            <ListItem sx={{ padding: "0 0 0 16px" }}>
              <ListItemIcon sx={{ minWidth: "30px" }}>
                {req.met ? (
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                ) : (
                  <HighlightOffIcon fontSize="small" color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={req.label}
                primaryTypographyProps={{
                  variant: "caption",
                  color: req.met ? "textPrimary" : "textSecondary",
                }}
              />
            </ListItem>
          </Fade>
        ))}
      </List>
    </div>
  );
};

export default PasswordRequirements;