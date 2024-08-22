import { Group, Stack } from "@mantine/core";
import Header from "../Components/Header";
import LogInBox from "../Components/Login/LogInBox";

function Login() {
  return (
    <Stack>
      <Header></Header>
      <Group justify="center">
        <LogInBox></LogInBox>
      </Group>
    </Stack>
  );
}

export default Login;
