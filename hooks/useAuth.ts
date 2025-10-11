import { useState, useEffect } from 'react';

export function useAuth() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string>('org_demo');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const email = localStorage.getItem('userEmail');
    const org = localStorage.getItem('orgId');

    console.log('Auth check:', { email, org }); // Debug log

    if (email && org) {
      setUserEmail(email);
      setOrgId(org);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('orgId');
    setUserEmail(null);
    setOrgId('org_demo');
    setIsAuthenticated(false);
  };

  return { userEmail, orgId, isAuthenticated, isLoading, logout };
}
