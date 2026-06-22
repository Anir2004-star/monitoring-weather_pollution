import { RouterProvider } from 'react-router-dom';
import router from './routes';
import useSolarTheme from './hooks/useSolarTheme';

const App = () => {
  useSolarTheme();

  return <RouterProvider router={router} />;
};

export default App;
