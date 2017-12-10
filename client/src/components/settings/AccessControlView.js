import React, {Component} from 'react';
import BasicStore from '../../stores/basic-store';
import Select from 'react-select';


class AccessControlView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRole: BasicStore.userRole,
            accessRole: '',
            accessUrl: '',
            accessPermissions: '',
            roleSelectData: [],
            accessViewSelectData: [],
            permissionsSelectData: [],
            allUrls: [],
            allRoles: [],
            allPermissions: [],
            loading: true,
            saveButtonLoading: false,
            success: false,
            permissionError: false,
        };
        this.onRoleSelect = this.onRoleSelect.bind(this);
        this.onAccessViewSelect = this.onAccessViewSelect.bind(this);
        this.onPermissionsSelect = this.onPermissionsSelect.bind(this);
        this.handleAccessControl = this.handleAccessControl.bind(this);
    }

    getAllUrls() {
        const url = BasicStore.makeUrl('api/v1/role-manager/all-urls/');
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false});
            if (data.url_names) {
                this.setState({allUrls: data.url_names});
                let d = [];
                data.url_names.map(url_name => {
                    return d.push({label: url_name, value: url_name});
                });
                this.setState({accessViewSelectData: d});
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    getAllRoles() {
        const url = BasicStore.makeUrl('api/v1/role-manager/roles/');
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            if(response.status === 403 || response.status === 401)
                this.setState({permissionError: true});
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false});
            if (data) {
                this.setState({allRoles: data.results});
                let d = [];
                data.results.map(role => {
                    return d.push({label: role.name, value: role.id});
                });
                this.setState({roleSelectData: d});
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    getAllPermissions() {
        const url = BasicStore.makeUrl('api/v1/role-manager/permissions/');
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false});
            if (data) {
                this.setState({allPermissions: data.results});
                let d = [];
                data.results.map(pp => {
                    return d.push({label: pp.access_type_name, value: pp.id});
                });
                this.setState({permissionsSelectData: d});
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    onRoleSelect(val) {
        if (val !== null) {
            this.setState({accessRole: val.value});
        } else {
            this.setState({accessRole: ""});
        }
    }

    onAccessViewSelect(val) {
        if (val !== null) {
            this.setState({accessUrl: val.value});
        } else {
            this.setState({accessUrl: ""});
        }
    }

    onPermissionsSelect(val) {
        if (val !== null) {
            let d = [];
            val.map(item => {
                return d.push(item.value)
            });
            this.setState({accessPermissions: d});
        }
        else {
            this.setState({accessPermissions: []});
        }
    }

    componentWillMount() {
        BasicStore.on("change", () => {
            this.setState({userRole: BasicStore.userRole})
        });
        this.getAllUrls();
        this.getAllRoles();
        this.getAllPermissions();
    }

    handleAccessControl(event) {
        this.setState({saveButtonLoading: true});
        const postBody = JSON.stringify({
            role: this.state.accessRole,
            url_name: this.state.accessUrl,
            permissions: this.state.accessPermissions,
        });
        // Clear fields from state
        this.setState({accessRole: "", accessUrl: "", accessPermissions: []});

        // Here will be save API call
        const url = BasicStore.makeUrl('api/v1/role-manager/accesses/');
        const payload = {
            method: 'POST',
            headers: BasicStore.headers,
            body: postBody
        };
        fetch(url, payload).then((response) => {
            if (response.status === 400) {
                this.setState({statusCode: response.status, saveButtonLoading: false});
            }
            if (response.status === 401 || response.status === 403) {
                this.setState({statusCode: response.status, permissionError: true, saveButtonLoading: false});
            }
            if (response.status === 200) {
                this.setState({statusCode: response.status, success: true, saveButtonLoading: false});
            }
            return response.json();
        }).then((data) => {
            if (!this.state.success) {
                this.setState({errorData: data});
            }
            if (this.state.success) {
                this.setState({saveButtonLoading: false, errorData: []});
            }
        }).catch((err) => {
            console.log(err);
        });
        event.preventDefault();
    }

    render() {
        const Update = this.state.saveButtonLoading ? 'd-block' : 'd-none';
        const saveButton = this.state.saveButtonLoading ? 'd-none' : 'd-block';
        const displayClass = this.state.success ? "d-block" : "d-none";
        const notPermitted = this.state.permissionError ? "You don't have any permission to do this." : "";
        let accessControlView = 'card ';
        accessControlView += BasicStore.userRole === BasicStore.userRoleEnum.admin ? 'd-block ' : 'd-none '
        return (
            <div className="col-md-6 col-sm-6">
                <div className={accessControlView}>
                    <div className="card-header">
                        <h3>Set Role wise Permission</h3>
                    </div>
                    <div className={"container " + displayClass}>
                        <p className="alert alert-success text-center">Permission Granted!!</p>
                    </div>
                    <div className="card-body p-2">
                        <form onSubmit={this.handleAccessControl}>
                            <div className="row p-b-15px">
                                <div className="w-50ps p-l-r-15px">
                                    <label>Role</label> <br/>
                                    {/*<span className="text-danger">{this.state.errorData}</span>*/}
                                    <Select
                                        required
                                        name="form-field-name"
                                        value={this.state.accessRole}
                                        options={this.state.roleSelectData}
                                        onChange={this.onRoleSelect}
                                    />
                                </div>
                                <div className="w-50ps p-l-r-15px">
                                    <label>Access View</label> <br/>
                                    {/*<span className="text-danger">{this.state.errorData.url_name}</span>*/}
                                    <Select
                                        required
                                        name="form-field-name"
                                        value={this.state.accessUrl}
                                        options={this.state.accessViewSelectData}
                                        onChange={this.onAccessViewSelect}
                                    />
                                </div>
                            </div>

                            <div className="row p-b-15px">
                                <div className="w-100 p-l-r-15px">
                                    <label>Permissions</label> <br/>
                                    <Select
                                        multi
                                        name="form-field-name"
                                        value={this.state.accessPermissions}
                                        options={this.state.permissionsSelectData}
                                        onChange={this.onPermissionsSelect}
                                    />
                                </div>
                            </div>
                            <p className={"alert-danger text-center"}>{notPermitted}</p>
                            <button className="btn btn-primary pull-right custom-btn-padding">
                                <span className={saveButton}>Save</span>
                                <span className={Update}>Please Wait...
                                    <i className="fa fa-spinner fa-spin"/>
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AccessControlView;