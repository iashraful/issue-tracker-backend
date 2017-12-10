import React, {Component} from 'react';
import BasicStore from '../stores/basic-store';
import {Redirect} from 'react-router-dom';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 400,
            message: 'Please wait...',
            isAuth: BasicStore.isAuthentication
        };
    }

    makeUrl(path) {
        return BasicStore.apiUrl + path;
    }

    componentWillMount() {
        // Catch `change` event from Store
        BasicStore.on("change", () => {
            this.setState({isAuth: BasicStore.isAuthentication});
        });
        BasicStore.destroyToken();
    }

    render() {
        if(!this.state.isAuth) {
            return <Redirect to={BasicStore.urlPaths.home}/>
        }
        return (
            <div className="container">
                <div className="alert alert-info">
                    <div className="text-center">{this.state.message}</div>
                </div>
            </div>
        )
    }
}

export default Logout;