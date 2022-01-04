import "./App.scss";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./comp/Navbar";
import Dashboard from "./comp/Dashboard";
import Form from "./comp/Form";
import Orders from "./comp/Orders";
import Order from "./comp/Order";

function App() {
  const [login, setLogin] = useState({});
  const [loginForm, setLoginForm] = useState({
    loginForm: "",
    passForm: "",
    rememberForm: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status] = useState([
    "Oczekuje na akceptację",
    "Zaakceptowane na pierwszym poziomie",
    "Zaakceptowane, gotowe do zamówienia",
    "Zamówione",
    "Odebrane na magazynie",
    "Oczekiwanie na fakturę",
    "Zamówienie odebrane",
  ]);

  async function tryLogin(login, pass, remember) {
    const trylogin = await fetch(
      "http://10.47.8.28/eltwin_orders/api/api.php?type=tryLogin&login=" +
        login +
        "&pass=" +
        pass
    );
    const response = await trylogin.json();
    if (response) {
      setLogin(response);
      setIsLoggedIn(true);
      if (remember) {
        localStorage.setItem("user", JSON.stringify(response));
      } else {
        sessionStorage.setItem("user", JSON.stringify(response));
      }

      // console.log(JSON.parse(localStorage.getItem("user")));
      return true;
    } else {
      console.log("Błąd podczas logowania");
      return false;
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Zalogowano");
    tryLogin(loginForm.loginForm, loginForm.passForm, loginForm.rememberForm);
    setLoginForm({ loginForm: "", passForm: "", rememberForm: false });
  };
  const handleLoginForm = (e) => {
    e.preventDefault();
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setLoginForm((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setLogin({});
    setIsLoggedIn(false);
    console.log("wylogowano");
  };

  useEffect(() => {
    if (!isLoggedIn) {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        setLogin(user);
        setIsLoggedIn(true);
      } else if (sessionStorage.getItem("user")) {
        const user = JSON.parse(sessionStorage.getItem("user"));
        setLogin(user);
        setIsLoggedIn(true);
      }

      return;
    } else {
      return () => {};
    }
  }, [login, isLoggedIn]);

  console.log(login);

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? (
          <div>
            <Navbar user={login} logout={logout} />
            <Switch>
              <Route path="/" exact>
                <Dashboard user={login} />
              </Route>
              <Route path="/form" exact>
                <Form
                  user={login}
                  edit={false}
                  key={window.location.pathname}
                />
              </Route>
              <Route path="/form/:editId">
                <Form user={login} edit={true} />
              </Route>
              <Route path="/orders">
                <Orders user={login} statusy={status} />
              </Route>
              <Route path="/order/:id">
                <Order user={login} statusy={status} />
              </Route>
            </Switch>
          </div>
        ) : (
          <div className="notLoggedIn">
            <div className="loginBox shadow p-3">
              <h3>Zaloguj się!</h3>
              <hr />
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Twoje inicjały
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    onChange={handleLoginForm}
                    name="loginForm"
                    value={loginForm.loginForm}
                  />
                  <div id="emailHelp" className="form-text">
                    Inicjały z eltwin
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Hasło
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    onChange={handleLoginForm}
                    name="passForm"
                    value={loginForm.passForm}
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                    onChange={handleLoginForm}
                    name="rememberForm"
                    value={loginForm.rememberForm}
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Zapamiętaj mnie na tym urządzeniu
                  </label>
                </div>
                <button type="submit" className="btn btn-primary">
                  Zaloguj się
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
