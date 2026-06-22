import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('../pages/Home'));

const PageLoader = () => (
  <div
    className="fixed inset-0 flex items-center justify-center"
    style={{ background: '#030712' }}
  >
    <div
      className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
      style={{ borderColor: 'rgba(6,182,212,0.3)', borderTopColor: '#06b6d4' }}
    />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    ),
  },
  // Catch-all redirect to home
  { path: '*', element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
]);

export default router;
