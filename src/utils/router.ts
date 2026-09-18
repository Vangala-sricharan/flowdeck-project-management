import { useState, useEffect, useCallback } from 'react';

export interface RouteMatch {
  path: string;
  projectId?: string;
  subView?: string;
}

export function parseHash(hash: string): RouteMatch {
  // Normalize: remove leading # and trailing slashes
  let clean = hash.replace(/^#\/?/, '').trim();
  if (!clean) {
    return { path: '/dashboard' };
  }

  const parts = clean.split('/').filter(Boolean);

  if (parts[0] === 'projects' && parts[1]) {
    const projectId = parts[1];
    const subView = parts[2] || 'board';
    return {
      path: `/projects/${projectId}`,
      projectId,
      subView,
    };
  }

  return {
    path: `/${parts[0] || 'dashboard'}`,
  };
}

export function useRouter() {
  const [currentHash, setCurrentHash] = useState<string>(() => window.location.hash || '#/dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((targetPath: string) => {
    const formatted = targetPath.startsWith('#')
      ? targetPath
      : targetPath.startsWith('/')
      ? `#${targetPath}`
      : `#/${targetPath}`;
    window.location.hash = formatted;
  }, []);

  const route = parseHash(currentHash);

  return {
    currentHash,
    currentPath: route.path,
    route,
    navigate,
  };
}
