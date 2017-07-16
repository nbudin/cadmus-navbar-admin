/* eslint jsx-a11y/href-no-hash:0 */

import React from 'react';
import { NavigationItemPropType } from '../propTypes';

function PreviewLink({ navigationItem }) {
  if (navigationItem.navigation_section_id) {
    return <a className="dropdown-item" href="#">{navigationItem.title}</a>;
  }

  return <a className="nav-item nav-link" href="#">{navigationItem.title}</a>;
}

PreviewLink.propTypes = {
  navigationItem: NavigationItemPropType.isRequired,
};

export default PreviewLink;
