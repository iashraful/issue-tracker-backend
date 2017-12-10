import React, {Component} from "react";
import BasicStore from "../../stores/basic-store";
import Select from 'react-select';
import RichTextEditor from 'react-rte';
import 'react-select/dist/react-select.css';

class IssueCreateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //UI related state
            loading: false,
            projectSelectData: [],
            profileSelectData: [],
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
        this.handleSaveIssue.bind(this);
        this.onProjectSelect = this.onProjectSelect.bind(this);
        this.onOpenProjectSelect = this.onOpenProjectSelect.bind(this);
        this.onProfileSelect = this.onProfileSelect.bind(this);
        this.onOpenProfileSelect = this.onOpenProfileSelect.bind(this);
        this.onWatchersSelect = this.onWatchersSelect.bind(this);
    }

    componentWillMount() {
        // If projects are empty at the store then it will call the API again
        if(BasicStore.projects.length === 0) {
            BasicStore.fetchProjects();
        }
        // If profiles are empty at the store then it will call the API again
        if(BasicStore.profiles.length === 0) {
            BasicStore.fetchProfiles();
        }
    }

    onOpenProjectSelect(e) {
        const projects = BasicStore.projects;
        let data = [];
        projects.map(pr => {
            return data.push({label: pr.name, value: pr.id});
        });
        this.setState({projectSelectData: data});
        // e.preventDefault();
    }

    onProjectSelect(val) {
        if(val !== null) {
            this.setState({project: val.value});
        } else{
            this.setState({project: ""});
        }
    }

    onOpenProfileSelect(e) {
        const profiles = BasicStore.profiles;
        let data = [];
        profiles.map(pr => {
            return data.push({label: pr.name, value: pr.id});
        });
        this.setState({profileSelectData: data});
        // e.preventDefault();
    }

    onProfileSelect(val) {
        if(val !== null) {
            this.setState({assigned_to: val.value});
        } else{
            this.setState({assigned_to: ""});
        }
    }

    onWatchersSelect(val) {
        if(val !== null) {
            let d = [];
            val.map(item => {
                return d.push(item.value)
            });
            this.setState({watchers: d});
        }
        else{
            this.setState({watchers: []});
        }
    }

    handleSaveIssue(event) {
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
            due_date: this.state.due_date,
            progress: this.state.progress
        });

        // Here will be save API call
        const url = BasicStore.makeUrl('api/v1/pms/issues/');
        const payload = {
            method: 'POST',
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
            if (response.status === 201) {
                this.setState({statusCode: response.status, success: true, loading: false});
            }
            return response.json();
        }).then((data) => {
            if(!this.state.success) {
                this.setState({errorData: data});
            }
            if(this.state.success) {
                this.setState({loading: false, issuePostResponse: data, errorData: []});
            }
        }).catch((err) => {
            console.log(err);
        });
        event.preventDefault();
    }

    render() {
        let cssClasses = "form-control ";
        let successMgs = "text-center alert alert-success ";
        const savingButton = this.state.loading ? 'd-block' : 'd-none';
        const saveButton = this.state.loading ? 'd-none' : 'd-block';
        successMgs += this.state.success ? "d-block" : "d-none";

        if(this.state.success) {
            setTimeout(function() {
                window.location.assign("/#" + BasicStore.urlPaths.issues);
            }, 3000);
        }

        return (
            <div className="container">
                <h2 className="text-center text-danger">Create New Issue</h2>
                <hr/>
                <h4 className={successMgs}>Issue created successfully.</h4>
                <form onSubmit={this.handleSaveIssue.bind(this)}>
                    <fieldset className="p-l-r-20p">
                        <p
                        className={this.state.errorData.non_fields_errors !== undefined ? 'alert alert-danger' : ''}>
                        {this.state.errorData.non_fields_errors}
                        </p>
                        <div className="form-group">
                            <label>Title</label> <br/>
                            <span className="text-danger">{this.state.errorData.title}</span>
                            <input className={cssClasses} placeholder="Name of Project" type="text"
                                   onChange={(event) => this.setState({title: event.target.value})}
                                   value={this.state.title}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label> <br/>
                            <span className="text-danger">{this.state.errorData.description}</span>
                            <RichTextEditor
                                className="h-250px"
                                value={this.state.description}
                                onChange={(val) => this.setState({description: val})}
                            />
                        </div>

                        <div className="row p-b-15px">
                            <div className="w-50ps p-l-r-15px">
                                <label>Project</label> <br/>
                                <span className="text-danger">{this.state.errorData.project}</span>
                                <Select
                                    required
                                    name="form-field-name"
                                    value={this.state.project}
                                    options={this.state.projectSelectData}
                                    onChange={this.onProjectSelect}
                                    onOpen={this.onOpenProjectSelect}
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
                                    onOpen={this.onOpenProfileSelect}
                                />
                            </div>
                        </div>

                        <div className="row p-b-15px">
                            <div className="w-50ps p-l-r-15px">
                                <label>Watchers</label> <br/>
                                <Select
                                    multi
                                    name="form-field-name"
                                    value={this.state.watchers}
                                    options={this.state.profileSelectData}
                                    onChange={this.onWatchersSelect}
                                    onOpen={this.onOpenProfileSelect}
                                />
                            </div>

                            <div className="w-50ps p-l-r-15px">
                                <label>Due Date</label>
                                <input
                                    className="form-control p-1" type="date"
                                    onChange={(e) => this.setState({due_date: e.target.value})}
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
                                    onChange={(val) => this.setState({status: val ? val.value:""})}
                                />
                            </div>

                            <div className="w-33ps p-l-r-15px">
                                <label>Tracker</label> <br/>
                                <Select
                                    name="form-field-name"
                                    value={this.state.tracker}
                                    options={BasicStore.issueTrackerEnumSelectData}
                                    onChange={(val) => this.setState({tracker: val ? val.value:""})}
                                />
                            </div>

                            <div className="w-33ps p-l-r-15px">
                                <label>Priority</label> <br/>
                                <Select
                                    name="form-field-name"
                                    value={this.state.priority}
                                    options={BasicStore.issuePriorityEnumSelectData}
                                    onChange={(val) => this.setState({priority: val ? val.value:""})}
                                />
                            </div>
                        </div>

                        <div className="row p-b-15px">
                            <div className="w-33ps p-l-r-15px">
                                <label>Progress</label> <br/>
                                <input
                                    placeholder="Enter value in (%)" type="number" className="form-control"
                                    onChange={(e) => this.setState({progress: e.target.value})}
                                    value={this.state.progress}
                                />
                            </div>
                        </div>

                        <button className="btn btn-primary pull-right custom-btn-padding">
                            <span className={saveButton}>Save</span>
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

export default IssueCreateView;