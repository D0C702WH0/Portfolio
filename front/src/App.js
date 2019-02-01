import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";

import { Admin, Resource, fetchUtils } from "react-admin";
import {
  PhotoList,
  PhotoEdit,
  PhotoCreate,
  PhotoShow
} from "./components/Photo";
import { CategoryList, CategoryEdit } from "./components/Category";
import simpleReactProvider from "ra-data-simple-rest";
import jsonServerProvider from "ra-data-json-server";
import Dashboard from "./components/Dashboard";
import authProvider from "./components/authProvider";
import addUploadFeature from "./components/addUploadFeature";

const apiDomain = process.env.REACT_APP_API_DOMAIN;

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = localStorage.getItem("token");
  options.headers.set("x-access-token", token);
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider(`${apiDomain}`, httpClient);
const uploadCapableDataProvider = addUploadFeature(dataProvider);

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/admin">
            <Admin
              authProvider={authProvider}
              dashboard={Dashboard}
              dataProvider={uploadCapableDataProvider}
            >
              <Resource
                name="photo"
                list={PhotoList}
                create={PhotoCreate}
                edit={PhotoEdit}
                show={PhotoShow}
              />
              <Resource
                name="category"
                list={CategoryList}
                edit={CategoryEdit}
              />
            </Admin>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;
