/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';

import CadmusNavbarAdmin from '../src/index';
import FakeClient from './FakeClient';

const client = new FakeClient();

function CadmusNavbarAdminWrapper() {
  return (
    <div>
      <CadmusNavbarAdmin client={client} />
    </div>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CadmusNavbarAdminWrapper />,
    document.getElementById('cadmus-navbar-admin'),
  );
}, false);
