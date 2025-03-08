import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { User } from '../models/User';
import { getUserInfo, login } from '~/api';

type AuthContextType = {
    authToken?: string | null;
    currentUser?: User | null;
    handleLogin: (email: string, password: string) => Promise<void>;
    handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
    const [authToken, setAuthToken] = useState<string | null>();
    const [currentUser, setCurrentUser] = useState<User | null>();

    useEffect(() => {
        // Check if the user is already logged in
        async function fetchUser() {
            try {
                const response = await getUserInfo();

                const { authToken, user } = response.data;

                setAuthToken(authToken);
                setCurrentUser(user);
            } catch {
                setAuthToken(null);
                setCurrentUser(null);
            }
        }

        fetchUser();
    }, []);

    async function handleLogin(email: string, password: string) {
        try {
            const response = await login(email, password);

            const { authToken, user } = response.data;

            setAuthToken(authToken);
            setCurrentUser(user);
        } catch {
            setAuthToken(null);
            setCurrentUser(null);
        }
    }

    async function handleLogout() {
        setAuthToken(null);
        setCurrentUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                authToken,
                currentUser,
                handleLogin,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
