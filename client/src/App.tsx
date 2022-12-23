import { BrowserRouter, RouteObject, useRoutes } from "react-router-dom";
import "./App.css";
import MainNav from "./stuff/MainNav";
import Session from "./stuff/Session";
import Sessions from "./stuff/Sessions";

function App() {
  const routes: RouteObject[] = [
    {
      path: "/",
      children: [
        { index: true, element: <div>Nåt fint sen</div> },
        {
          path: "/sessions",
          element: <Sessions />,
          children: [
            {
              path: "/sessions/:id",
              element: <Session />,
            },
          ],
        },
      ],
    },
  ];

  const content = useRoutes(routes);
  return (
    <>
      <MainNav />
      {content}
    </>
  );
}

export default App;
