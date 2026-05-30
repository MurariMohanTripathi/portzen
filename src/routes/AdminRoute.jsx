import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from "../components/ui/LoadingScreen";
import { getAdminAccessByUsername } from "../services/adminService";

export default function AdminRoute() {
  const { user, loading } = useAuth();
  const { adminUsername } = useParams();
  const location = useLocation();
  const accessKey = user?.uid && adminUsername ? `${user.uid}:${adminUsername}` : "";
  const [accessResult, setAccessResult] = useState({ key: "", profile: null });

  useEffect(() => {
    if (loading || !user || !adminUsername) return undefined;

    let active = true;
    getAdminAccessByUsername(adminUsername, user)
      .then((profile) => {
        if (active) setAccessResult({ key: accessKey, profile });
      })
      .catch(() => {
        if (active) setAccessResult({ key: accessKey, profile: null });
      });

    return () => {
      active = false;
    };
  }, [accessKey, adminUsername, loading, user]);

  const checking = Boolean(user && accessKey && accessResult.key !== accessKey);

  if (loading || checking) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!accessResult.profile) return <Navigate to="/dashboard/overview" replace />;

  return <Outlet context={{ adminProfile: accessResult.profile }} />;
}
