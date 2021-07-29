import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import Auth from './hoc/auth'
import MovieDetail from "./views/MovieDetail/MovieDetail";

function App() {
  return (
    <Router>
      <div>      
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null )  } /> 
          <Route exact path="/login" component={Auth(LoginPage, false) } />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/movie/:movieId" component={Auth(MovieDetail, null)} />
          {/* auth.js의 funciton에 들어갈 파라미터 3개. 
          근데 마지막 파라미터 adminRoute=null은 admin 유저만 들어가기 원하는 곳에 
          true 적으면 됨. 디폴트는 null이라 해당사항 없으면 아무것도 안 적어도 됨. */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;

