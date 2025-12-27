import React from "react";
import { useCheckSubscriptionStatusQuery } from "@/features/api/subscriptionApi";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const SubscriptionProtectedRoute = ({ children, subscriptionType }) => {
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();

  const { data: subscriptionStatus, isLoading } = useCheckSubscriptionStatusQuery(
    subscriptionType,
    {
      skip: !user,
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!subscriptionStatus?.hasActiveSubscription) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location, 
          message: "Please subscribe to access this feature" 
        }} 
        replace 
      />
    );
  }

  return children;
};

export default SubscriptionProtectedRoute;
