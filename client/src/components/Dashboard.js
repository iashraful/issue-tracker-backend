import React, {Component} from 'react';
import NoAccess from "./utility/NoAccess";
import BasicStore from '../stores/basic-store';
import {Link} from 'react-router-dom';
import IssueTableView from "./issues/IssueTableView";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayClass: 'd-block',
            loading: true,
            statusCode: "",
            issuesAssignedToMe: [],
            issuesReportedByMe: []
        };
        this.contentVisibility.bind(this);
    }

    contentVisibility(val) {
        if(this.state.statusCode === 403) {
            this.setState({displayClass: 'd-none'});
        } else {
            this.setState({displayClass: val});
        }
    }

    getIssues(params, flag) {
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
            if (flag === "AssignedToMe")
                this.setState({loading: false, issuesAssignedToMe: data.results});
            if (flag === "ReportedByMe")
                this.setState({loading: false, issuesReportedByMe: data.results});

        }).catch((err) => {
            console.log(err);
        });
    }

    componentWillMount() {
        const userFilter = 1;
        const myReported = 1;
        let ReportedParams = "filter_reported=" + myReported;
        let assignedParams = "filter_me=" + userFilter;
        this.getIssues(assignedParams, "AssignedToMe");
        this.getIssues(ReportedParams, "ReportedByMe");
    }

    render() {
        let mainContentClass = 'container-fluid ';
        mainContentClass += this.state.displayClass;

        return (
            <div>
                <NoAccess displayCSS={this.contentVisibility.bind(this)}/>
                <div className={mainContentClass}>
                    <h1 className="text-center">
                        Welcome back
                        <Link
                            className="p-l-r-1"
                            to={BasicStore.urlPaths.profiles + '/' + BasicStore.userId}>
                            {BasicStore.userName}
                        </Link>
                    </h1>
                    <section id="issues-assigned-to-user">
                        <h3>Issues Assigned to You</h3>
                        <hr className="m-t-0"/>
                        <IssueTableView
                            style={{paddingTop: '1rem'}}
                            issues={this.state.issuesAssignedToMe}
                            loading={this.state.loading}
                        />
                    </section>

                    <section id="issues-assigned-to-user">
                        <h3>Issues Reported by You</h3>
                        <hr className="m-t-0"/>
                        <IssueTableView
                            style={{paddingTop: '1rem'}}
                            issues={this.state.issuesReportedByMe}
                            loading={this.state.loading}
                        />
                    </section>
                </div>
            </div>

        )
    }
}

export default Dashboard;