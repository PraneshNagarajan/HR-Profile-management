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
import StatusTrackerPage from "./pages/StatusTrackerPage";
import ManageSupply from "./pages/ManageSupply";
import Notifications from "./pages/Notifications";
import { NotificationActions } from "./Redux/NotificationSlice";

function App() {
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.role);
  const [isClientPresent, setISClientPresent] = useState(false);
  const [isTechPresent, setISTechPresent] = useState(false);
  const dispatch = useDispatch();
  const clientRef = firestore.collection("Clients");
  const techonologyRef = firestore.collection("Skills");
  const usersRef = firestore.collection("Employee-Info").doc("users");

  useEffect(() => {
    if(auth.flag){
      firestore.collection("Notifications").doc(auth.email).get().then((res) => {
        let unreadData = res.data() !== undefined ? Object.values(res.data()).filter(
          (item) => item.status === "unread"
        ): 0;
        dispatch(NotificationActions.getNotifications({key: unreadData.length, data: res.data()}))
      })
    }
  },[auth.flag])


  useEffect(() => {
    // Get real-time data
    usersRef.onSnapshot((querySnapshot) => {
      dispatch(
        DemandPreRequisiteActions.getUsers(Object.values(querySnapshot.data()))
      );
    });
    if (user.includes("FOCAL")) {
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
  }, [user, clientRef, techonologyRef, usersRef]);

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

      {auth.flag && (
        <Fragment>
          <Route path="/changePassword">
            <AuthLayout>
              <ChangePasswordPage />
            </AuthLayout>
          </Route>
          {(user === "ADMIN" || user === "SUPERADMIN") && (
            <MainLayout>
              <Route path="/notifications">
                <Notifications />
              </Route>
              <Route path="/adminHomePage">
                <AdminHomePage />
              </Route>
              <Route path="/addEmployees">
                <AddEmployeePage />
              </Route>
              <Route path="/manageEmployeeProfile/:id">
                <ManageEmployeeProfilePage />
              </Route>
            </MainLayout>
          )}
          {user === "FOCAL" && (
            <MainLayout>
              <Route path="/notifications">
                <Notifications />
              </Route>
              <Route path="/manageEmployeeProfile/:id">
                <ManageEmployeeProfilePage />
              </Route>
              <Route path="/focalHomePage">
                {/* <FocalHomePage /> */}
                <UserHomePage />
              </Route>
              <Route path="/createDemand">
                <CreateDemand
                  clientFlag={isClientPresent}
                  techFlag={isTechPresent}
                />
              </Route>
              <Route path="/manageSupplies">
                <StatusTrackerPage />
              </Route>
              <Route path="/viewSupply/:demandId">
                <CreateSupply />
              </Route>
              <Route path="/manageSupply/:demandId">
                <ManageSupply />
              </Route>
            </MainLayout>
          )}
          {user.includes("RECRUITER") && (
            <MainLayout>
              <Route path="/notifications">
                <Notifications />
              </Route>
              <Route path="/manageEmployeeProfile/:id">
                <ManageEmployeeProfilePage />
              </Route>
              <Route path="/userHomePage">
                <UserHomePage />
              </Route>
              <Route path="/createSupply">
                <CreateSupply />
              </Route>
            </MainLayout>
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
