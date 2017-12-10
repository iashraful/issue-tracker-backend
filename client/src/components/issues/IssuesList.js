import React, {Component} from 'react';
import BasicStore from '../../stores/basic-store';
import NoAccess from "../utility/NoAccess";
import Select from 'react-select';
import IssueTableView from "./IssueTableView";
import {Link} from "react-router-dom";
import IssueExportToExcelMixin from "./IssueExportToExcelMixin";


class IssuesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            issues: [],
            selectedProject: [],
            projectSelectData: [],
            issueParams: "",
            statusCode: "",
        };
        this.contentVisibility = this.contentVisibility.bind(this);
        this.onProjectSelect = this.onProjectSelect.bind(this);
    }

    contentVisibility(val) {
        if(this.state.statusCode === 403) {
            this.setState({displayClass: 'd-none'});
        } else {
            this.setState({displayClass: val});
        }
    }

    getIssues(params) {
        const url = BasicStore.makeUrl('api/v1/pms/issues/?' + params);
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            if (response.status === 403) {
                this.setState({statusCode: response.status, loading: false});
            }
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false, issues: data.results});
        }).catch((err) => {
            console.log(err);
        });
    }

    componentWillMount() {
        this.getIssues();
        if (BasicStore.projects.length === 0) {
            BasicStore.fetchProjects();
        }

    }

    onProjectSelect(val) {
        if (val !== null) {
            let d = [];
            let str = "";
            val.map(item => {
                d.push(item.value);
                str += item.value + ",";
                return str
            });
            this.setState({selectedProject: d, issueParams: 'project=' + str});
            this.getIssues('project=' + str);
        }
        else {
            this.setState({selectedProject: []});
        }
    }

    render() {
        let mainContentClass = 'container-fluid ';
        mainContentClass += this.state.displayClass;

        return (
            <div className={mainContentClass}>
                <NoAccess displayCSS={this.contentVisibility.bind(this)}/>
                <div>
                    <div className="row p-l-r-15px">
                        <div className="action-view">
                            {/* Action buttons view */}
                            <div className="action-buttons">
                                <Link
                                    className="btn btn-primary link-button pull-right"
                                    to={BasicStore.urlPaths.issues + BasicStore.urlPaths.create}> Create
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row p-l-r-15px" style={{marginBottom: '-40px'}}>
                        {/* Here will be some filters */}
                        <div style={{paddingTop: '1rem', paddingBottom: '1rem'}} className="w-100">
                            <Select
                                className="w-33ps pull-right"
                                multi={true}
                                name="form-field-name"
                                value={this.state.selectedProject}
                                options={BasicStore.projectsSelectFormat}
                                onChange={this.onProjectSelect}
                            />
                        </div>
                        <IssueExportToExcelMixin issues={this.state.issues}/>
                    </div>
                    {/* Here will be table view for issues List*/}
                    <IssueTableView
                        style={{paddingTop: '1rem'}}
                        issues={this.state.issues}
                        loading={this.state.loading}
                        defaultPageSize={10}
                    />
                </div>
            </div>
        )
    }

}

export default IssuesList;