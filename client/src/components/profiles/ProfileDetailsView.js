import React, {Component} from "react";
import BasicStore from "../../stores/basic-store";

class ProfileDetailsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            profileId: this.props.match !== undefined ? this.props.match.params.id : this.props.profilePK,
            profile: [],
            notFound: false,
            unAuth: false,
        };
    }

    getDetails() {
        const url = BasicStore.makeUrl('api/v1/core/profiles/' + this.state.profileId + '/');
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            if (response.status === 404) {
                this.setState({notFound: true});
            }
            if (response.status === 401) {
                this.setState({unAuth: true});
            }
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false, profile: data});
        }).catch((err) => {
            console.log(err);
        });
    }

    componentDidMount() {
        this.getDetails();
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        return (
            <div className="container">
                <h1 className="text-center text-capitalize text-danger">{this.state.profile.name}</h1>
                <div className="jumbotron">
                    <div className="row p-10">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <p className="profile-item-bg">Name</p>
                            <p className="profile-item-bg">Role</p>
                            <p className="profile-item-bg">Email</p>
                            <p className="profile-item-bg">Assigned Issues</p>
                            <p className="profile-item-bg">Reported Issues</p>
                            <p className="profile-item-bg">Registered on</p>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <p className="profile-item-bg">{this.state.profile.name}</p>
                            <p className="profile-item-bg">{this.state.profile.role}</p>
                            <p className="profile-item-bg">{this.state.profile.email}</p>
                            <p className="profile-item-bg">{this.state.profile.assigned_issues}</p>
                            <p className="profile-item-bg">{this.state.profile.reported_issues}</p>
                            <p className="profile-item-bg">{this.state.profile.registered_on}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileDetailsView;