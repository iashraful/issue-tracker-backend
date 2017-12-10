import React, {Component} from 'react';
import BasicStore from '../../stores/basic-store';

class NoAccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "You don't have permission to view this content.",
            isAuth: BasicStore.isAuthentication
        }
    }

    componentWillMount() {
        // Set display none class to main content
        this.props.displayCSS('d-none');
        // Catch `change` event from Store
        BasicStore.on("change", () => {
            this.setState({isAuth: BasicStore.isAuthentication});
        });
        // Check for if authenticated
        if (this.state.isAuth) {
            this.props.displayCSS('d-block');
        }

    }

    render() {
        let permissionErrorClass = this.state.isAuth ? 'd-none' : 'alert alert-danger text-center d-block';
        return (
            <div className="container">
                <div className={permissionErrorClass}>
                    {this.state.message}
                </div>
            </div>
        )
    }
}

export default NoAccess;