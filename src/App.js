import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./pages/LoginPage";
import AuthLayout from "./UI/Auth-Layout";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePassword";
import { useSelector } from "react-redux";
import MainLayout from "./UI/Main-Layout";
import FocalHomePage from "./pages/FocalHomePage";
import { Fragment } from "react";


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

      {auth && (
        <Fragment>
          <Route path="/changePassword">
            <AuthLayout>
              <ChangePasswordPage />
            </AuthLayout>
          </Route>
          <Route path="/focalHomePage">
            <MainLayout>
              <FocalHomePage />
            </MainLayout>
          </Route>
        </Fragment>
      )}
      <Route path="*">
      <Redirect to="/"></Redirect>
      </Route>
    </Switch>
  );
}

export default App;
