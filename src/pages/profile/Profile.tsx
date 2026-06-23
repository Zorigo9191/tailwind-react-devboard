import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { UserNameContext } from "@/context/UserNameContext";
import { useContext, useState } from "react";

export default function Profile() {
  const context = useContext(UserNameContext);
  const [username, setUsername] = useState(context?.userName ?? "");

  function handleSubmit() {
    context?.setUserName(username);

    localStorage.setItem("kanban-user-name", username);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      <Card>
        <CardHeader className="gap-1">
          <CardTitle>Benutzername ändern</CardTitle>
          <CardDescription>Ändere deinen Anzeigern ....</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <label>Benutzername</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button className="w-fit" onClick={handleSubmit}>
              Speichern
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
