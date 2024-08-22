import { Modal, Button, Text, TextInput, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { doCreateUserWithEmailAndPassword } from "../../Firebase/auth";
import { createNewUser } from "../../Utility/DatabaseWriteUtil.js";

function Registration() {
  const [opened, { open, close }] = useDisclosure(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password, username);
        setError(null);
      } catch (err) {
        setError({message: "Email already in use!"});
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Registrer bruker" centered>
        <form>
          <Stack  gap="lg">
              <TextInput
                label="Brukernavn"
                withAsterisk
                required
                placeholder="Brukernavn"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
              <TextInput
                label="Epost"
                withAsterisk
                required
                placeholder="Epost"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <TextInput
                label="Passord"
                withAsterisk
                required
                placeholder="Passord"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <Button type="submit" disabled={isRegistering} onClick={onSubmit}>
                Registrer
              </Button>
              {error && <p>{error.message}</p>}
          </Stack>
        </form>
      </Modal>
      <Button onClick={open}>Registrer ny bruker</Button>
    </>
  );
}

export default Registration;
