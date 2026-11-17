import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

export type PersonOption = { id: string; display_name: string | null };

const PeopleContext = createContext<PersonOption[]>([]);

export function PeopleProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<PersonOption[]>([]);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, display_name")
      .then(({ data, error }) => {
        if (error) console.error(error);
        setPeople(data ?? []);
      });
  }, []);

  return (
    <PeopleContext.Provider value={people}>{children}</PeopleContext.Provider>
  );
}

export function usePeople() {
  const people = useContext(PeopleContext);
  return {
    people,
    getName: (id: string | null | undefined) =>
      people.find((p) => p.id === id)?.display_name ?? null,
  };
}
