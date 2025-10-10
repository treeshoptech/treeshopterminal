import { useState, useEffect } from 'react';

export function useAuth() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string>('org_demo');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    const org = localStorage.getItem('orgId');

    if (email) {
      setUserEmail(email);
      setIsAuthenticated(true);
    }

    if (org) {
      setOrgId(org);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('orgId');
    setUserEmail(null);
    setOrgId('org_demo');
    setIsAuthenticated(false);
  };

  return { userEmail, orgId, isAuthenticated, logout };
}
