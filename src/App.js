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
import { fireAuth, firestore } from "./firebase";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DemandPreRequisiteActions } from "./Redux/DemandCreationPreRequisite";
import UserHomePage from "./pages/UserHomePage";
import CreateSupply from "./pages/CreateSupply";
import AdminHomePage from "./pages/AdminHomePage";
import StatusTrackerPage from "./pages/StatusTrackerPage";
import ManageSupply from "./pages/ManageSupply";
import Notifications from "./pages/Notifications";
import { NotificationActions } from "./Redux/NotificationSlice";
import Spinners from "./components/Spinners";
import { useMediaQuery } from "react-responsive";
import ManageEmployee from "./pages/ManageEmployee";

function App() {
  const history = useHistory();
  const location = useLocation();
  const sm = useMediaQuery({ maxWidth: 768 });
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.auth.role);
  const [isClientPresent, setISClientPresent] = useState(false);
  const [isTechPresent, setISTechPresent] = useState(false);
  const dispatch = useDispatch();
  const clientRef = firestore.collection("Clients");
  const techonologyRef = firestore.collection("Skills");
  const usersRef = firestore.collection("Employee-Info").doc("users");
  const [initApp, setInitApp] = useState("");

  useEffect(() => {
    firestore
      .collection("Employee-Info")
      .doc("new")
      .update({})
      .then(() => {
        setInitApp(true);
        history.push("/addEmployees");
      })
      .catch(() => {
        setInitApp(false);
        history.push("/loginPage");
      });
  }, []);

  useEffect(() => {
    if (auth.flag) {
      firestore
        .collection("Notifications")
        .doc(auth.email)
        .get()
        .then((res) => {
          let unreadData =
            res.data() !== undefined
              ? Object.values(res.data()).filter(
                  (item) => item.status === "unread"
                )
              : 0;
          dispatch(
            NotificationActions.getNotifications({
              key: unreadData.length,
              data: res.data(),
            })
          );
        });
    }
  }, [auth.flag]);

  useEffect(() => {
    // Get real-time data
    if (typeof initApp != "string" && !initApp) {
      usersRef.onSnapshot((querySnapshot) => {
        dispatch(
          DemandPreRequisiteActions.getUsers(
            Object.values(querySnapshot.data())
          )
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
    }
  }, [user, clientRef, techonologyRef, usersRef]);
console.log(initApp == false)
  return (
    <Switch>
      <Route path="/" exact>
        {typeof(initApp) === "string" && (
          <AuthLayout>
            <span className={sm ? "mt-5 bg-hero" : ""}>
              <Spinners color={sm ? false : true}>
                <p
                  className={`${
                    sm ? "text-dark" : "text-primary"
                  } text-center fw-bold`}
                  style={{ marginTop: "60%" }}
                >
                  Intializing App. Please wait....
                </p>
              </Spinners>
            </span>
          </AuthLayout>
        )}
        {typeof(initApp) != "string" && initApp == false && <Redirect to="/loginPage"></Redirect>}
      </Route>
      <Route path="/loginPage" exact>
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      </Route>

      <Route path="/resetPassword" exact>
        <AuthLayout>
          <ResetPasswordPage />
        </AuthLayout>
      </Route>

      {initApp && (
        <Route path="/addEmployees">
          <MainLayout>
            <AddEmployeePage flag={true} />
          </MainLayout>
        </Route>
      )}

      {auth.flag && (
        <Fragment>
          <Route path="/changePassword">
            <AuthLayout>
              <ChangePasswordPage />
            </AuthLayout>
          </Route>

          {(user === "ADMIN" || user === "SUPERADMIN") && (
            <MainLayout
              showNavbar={
                location.pathname.includes("/changePassword") ? false : true
              }
            >
              <Route path="/notifications">
                <Notifications />
              </Route>
              <Route path="/adminHomePage">
                <AdminHomePage />
              </Route>
              <Route path="/addEmployees">
                <AddEmployeePage />
              </Route>
              <Route path="/manageEmployees">
              <ManageEmployee/>
              </Route>
              <Route path="/manageEmployeeProfile/:mode/:id/">
                <ManageEmployeeProfilePage />
              </Route>
            </MainLayout>
          )}

          {user === "FOCAL" && (
            <MainLayout
              showNavbar={
                location.pathname.includes("/changePassword") ? false : true
              }
            >
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
            <MainLayout
              showNavbar={
                location.pathname.includes("/changePassword") ? false : true
              }
            >
              <Route path="/Supplies">
                <StatusTrackerPage />
              </Route>
              <Route path="/notifications">
                <Notifications />
              </Route>
              <Route path="/manageEmployeeProfile/:id">
                <ManageEmployeeProfilePage />
              </Route>
              <Route path="/userHomePage">
                <UserHomePage />
              </Route>
              <Route path="/createSupply/:supplyId">
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
