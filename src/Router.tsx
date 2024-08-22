import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Game from './Pages/Game';
import Registration from './Components/Login/Registration';
import UserFavorites from './Pages/UserFavorites';
import UserQueue from './Pages/UserQueue';
import Admin from './Pages/Admin';
import UserRatings from './Pages/UserRatings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/Login',
    element: <Login />,
  },
  {
    path: '/Game/:gameID',
    element: <Game />,
  },
  {
    path: '/registration',
    element: <Registration />,
  },
  {
    path: '/UserFavorites',
    element: <UserFavorites />,
  },
  {
    path: '/UserQueue',
    element: <UserQueue />,
  },
  {
    path: '/Admin',
    element: <Admin />,
  },
  {
    path: '/UserRatings',
    element: <UserRatings />,
  }

]);

export function Router() {
  return (
    <RouterProvider router={router} />

  );
}
