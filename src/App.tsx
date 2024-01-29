import React from 'react';
import routes from '@/routes/index';
import { useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const App = () => {
  const element = useRoutes(routes);

  return (
    <>
      <QueryClientProvider client={queryClient}>{element}</QueryClientProvider>
    </>
  );
};

export default App;
