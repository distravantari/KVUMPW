import React from "react";

// component
import DropFile from "az-client/components/Dropfile";
import GEVCS from "az-client/components/GEVCS";
import Webcam from "az-client/unused/Webcam";
import Face from "az-client/unused/Face";

// pages
import Index from "az-client/pages/index";

import { Router, Route, useRouterHistory, IndexRoute } from "react-router";
import createHashHistory from "history/lib/createHashHistory";
const history = useRouterHistory(createHashHistory)({});

export default(
  <Router history={history} onUpdate={() => window.scrollTo(0, 0)}>
    <Route path="/" component={ Index } >
      <Route path="/Cam" component={ Webcam }/>
      <Route path="/Face" component={ Face }/>
      <Route path="/GEVCS" component={ GEVCS }/>
      <IndexRoute component={ DropFile } />
    </Route>
  </Router>
);
