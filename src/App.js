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
import { Fragment, useEffect, useState } from "react";
import AddEmployeePage from "./pages/AddEmployeePage";
import ManageEmployeeProfilePage from "./pages/ManageEmployeeProfilePage";
import CreateDemand from "./pages/CreateDemand";
import { firestore } from "./firebase";
import { useDispatch } from "react-redux";
import { DemandPreRequisiteActions } from "./Redux/DemandCreationPreRequisite";
import UserHomePage from "./pages/UserHomePage";
import CreateSupply from "./pages/CreateSupply";
import AdminHomePage from "./pages/AdminHomePage";
import ManageSupplyHomePage from "./pages/ManageSupplyHomePage";

function App() {
  const auth = useSelector((state) => state.auth.flag);
  const user = useSelector((state) => state.auth.role);
  const [isClientPresent, setISClientPresent] = useState(false);
  const [isTechPresent, setISTechPresent] = useState(false);
  const dispatch = useDispatch();
  const clientRef = firestore.collection("Clients");
  const techonologyRef = firestore.collection("Skills");
  const recruiterRef = firestore.collection("Employee-Info").doc("users");

  useEffect(() => {
    // Get real-time data
    if (user.includes("FOCAL")) {
      recruiterRef.onSnapshot((querySnapshot) => {
        dispatch(
          DemandPreRequisiteActions.getRecruiters(
            Object.values(querySnapshot.data())
          )
        );
      });

      techonologyRef.onSnapshot((querySnapshot) => {
        let technologies = {};
        querySnapshot.docs.map((doc, index) => {
          if (String(doc.id).includes("new")) {
            return;
          } else {
            technologies[doc.id] = doc.data().sets;
            if (querySnapshot.docs.length - 1 == index) {
              setISTechPresent(true);
              dispatch(DemandPreRequisiteActions.getTechnology(technologies));
            }
          }
        });
      });
      clientRef.onSnapshot((querySnapshot) => {
        let clients = {};
        querySnapshot.docs.map((doc, index) => {
          if (String(doc.id).includes("new")) {
            return;
          } else {
            clients[doc.id] = doc.data().names;
            if (querySnapshot.docs.length - 1 == index) {
              setISClientPresent(true);
              dispatch(DemandPreRequisiteActions.getClients(clients));
            }
          }
        });
      });
    }
  }, [user, clientRef, techonologyRef, recruiterRef]);

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
          <Route path="/manageEmployeeProfile/:id">
            <MainLayout>
              <ManageEmployeeProfilePage />
            </MainLayout>
          </Route>
          {user === "ADMIN" && (
            <Fragment>
              <Route path="/adminHomePage">
                <MainLayout>
                  <AdminHomePage />
                </MainLayout>
              </Route>
              <Route path="/addEmployees">
                <MainLayout>
                  <AddEmployeePage />
                </MainLayout>
              </Route>
            </Fragment>
          )}
          {user === "FOCAL" && (
            <Fragment>
              <Route path="/focalHomePage">
                <MainLayout>
                  <FocalHomePage />
                  {/* <UserHomePage /> */}
                </MainLayout>
              </Route>
              <Route path="/createDemand">
                <MainLayout>
                  <CreateDemand
                    clientFlag={isClientPresent}
                    techFlag={isTechPresent}
                  />
                </MainLayout>
              </Route>
            </Fragment>
          )}
          {user.includes("RECRUITER") && (
            <Fragment>
              <Route path="/userHomePage">
                <MainLayout>
                  <UserHomePage />
                </MainLayout>
              </Route>
              <Route path="/createSupply">
                <MainLayout>
                  <CreateSupply />
                </MainLayout>
              </Route>
              <Route path="/manageSupplies">
                <MainLayout>
                  <ManageSupplyHomePage />
                </MainLayout>
              </Route>
              <Route path="/manageSupply/:demandId">
                <MainLayout>
                  <ManageSupplyHomePage />
                </MainLayout>
              </Route>
            </Fragment>
          )}
        </Fragment>
      )}

      <Route path="**">
        <Redirect to="/"></Redirect>
      </Route>
    </Switch>
  );
}

export default App;
