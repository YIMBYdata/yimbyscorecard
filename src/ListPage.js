import React from 'react';
import queryString from 'query-string';

import ListEntry from './ListEntry';
import politiciansLookup from './politicians.json';


const gapi = window.gapi;
const API_KEY = 'AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0';


export default class ListPage extends React.Component {
  constructor(props) {
    super(props)

    const paramString = this.props.location.search;
    const params = paramString ? queryString.parse(paramString) : {}

    this.state = {
      address: params.address || '',
      zipcode: params.zipcode || '',
      results: {},
    }
  }

  componentDidMount() {
    gapi.client.setApiKey(API_KEY);

    if (this.state.address !== '' && this.state.zipcode !== '') {
      this.fetchResults()
    }
  }

  fetchResults = () => {
    const address = `${this.state.address}, ${this.state.zipcode}`

    const req = gapi.client.request({
      path: '/civicinfo/v2/representatives',
      params: {
        address: address,
        key: API_KEY
      }
    });

    req.execute((response) => {
      this.setState({
        results: response || {},
      })
    });
  }

  render() {
    return (
      <div className="ListPage">

        <nav className="navbar navbar-dark bg-dark">
          <a className="navbar-brand" href="./">YIMBY Representative Tracker</a>
        </nav>

        <div className="container">
          <div className="row">
            <div className="col" style={{ padding: '20px' }}>
              <form
                id="addressForm"
                onSubmit={this.submitAddress}
              >
                <div className="form-row addressForm">
                  <div className="col-ato">
                    <input
                      id="address"
                      className="form-control"
                      type="text"
                      placeholder="Enter your street address"
                      required={true}
                      value={this.state.address}
                    />
                  </div>
                  <div className="col-ato">
                    <input
                      id="zipcode"
                      className="form-control"
                      type="number"
                      placeholder="zipcode"
                      required={true}
                      value={this.state.zipcode}
                    />
                  </div>
                  <div className="col-ato">
                    <button
                      type="submit"
                      className="btn btn-primary pull-right"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div id="accordion" role="tablist" aria-multiselectable="true">
            {this.state.results.offices && this.state.results.offices.length > 0 &&
              this.state.results.offices.map((office, index) =>
                <ListEntry
                  key={index}
                  office={office}
                  officials={this.state.results.officials}
                  index={index}
                />
              )
            }
          </div>
        </div>

      </div>
    )
  }
}
