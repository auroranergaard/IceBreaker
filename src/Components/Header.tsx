import {
  Group,
  Box,
  Image,
  Input,
  ActionIcon,
  useMantineColorScheme,
  Stack,
} from "@mantine/core";
import LoginAndMenu from "./Login/LoginAndMenu";
import logo from "./logo.png";
import { Link } from "react-router-dom";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type HeaderProps = {
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
};

function Header({ searchTerm, setSearchTerm }: HeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) {
    return (
      <Box bg="#a6b1e1">
        <Stack>
          <Box p="sm">
            <Link to="/">
              <Box p="sm">
                <Image
                  src={logo}
                  alt="Icebreaker logo"
                  width={50}
                  height={50}
                />
              </Box>
            </Link>
            <Group justify="center">
              <LoginAndMenu></LoginAndMenu>
              <ActionIcon
                size="lg"
                radius="md"
                variant="filled"
                color={dark ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
              >
                {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
              </ActionIcon>
              <Input
                variant="filled"
                radius="xl"
                w={"250px"}
                placeholder="Søk"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm && setSearchTerm(event.currentTarget.value)
                }
              />
            </Group>
          </Box>
        </Stack>
      </Box>
    );
  }

  return (
    <Box bg="#a6b1e1">
      <Group justify="space-between">
        <Link to="/">
          <Box p="xl">
            <Image src={logo} alt="Icebreaker logo" width={50} height={50} />
          </Box>
        </Link>
        <Input
          variant="filled"
          radius="xl"
          w={"700px"}
          placeholder="Søk"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm && setSearchTerm(event.currentTarget.value)
          }
        />
        <Box p="xl">
          <Group>
            <LoginAndMenu></LoginAndMenu>
            <ActionIcon
              size="lg"
              radius="md"
              variant="filled"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </Group>
        </Box>
      </Group>
    </Box>
  );
}

export default Header;
