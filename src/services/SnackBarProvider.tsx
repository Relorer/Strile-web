import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/lab/Alert";
import React, { createContext, useEffect, useMemo, useState } from "react";

export type Notify = (message: string, severity: AlertColor) => void;

interface AlertService {
  notify: Notify;
}

interface IAlert {
  message: string;
  severity: AlertColor;
  open: boolean;
}

export const SnackBarContext = createContext<AlertService | null>(null);

export const SnackBarProvider = ({ children }: any) => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);

  useEffect(() => {
    const count = alerts.length;
    if (count > 0 && !alerts[count - 1].open) {
      setAlerts((prev: any) => [
        ...prev.slice(0, alerts.length - 1),
        {
          message: alerts[count - 1].message,
          severity: alerts[count - 1].severity,
          open: true,
        },
      ]);
    }
  }, [alerts]);

  const alertService = useMemo(() => {
    return {
      notify: (mes: string, sev: AlertColor) => {
        const newAlert = { message: mes, severity: sev, open: false };
        setAlerts((prev: any) => [newAlert, ...prev]);
      },
    };
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    const clickaway: SnackbarCloseReason = "clickaway";
    if (reason !== clickaway) {
      setAlerts((prev: any) => prev.slice(0, alerts.length - 1));
    }
  };

  return (
    <SnackBarContext.Provider value={alertService}>
      {children}
      {alerts
        .filter((alert) => alert.open)
        .map((alert, i) => (
          <Snackbar
            key={i}
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <Alert onClose={handleClose} severity={alert.severity}>
              {alert.message}
            </Alert>
          </Snackbar>
        ))}
    </SnackBarContext.Provider>
  );
};
