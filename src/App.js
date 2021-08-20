import "./App.css";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [login, setLogin] = useState({});
  const [loginForm, setLoginForm] = useState({
    loginForm: "",
    passForm: "",
    rememberForm: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function checkLogin(name) {
    const getUserInfo = await fetch(
      "http://localhost/eltwin_orders/api/api.php?type=getUserInfo&login=" +
        name
    );
    const response = await getUserInfo.json();
    if (response) {
      setLogin(response);
      setIsLoggedIn(true);
      localStorage.setItem("userId", response.id);
      localStorage.setItem("userName", response.name);
      localStorage.setItem("userEmail", response.email);
      localStorage.setItem("userLevel", response.level);
      return true;
    } else {
      console.log("Błąd podczas logowania");
      return false;
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    // checkLogin("pko");
    console.log(loginForm);
    console.log("Zalogowano");
    setLoginForm({ loginForm: "", passForm: "", rememberForm: false });
  }
  function handleLoginForm(e) {
    e.preventDefault();
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setLoginForm((oldValues) => ({ ...oldValues, [name]: value }));
  }

  function logout() {
    localStorage.clear();
    setLogin({});
    setIsLoggedIn(false);
    console.log("wylogowano");
  }

  useEffect(() => {
    if (!isLoggedIn) {
      if (localStorage.length > 0) {
        let userId = localStorage.getItem("userId");
        let userName = localStorage.getItem("userName");
        let userEmail = localStorage.getItem("userEmail");
        let userLevel = localStorage.getItem("userLevel");
        setLogin({
          id: userId,
          name: userName,
          email: userEmail,
          level: userLevel,
        });
        setIsLoggedIn(true);
      }

      return;
    } else {
      return () => {};
    }
  }, [login, isLoggedIn]);

  function deleteLS() {
    localStorage.clear();
    console.log(localStorage);
  }

  function alertDebug() {
    alert("test");
  }

  async function checkToken() {
    if (localStorage.getItem("userToken")) {
      const checkUserToken = await fetch(
        "http://localhost/eltwin_orders/api/api.php?type=checkUserToken&login=" +
          localStorage.getItem("userName") +
          "&level=" +
          localStorage.getItem("userLevel") +
          "&email=" +
          localStorage.getItem("userEmail")
      );
      const response = await checkUserToken.ok;
      if (response) {
        console.log("check");
        return true;
      } else {
        alert("Nie zgadza się token!");
        logout();
      }
    }
  }

  console.log(localStorage);

  return (
    <div className="App">
      {isLoggedIn ? (
        <div>
          <h3>Witaj {login.name}! </h3>
          <button className="btn btn-primary" onClick={deleteLS}>
            Wykasuj localStorage
          </button>
          <br />
          <button onClick={logout}>Wyloguj sie</button>
          <br />
          <button
            onClick={() => {
              alertDebug();
              checkToken();
            }}
          >
            Testuj check :)
          </button>
          <br />
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
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
