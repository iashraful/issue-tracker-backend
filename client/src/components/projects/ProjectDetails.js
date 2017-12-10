import React, {Component} from "react";
import {Redirect} from 'react-router-dom';

import BasicStore from '../../stores/basic-store';
import IssueTableView from "../issues/IssueTableView";


class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            projectSlug: this.props.match.params.slug,
            project: "",
            notFound: false,
            unAuth: false,
            statusCode: 0,
            issues: [],
        };
    }

    getDetails() {
        const url = BasicStore.makeUrl('api/v1/pms/projects/' + this.state.projectSlug + '/');
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
            this.setState({loading: false, project: data});
            this.getIssues();
        }).catch((err) => {
            console.log(err);
        });
    }

    getIssues() {
        const url = BasicStore.makeUrl('api/v1/pms/issues/?project=' + this.state.project.id);
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
        // Set projectSlug to state
        this.setState({projectSlug: this.props.match.params.slug});
        this.getDetails();
    }

    render() {
        if (this.state.notFound || this.state.unAuth) {
            return <Redirect to={BasicStore.urlPaths.notFound}/>
        }

        if (this.state.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        return (
            <div className="project-details container-fluid">
                <div className="project-title">
                    <span>{this.state.project.name}</span> <br/>
                    <a href={this.state.project.website} target="_blank">{this.state.project.website}</a>
                </div>
                {/* This is inline navigation bar */}
                <div className="float-right">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" href="#overview" role="tab" data-toggle="tab">Overview</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#issue-tab" role="tab" data-toggle="tab">Issues</a>
                        </li>
                    </ul>
                </div>
                <div className="jumbotron">
                    <div className="tab-content mt-5">
                        <div role="tabpanel" className="tab-pane active" id="overview">
                            <h4>Description</h4>
                            <p dangerouslySetInnerHTML={{ __html: this.state.project.description }}/>
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="issue-tab">
                            <IssueTableView
                                style={{paddingTop: '1rem'}}
                                issues={this.state.issues}
                                loading={this.state.loading}
                                defaultPageSize={5}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProjectDetails;