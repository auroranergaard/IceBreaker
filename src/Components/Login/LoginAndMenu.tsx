import { Menu, Button } from "@mantine/core";
import { useAuth } from "../../AuthContext/index.tsx";
import { doSignOut } from "../../Firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginAndMenu() {
  const { userLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  let isAdmin = (currentUser?.email == 'admin@icebreaker.com');

  if (userLoggedIn) {
    return (
      <Menu>
        <Menu.Target>
          <Button variant="filled" color="#424874" radius="md">
            Meny
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {isAdmin ?
            <Menu.Item onClick={() => navigate('/Admin')}> Rapporteringer</Menu.Item> : ''}
          <Menu.Item onClick={() => navigate('/UserRatings')}> Mine Vurderinger </Menu.Item>
          <Menu.Item onClick={() => navigate('/UserFavorites')}> Mine favoritter</Menu.Item>
          <Menu.Item onClick={() => navigate('/UserQueue')}> Mine køer</Menu.Item>
          <Menu.Item onClick={doSignOut}> Logg ut </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  } else {
    return (
      <Button
        variant="filled"
        color="#424874"
        radius="md"
        component="a"
        href="/login"
      >
        Logg inn
      </Button>
    );
  }
}

export default LoginAndMenu;
