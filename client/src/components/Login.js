import React, {Component} from 'react';
import BasicStore from '../stores/basic-store';
import 'whatwg-fetch';

import {Redirect} from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            data: {
                non_fields_error: ''
            },
            loading: false,
            loadingText: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        // Set loading true
        this.setState({loading: true, loadingText: 'Please Wait...'});
        const url = BasicStore.makeUrl('api/v1/core/login/');
        const payload = {
            method: 'POST',
            headers: BasicStore.headers,
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        };
        fetch(url, payload).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({loading: true, loadingText: 'Redirecting...'});
            if (data.token) {
                BasicStore.setToken(data.token, data.user_role, data.user_id, data.user_name);
                // Clear username & password from state
                this.setState({
                    username: '',
                    password: '',
                    data: {
                        non_fields_error: ''
                    }
                });
                // TODO: This is very badly hard coded. I have plan to change it with another state.
                window.location = '/#/dashboard';
            }
            else {
                this.setState({loading: false, loadingText: ''});
                this.setState({data: data});
            }
        }).catch((err) => {
            console.log(err);
        });
        event.preventDefault();
    }

    render() {
        const cssClasses = "form-control";
        const errCssClasses = 'alert alert-danger ';
        const displayError = this.state.data.non_fields_error ? errCssClasses + 'd-block' : errCssClasses + 'd-none';
        const loggingButtonViewClass = this.state.loading ? 'd-block' : 'd-none';
        const loginButtonViewClass = this.state.loading ? 'd-none' : 'd-block';
        const isAuth = BasicStore.isAuthentication;
        if (isAuth) {
            return <Redirect to="/"/>
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-4 ml-auto mr-auto mt-4">
                        <div className="card">
                            <div className="card-header">Please Sign In</div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <fieldset className="p-4">
                                        <div className="form-group">
                                            <input className={cssClasses} placeholder="Username" type="text"
                                                   onChange={(event) => this.setState({username: event.target.value})}
                                                   value={this.state.username} required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input className={cssClasses} placeholder="Password" type="password"
                                                   onChange={(event) => this.setState({password: event.target.value})}
                                                   value={this.state.password} required
                                            />
                                        </div>
                                        <div className={displayError}>
                                            <small>{this.state.data.non_fields_error}</small>
                                        </div>
                                        <button className="btn btn-md btn-block btn-success">
                                            <span className={loginButtonViewClass}>Login</span>
                                            <span className={loggingButtonViewClass}>
                                                Please Wait... <i className="fa fa-spinner fa-spin"/>
                                            </span>
                                        </button>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;