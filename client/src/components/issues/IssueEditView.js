import React, {Component} from "react";
import BasicStore from "../../stores/basic-store";
import Select from 'react-select';
import RichTextEditor from 'react-rte';
import 'react-select/dist/react-select.css';


class IssueEditView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issueId: this.props.match.params.id,
            // UI related state
            loading: true,
            projectSelectData: BasicStore.projectsSelectFormat,
            profileSelectData: BasicStore.profilesSelectFormat,
            // Issue states
            title: "",
            project: "",
            assigned_to: "",
            watchers: [],
            description: RichTextEditor.createEmptyValue(),
            documents: "",
            status: BasicStore.issueStatusEnum.newIssue,
            priority: BasicStore.issuePriorityEnum.low,
            tracker: BasicStore.issueTrackerEnum.bug,
            progress: 0,
            due_date: "",
            // API Response state
            issuePostResponse: "",
            statusCode: 400,
            // Error Response
            success: false,
            errorData: [],
        };
        this.handleIssueUpdate.bind(this);
        this.onProjectSelect = this.onProjectSelect.bind(this);
        this.onProfileSelect = this.onProfileSelect.bind(this);
        this.onWatchersSelect = this.onWatchersSelect.bind(this);
    }

    getDetails() {
        const url = BasicStore.makeUrl('api/v1/pms/issues/' + this.state.issueId + '/');
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
            this.setState({
                loading: false, title: data.title, project: data.project.id,
                description: RichTextEditor.createValueFromString(data.description, 'html'),
                assigned_to: data.assigned_to.id, status: data.status, priority: data.priority,
                progress: data.progress, tracker: data.tracker
            });
            data.watchers.map(w => {
                return this.state.watchers.push(w.id);
            });
            console.log(this.state.project);
        }).catch((err) => {
            console.log(err);
        });
    }

    componentWillMount() {
        this.getDetails();
        // If projects are empty at the store then it will call the API again
        if (BasicStore.projects.length === 0) {
            BasicStore.fetchProjects();
        }
        // If profiles are empty at the store then it will call the API again
        if (BasicStore.profiles.length === 0) {
            BasicStore.fetchProfiles();
        }
    }

    onProjectSelect(val) {
        if (val !== null) {
            this.setState({project: val.value});
        } else {
            this.setState({project: ""});
        }
    }

    onProfileSelect(val) {
        if (val !== null) {
            this.setState({assigned_to: val.value});
        } else {
            this.setState({assigned_to: ""});
        }
    }

    onWatchersSelect(val) {
        if (val !== null) {
            let d = [];
            val.map(item => {
                return d.push(item.value)
            });
            this.setState({watchers: d});
        }
        else {
            this.setState({watchers: []});
        }
    }

    handleIssueUpdate(event) {
        this.setState({loading: true});
        const postBody = JSON.stringify({
            title: this.state.title,
            description: this.state.description.toString('html'),
            project: this.state.project,
            assigned_to: this.state.assigned_to,
            watchers: this.state.watchers,
            status: this.state.status,
            tracker: this.state.tracker,
            priority: this.state.priority,
            progress: this.state.progress
        });

        // Here will be save API call
        const url = BasicStore.makeUrl('api/v1/pms/issues/' + this.state.issueId + '/');
        const payload = {
            method: 'PUT',
            headers: BasicStore.headers,
            body: postBody
        };
        fetch(url, payload).then((response) => {
            if (response.status === 400) {
                this.setState({statusCode: response.status, loading: false});
            }
            if (response.status === 401) {
                this.setState({statusCode: response.status, loading: false});
            }
            if (response.status === 403) {
                this.setState({statusCode: response.status, loading: false});
            }
            if (response.status === 200) {
                this.setState({statusCode: response.status, success: true, loading: false});
            }
            return response.json();
        }).then((data) => {
            if (!this.state.success) {
                this.setState({errorData: data});
            }
            if (this.state.success) {
                this.setState({loading: false, issuePostResponse: data, errorData: []});
            }
        }).catch((err) => {
            console.log(err);
        });
        event.preventDefault();
    }

    render() {
        // User Role basis hide/show
        const roleArray = [
            BasicStore.userRoleEnum.admin, BasicStore.userRoleEnum.manager, BasicStore.userRoleEnum.tester
        ];
        let showForTopUser = roleArray.indexOf(BasicStore.userRole) !== -1 ? 'd-block' : 'd-none';
        /*
            TOP LEVEL USERS:
            1. Admin
            2. Manager
            3. Tester
         */

        let cssClasses = "form-control ";
        let successMgs = "text-center alert alert-success ";
        const savingButton = this.state.loading ? 'd-block' : 'd-none';
        const saveButton = this.state.loading ? 'd-none' : 'd-block';
        successMgs += this.state.success ? "d-block" : "d-none";

        if (this.state.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        if(this.state.statusCode === 403) {
            return (
                <div className="container">
                    <p className="alert alert-danger text-center">
                        You don't have permission to edit this content.
                    </p>
                </div>
            )
        }

        if (this.state.success) {
            setTimeout(function () {
                window.location.assign("/#" + BasicStore.urlPaths.issues + '/' + this.state.issueId);
            }.bind(this), 3000);
        }

        return (
            <div className="container">
                <h2 className="text-center text-danger">Update the Issue</h2>
                <hr/>
                <h4 className={successMgs}>Issue updated successfully.</h4>
                <form onSubmit={this.handleIssueUpdate.bind(this)}>
                    <fieldset className="p-l-r-20p">
                        <p
                            className={this.state.errorData.non_fields_errors !== undefined ? 'alert alert-danger' : ''}>
                            {this.state.errorData.non_fields_errors}
                        </p>
                        <div className={showForTopUser + " form-group"}>
                            <label>Title</label> <br/>
                            <span className="text-danger">{this.state.errorData.title}</span>
                            <input className={cssClasses} placeholder="Name of Project" type="text"
                                   onChange={(event) => this.setState({title: event.target.value})}
                                   value={this.state.title}
                            />
                        </div>
                        <div className={showForTopUser + " form-group"}>
                            <label>Description</label> <br/>
                            <span className="text-danger">{this.state.errorData.description}</span>
                            <RichTextEditor
                                className="h-250px"
                                value={this.state.description}
                                onChange={(val) => this.setState({description: val})}
                            />
                        </div>

                        <div className="row p-b-15px">
                            <div className={showForTopUser + " w-50ps p-l-r-15px"}>
                                <label>Project</label> <br/>
                                <span className="text-danger">{this.state.errorData.project}</span>
                                <Select
                                    required
                                    name="form-field-name"
                                    value={this.state.project}
                                    options={this.state.projectSelectData}
                                    onChange={this.onProjectSelect}
                                />
                            </div>

                            <div className="w-50ps p-l-r-15px">
                                <label>Assigned To</label> <br/>
                                <span className="text-danger">{this.state.errorData.assigned_to}</span>
                                <Select
                                    required
                                    name="form-field-name"
                                    value={this.state.assigned_to}
                                    options={this.state.profileSelectData}
                                    onChange={this.onProfileSelect}
                                />
                            </div>
                        </div>

                        <div className="row p-b-15px">
                            <div className={showForTopUser + " w-50ps p-l-r-15px"}>
                                <label>Watchers</label> <br/>
                                <Select
                                    multi
                                    name="form-field-name"
                                    value={this.state.watchers}
                                    options={this.state.profileSelectData}
                                    onChange={this.onWatchersSelect}
                                />
                            </div>
                            <div className="w-50ps p-l-r-15px">
                                <label>Progress</label> <br/>
                                <input
                                    placeholder="Enter value in (%)" type="number" className="form-control"
                                    onChange={(e) => this.setState({progress: e.target.value})}
                                    value={this.state.progress}
                                />
                            </div>

                        </div>

                        <div className="row p-b-15px">
                            <div className="w-33ps p-l-r-15px">
                                <label>Status</label> <br/>
                                <Select
                                    name="form-field-name"
                                    value={this.state.status}
                                    options={BasicStore.issueStatusEnumSelectData}
                                    onChange={(val) => this.setState({status: val ? val.value : ""})}
                                />
                            </div>

                            <div className="w-33ps p-l-r-15px">
                                <label>Tracker</label> <br/>
                                <Select
                                    name="form-field-name"
                                    value={this.state.tracker}
                                    options={BasicStore.issueTrackerEnumSelectData}
                                    onChange={(val) => this.setState({tracker: val ? val.value : ""})}
                                />
                            </div>

                            <div className="w-33ps p-l-r-15px">
                                <label>Priority</label> <br/>
                                <Select
                                    name="form-field-name"
                                    value={this.state.priority}
                                    options={BasicStore.issuePriorityEnumSelectData}
                                    onChange={(val) => this.setState({priority: val ? val.value : ""})}
                                />
                            </div>
                        </div>


                        <button className="btn btn-primary pull-right custom-btn-padding">
                            <span className={saveButton}>Update</span>
                            <span className={savingButton}>Please Wait...
                                <i className="fa fa-spinner fa-spin"/>
                            </span>
                        </button>
                    </fieldset>

                </form>
            </div>
        )
    }
}

export default IssueEditView;