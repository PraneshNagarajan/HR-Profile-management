import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./UI/Auth-Layout";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePassword";
import { useSelector } from "react-redux";

function App() {
  const auth = useSelector(state => state.auth.flag)
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/loginPage">
        </Redirect>
      </Route>
      <AuthLayout>
        <Route path="/loginPage">
          <LoginPage />
        </Route>
        <Route path="/resetPassword">
          <ResetPasswordPage />
        </Route>
        <Route path="/changePassword">
          {auth && <ChangePasswordPage />}
          {!auth && <Redirect to="/"></Redirect>}
        </Route>
      </AuthLayout>
    </Switch>
  );
}

export default App;
