import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Profile = {
  id: string;
  display_name: string | null;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<{ error: string | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  // 1. Session laden und auf Login/Logout reagieren
  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Profil laden, sobald ein User da ist
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    supabase
      .from("profiles")
      .select("id, display_name")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (error) console.error(error);
        setProfile(data ?? null);
      });
  }, [userId]);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: "E-Mail oder Passwort ist falsch." };
    }

    return { error: null };
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  }

  // Name update
  async function updateDisplayName(name: string) {
    if (!user) return { error: "Nicht eingeloggt." };

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name })
      .eq("id", user.id);

    if (error) return { error: "Speichern fehlgeschlagen." };

    setProfile((prev) => (prev ? { ...prev, display_name: name } : prev));
    return { error: null };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        login,
        logout,
        updateDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth muss innerhalb eines AuthProvider verwendet werden.",
    );
  }

  return context;
}
