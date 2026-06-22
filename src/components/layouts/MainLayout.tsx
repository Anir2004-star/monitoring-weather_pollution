import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';

const NAV_ITEMS = [
  { to: '/',           label: 'Dashboard',  icon: '📊' },
  { to: '/forecast',   label: 'Forecast',   icon: '🌤️' },
  { to: '/hotspots',   label: 'Hotspots',   icon: '🔥' },
  { to: '/analytics',  label: 'Analytics',  icon: '📈' },
  { to: '/settings',   label: 'Settings',   icon: '⚙️' },
];

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const sidebar = useAppSelector((s) => s.ui.sidebar);
  const collapsed = sidebar === 'collapsed';

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <span className="text-2xl">🌍</span>
          {!collapsed && (
            <span className="font-semibold text-sm leading-tight text-white">
              Air Monitor
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="m-2 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors text-xs"
        >
          {collapsed ? '▶' : '◀ Collapse'}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
