import { Button, Paper, TextInput, Group, Text, Stack } from "@mantine/core";
import Registration from "./Registration";
import { useState } from "react";
import { doSignInWithEmailAndPassword } from "../../Firebase/auth";
import { useAuth } from "../../AuthContext/index.jsx";
import { useNavigate } from "react-router-dom";

function LogInBox() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        setError(null);
      } catch (err) {
        setError({ message: "Invalid email or password" });
      } finally {
        setIsSigningIn(false);
      }
    }
  };
  if (userLoggedIn) {
    navigate("/");
  } else {
    return (
      <Paper shadow="xl" radius="xs" withBorder p="xl">
        <form onSubmit={onSubmit}>
          <TextInput
            label="Email"
            placeholder="Email"
            style={{ width: "400px", marginBottom: "10px" }}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <TextInput
            label="Password"
            placeholder="Password"
            type="password"
            style={{ width: "400px", marginBottom: "40px" }}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />

          <Stack align="center">
            <Group justify="center" gap="xs" grow>
              <Button type="submit" disabled={isSigningIn}>
                Log in
              </Button>
              <Registration></Registration>
            </Group>
            {error && <Text>{error.message}</Text>}
          </Stack>
        </form>
      </Paper>
    );
  }
}

export default LogInBox;
