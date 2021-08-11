import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./UI/Auth-Layout";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePassword";
import { useSelector } from "react-redux";
import NavBar from "./components/NavBar";
import { fireStorage } from "./firebase";
import { useEffect } from "react";


function App() {
  const auth = useSelector((state) => state.auth.flag);
  const user = useSelector((state) => state.auth.role);
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/loginPage"></Redirect>
        {}
      </Route>

      <Route path="/loginPage">
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Route>
      <Route path="/resetPassword">
        <AuthLayout>
          <ResetPasswordPage />
        </AuthLayout>
      </Route>
      <Route path="/changePassword">
        <AuthLayout>
          {auth && <ChangePasswordPage />}
          {!auth && <Redirect to="/"></Redirect>}
        </AuthLayout>
      </Route>
    </Switch>
  );
}

export default App;
