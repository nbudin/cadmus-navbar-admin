import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import CadmusNavbarAdmin from '../src/index';
import RESTClient from '../src/RESTClient';

class CadmusNavbarAdminWrapper extends React.Component {
  constructor(props) {
    super(props);

    const queryParams = new URL(document.location).searchParams;
    const baseUrl = queryParams.get('baseUrl');
    const pagesUrl = queryParams.get('pagesUrl');
    const gotUrlsFromQueryParams = baseUrl && pagesUrl;

    this.state = {
      baseUrl: baseUrl || '',
      pagesUrl: pagesUrl || '',
      gotUrlsFromQueryParams,
    };
  }

  inputChanged = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  ludicrousSpeed = () => {
    const url = new URL(document.location);
    url.searchParams.set('baseUrl', this.state.baseUrl);
    url.searchParams.set('pagesUrl', this.state.pagesUrl);
    window.location.href = url.href;
  }

  render = () => {
    if (this.state.gotUrlsFromQueryParams) {
      const client = new RESTClient({
        baseUrl: this.state.baseUrl,
        pagesUrl: this.state.pagesUrl,
      });

      return (
        <div>
          <CadmusNavbarAdmin client={client} />
        </div>
      );
    }

    return (
      <form>
        <div className="form-group">
          <label htmlFor="baseUrl">Base URL (probably ends in <code>/navigation_items</code>)</label>
          <input id="baseUrl" name="baseUrl" className="form-control" type="text" value={this.state.baseUrl} onChange={this.inputChanged} />
        </div>

        <div className="form-group">
          <label htmlFor="pagesUrl">Pages URL (probably ends in <code>/pages</code>)</label>
          <input id="pagesUrl" name="pagesUrl" className="form-control" type="text" value={this.state.pagesUrl} onChange={this.inputChanged} />
        </div>

        <button type="button" className="btn btn-primary" onClick={this.ludicrousSpeed}>Ludicrous speed!</button>
      </form>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <CadmusNavbarAdminWrapper />,
    document.getElementById('cadmus-navbar-admin'),
  );
}, false);
