import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from './pages/LoginPage';
import { useEffect } from 'react';
import { firestore } from './firebase';
import AuthLayout from './UI/Auth-Layout';

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
    </AuthLayout>
    </Switch>
  );
}

export default App;
