import React from 'react';
import { CadmusNavbarAdminClient } from './CadmusNavbarAdminClient';
import RESTClient from './RESTClient';

const ClientContext = React.createContext<CadmusNavbarAdminClient>(
  new RESTClient({ baseUrl: '/fake', pagesUrl: '/pages', csrfToken: '' }),
);

export default ClientContext;
