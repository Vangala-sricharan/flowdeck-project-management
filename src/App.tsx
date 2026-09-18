import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useRouter } from './utils/router';

// Navigation & Layout
import { Sidebar } from './components/navigation/Sidebar';
import { TopBar } from './components/navigation/TopBar';
import { MobileDrawer } from './components/navigation/MobileDrawer';

// Modals
import { TaskDetailsModal } from './components/modals/TaskDetailsModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { GlobalToast } from './components/common/GlobalToast';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { TeamPage } from './pages/TeamPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AppContent: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { currentUser } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Authentication screens
  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }
  if (currentPath === '/register') {
    return <RegisterPage onNavigate={navigate} />;
  }

  // Route routing logic
  const renderCurrentView = () => {
    if (currentPath.startsWith('/projects/')) {
      const projectId = currentPath.replace('/projects/', '').split('/')[0];
      return <ProjectDetailPage projectId={projectId} onNavigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
      case '/dashboard':
        return <DashboardPage onNavigate={navigate} />;
      case '/projects':
        return <ProjectsPage onNavigate={navigate} />;
      case '/analytics':
        return <AnalyticsPage onNavigate={navigate} />;
      case '/tasks':
        return <TasksPage />;
      case '/calendar':
        return <CalendarPage />;
      case '/team':
        return <TeamPage />;
      case '/notifications':
        return <NotificationsPage onNavigate={navigate} />;
      case '/profile':
        return <ProfilePage />;
      case '/settings':
        return <SettingsPage />;
      case '/admin':
        return <AdminPage />;
      default:
        return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans transition-colors duration-200">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar currentPath={currentPath} onNavigate={navigate} />
      </div>

      {/* Mobile Slide-Out Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={currentPath}
        onNavigate={navigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopBar
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8" id="flowdeck-main-scroll">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Interactive Modals & Toasts */}
      <GlobalToast />
      <TaskDetailsModal />
      <CreateTaskModal />
      <CreateProjectModal />
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
