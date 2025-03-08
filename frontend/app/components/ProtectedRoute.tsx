import type { PropsWithChildren } from "react";
import type { User } from "./models/User";
import { useAuth } from "./provider/AuthProvider";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles: User['role'][];
};

export default function ProtectedRoute({ 
    allowedRoles,
    children
}: ProtectedRouteProps) {
    const { currentUser } = useAuth();

    if (currentUser === undefined) {
        return <div>Loading...</div>;
    }

    if (
        currentUser === null ||
        (allowedRoles && !allowedRoles.includes(currentUser.role))
    ){
        return <div>Unauthorized</div>;
    }
    
    return children;
}
