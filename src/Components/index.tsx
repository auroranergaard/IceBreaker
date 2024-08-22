import { useState } from 'react'

interface Props {
  settLoggedInTilTrue: () => void; //støttefunksjon som kalles når noen logger inn
}

function index({ settLoggedInTilTrue }: Props) {
  const [userName, setUsername] = useState(""); //lagrer hva brukernavnet er til konsollen
  const [password, setPassword] = useState(""); //samme for passord

  const onLoginInner = () => {
    console.log("Username", userName) //disse bare printer det man skriver, men kan bruke API-kall i backend for å faktisk logge inn
    console.log("Password", password)
    settLoggedInTilTrue(); //gjør at man settes som logget inn i den andre klassen
  }

  return (//logginn siden man ser på starten
    <div style={{ padding: "2xs", gap: 2 }}>
      <input style={{ padding: "2xs" }} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={onLoginInner}>Logg inn</button>
    </div>
  )
}

function index() {
  return (
      <div>
          <h1>Test</h1>
      </div>

  );
}

export default index;