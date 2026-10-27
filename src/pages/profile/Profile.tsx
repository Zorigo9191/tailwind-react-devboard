import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { profile, updateDisplayName } = useAuth();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setUsername(profile?.display_name ?? "");
  }, [profile]);

  async function handleSubmit() {
    const { error } = await updateDisplayName(username);
    setMessage(error ?? "Gespeichert.");
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      <Card>
        <CardHeader className="gap-1">
          <CardTitle>Benutzername ändern</CardTitle>
          <CardDescription>Ändere deinen Anzeigenamen.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <label htmlFor="username">Benutzername</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button className="w-fit" onClick={handleSubmit}>
              Speichern
            </Button>
            {message && <p className="text-sm">{message}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
