#Routing

## How to use routing in IceBreaker:

- For routing in IceBreaker, we use the `react-router-dom` package. This package is used to handle routing in the application.
- To add a new route, import the page you want to route to in App.tsx. The format is as follows: \
import PageName from './Pages/PageName';
- In order to add a new route to a page, add the route in the "Routes" tag in App.tsx. in the following format: \
\<Route path="/PageName" element={\<PageName /\>\} /\>

- For this to work correctly all new pages must be located in the Pages folder at src/Pages

In order to add a navigation link in any page, add this: \
\<Link to="/"\>Home\</Link\> --- Note: The path "/" will automatically route the user to the Home page. \
\<Link to="/Categories"\>Categories\</Link\> --- Note: To route the user to any other page, the pagename must be included.