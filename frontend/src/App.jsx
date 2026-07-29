
import AppRouter from "./routes/AppRouter";
import SessionExpiredDialog from "./components/SessionExpiredDialog";

import './App.css'

function App() {
  

  return (
   <>
    <SessionExpiredDialog />
    <AppRouter />
    </>
  );
}

export default App
  