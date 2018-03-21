import React from 'react';
import PropTypes from 'prop-types';
import { ClientContextProvider } from './ClientContext';
import { DataContextProvider } from './DataContext';
import { EditingNavigationItemContextProvider } from './EditingNavigationItemContext';
import NavbarAdminForm from './components/NavbarAdminForm';
import './styles/cadmus-navbar-admin.css';

const CadmusNavbarAdminApp = ({ client }) => (
  <ClientContextProvider client={client}>
    <DataContextProvider>
      <EditingNavigationItemContextProvider>
        <NavbarAdminForm />
      </EditingNavigationItemContextProvider>
    </DataContextProvider>
  </ClientContextProvider>
);

CadmusNavbarAdminApp.propTypes = {
  client: PropTypes.shape({}).isRequired,
};

export default CadmusNavbarAdminApp;
