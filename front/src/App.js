import React, { Component } from "react";
import { Admin, Resource, fetchUtils } from "react-admin";
import { PhotoList, PhotoCreate } from "./components/Photo";
import simpleReactProvider from "ra-data-simple-rest";
import Dashboard from "./components/Dashboard";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  const token = localStorage.getItem('token');
  options.headers.set('x-access-token', token);
  return fetchUtils.fetchJson(url, options);
};

class App extends Component {
  render() {
    return (
      <div>
        <Admin
          dashboard={Dashboard}
          dataProvider={simpleReactProvider("http://localhost:5000", httpClient)}
        >
          <Resource name="photo" list={PhotoList} create={PhotoCreate}/>
        </Admin>
      </div>
    );
  }
}

export default App;
