import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Router } from "./Router";
import { theme } from "./theme";
import { AuthProvider } from "./AuthContext";

export default function App() {
  return (
    <AuthProvider>
        <MantineProvider theme={theme}>
            <Router />
        </MantineProvider>
    </AuthProvider>
  );
}
