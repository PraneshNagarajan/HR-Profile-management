import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from './pages/LoginPage';
import AuthLayout from './UI/Auth-Layout';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {


  return (
    <Switch>
      <Route path="/" exact >
        <Redirect to="/loginPage">
            <LoginPage />
        </Redirect>
    </Route>
    <AuthLayout>
    <Route path="/loginPage">
    <LoginPage />
    </Route>
    <Route path="/resetPassword">
      <ResetPasswordPage />
    </Route>
    </AuthLayout>
    </Switch>
  );
}

export default App;
