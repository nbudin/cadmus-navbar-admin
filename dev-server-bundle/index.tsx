import ReactDOM from 'react-dom';

import CadmusNavbarAdmin from '../src/index';
import FakeClient from './FakeClient';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/cadmus-navbar-admin.css';

const client = new FakeClient();

function CadmusNavbarAdminWrapper() {
  return (
    <div>
      <CadmusNavbarAdmin client={client} />
    </div>
  );
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    ReactDOM.render(<CadmusNavbarAdminWrapper />, document.getElementById('cadmus-navbar-admin'));
  },
  false,
);
