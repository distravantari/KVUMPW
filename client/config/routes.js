import React from "react";

// component
import Home from "az-client/components/";
import Encryption from "az-client/components/Encryption";
import GetFaces from "az-client/components/GetFaces";

// pages
import Index from "az-client/pages/index";

import { Router, Route, useRouterHistory, IndexRoute } from "react-router";
import createHashHistory from "history/lib/createHashHistory";
const history = useRouterHistory(createHashHistory)({});

export default(
  <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={ Index } >
      <Route path="/Encryption" component={ Encryption }/>
      <Route path="/Get" component={ GetFaces }/>
      <IndexRoute component={ Home } />
    </Route>
  </Router>
);

