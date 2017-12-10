import React, {Component} from 'react';
import BasicStore from '../../stores/basic-store';
import {NavLink} from 'react-router-dom';

class NavLinkCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: BasicStore.isAuthentication
        }
    }

    componentWillMount() {
        BasicStore.on("change", () => {
            this.setState({isAuth: BasicStore.isAuthentication})
        })
    }

    render() {
        let hideContentClassNames = this.props.cssClass + ' ';
        // TODO: Will try to remove this hardcoded lines
        if (this.props.text === 'Login' && this.props.url === '/login' && this.state.isAuth) {
            hideContentClassNames += 'd-none';
        }
        if (this.props.text === 'Register' && this.props.url === '/register' && BasicStore.userRole !== BasicStore.userRoleEnum.admin) {
            hideContentClassNames += 'd-none';
        }
        if (!this.state.isAuth) {
            hideContentClassNames += this.props.auth ? 'd-none' : 'd-block';
        }
        return (
            <NavLink
                className={hideContentClassNames}
                activeClassName={this.props.activeClass}
                to={this.props.url}>
                {this.props.text}
            </NavLink>
        )
    }
}

export default NavLinkCustom;