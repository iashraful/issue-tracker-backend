import React, {Component} from "react";
import BasicStore from "../../stores/basic-store";
import {Link} from "react-router-dom";
import IssueConversationView from "./IssueConversationView";

class IssueDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issueId: this.props.match.params.id,
            issue: "",
            notFound: false,
            unAuth: false,
            loading: true,
            historyCollapse: false,
            showDiffButtonText: "Show",
            selectedHistory: "",
        };
        this.collapseHistory = this.collapseHistory.bind(this);
        this.closeIssue = this.closeIssue.bind(this)
    }

    collapseHistory(history) {
        if (!this.state.historyCollapse) {
            this.setState({selectedHistory: history, historyCollapse: true});
        }
        else {
            this.setState({historyCollapse: false});
        }

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
            this.setState({loading: false, issue: data});
        }).catch((err) => {
            console.log(err);
        });
    }

    closeIssue() {
        let isConfirmed = window.confirm("Are you sure to close the issue?");
        if (isConfirmed) {
            const url = BasicStore.makeUrl('api/v1/pms/close-issues/');
            const postBody = JSON.stringify({
                issues: [this.state.issueId],
                issue_close: true
            });
            const payload = {
                method: 'POST',
                headers: BasicStore.headers,
                body: postBody
            };
            fetch(url, payload).then((response) => {
                if (response.status === 401) {
                    this.setState({unAuth: true});
                }
                return response.json();
            }).then((data) => {
                // set loading false for stop loading feature
                window.location = "#/issues";
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    componentWillMount() {
        this.getDetails();
    }

    render() {
        let HistoryModal = "";
        if (this.state.issue) {
            const historyDiff = this.state.historyCollapse ? 'd-block' : 'd-none';
            if (this.state.historyCollapse) {
                HistoryModal = (
                    <div className="modal fade" id="myModal"
                         role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal"
                                            onClick={(e) => this.setState({historyCollapse: false})}>
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <h4 className="modal-title text-truncate p-l-r-1" id="myModalLabel">
                                        {this.state.selectedHistory.comment}
                                    </h4>
                                </div>
                                <div className="modal-body">
                                    <div className="container-fluid">
                                        <div className={historyDiff + 'row'} style={{backgroundColor: 'white'}}>
                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                <strong>Old Assignee:</strong>
                                                <span style={{paddingLeft: '10px'}}>
                                                    {this.state.selectedHistory.old_assignee.name}
                                                </span>
                                                <br/>
                                                <strong>New Assignee:</strong>
                                                <span style={{paddingLeft: '10px'}}>
                                                    {this.state.selectedHistory.new_assignee.name}
                                                </span>
                                            </div>
                                            <hr/>
                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                <strong>Progress Before:</strong>
                                                <span style={{paddingLeft: '10px'}}>
                                                    {this.state.selectedHistory.old_progress} %
                                                </span>
                                                <br/>
                                                <strong>Progress After:</strong>
                                                <span style={{paddingLeft: '10px'}}>
                                                    {this.state.selectedHistory.new_progress} %
                                                </span>
                                            </div>
                                            <hr/>
                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                <strong>Old Description</strong>
                                                <hr className="m-t-0"/>
                                                <p dangerouslySetInnerHTML={{__html: this.state.selectedHistory.old_description}}/>
                                            </div>
                                            <div className="col-md-12 col-sm-12 col-xs-12">
                                                <strong>New Description</strong>
                                                <hr className="m-t-0"/>
                                                <p dangerouslySetInnerHTML={{__html: this.state.selectedHistory.new_description}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" data-dismiss="modal"
                                            onClick={(e) => this.setState({historyCollapse: false})}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        const assigned_to = this.state.issue.assigned_to ? this.state.issue.assigned_to.name : "N/A";
        if (this.state.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        const adminVisible = BasicStore.userRole === BasicStore.userRoleEnum.admin ? '' : 'd-none ';

        return (
            <div className="container-fluid">
                {/* Action View */}
                <div className="action-view">
                    <span className="issue-title">#{this.state.issue.id}</span>
                    <span className="action-buttons">
                        <button
                            data-toggle="modal" data-target="#conversationModal"
                            className="btn btn-primary link-button">
                            Conversation
                        </button>
                        <Link
                            className="btn btn-success link-button"
                            to={BasicStore.urlPaths.issues + '/' + this.state.issueId + BasicStore.urlPaths.edit}
                        >Edit
                        </Link>
                        <button
                            className={adminVisible + "btn btn-danger link-button"}
                            onClick={this.closeIssue.bind(this)}>
                            Close
                        </button>
                    </span>
                </div>

                {/* Issue Body */}
                <div className="issue-details jumbotron">
                    <p className="issue-title">{this.state.issue.title}</p>
                    <span className="added-by">Added by,&nbsp;
                        <Link
                            to={BasicStore.urlPaths.profiles + '/' + this.state.issue.author_id}>{this.state.issue.author}</Link>
                    </span>

                    <div className="row p-t-b-1rem">
                        <div className="col-md-6 col-sm-12">
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="key-view">Status</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="value-view">{BasicStore.issueStatusEnum[this.state.issue.status]}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="key-view">Tracker</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="value-view">{BasicStore.issueTrackerEnum[this.state.issue.tracker]}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="key-view">Priority</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="value-view">{BasicStore.issuePriorityEnum[this.state.issue.priority]}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="key-view">Start Date</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="value-view">{this.state.issue.created_at}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="key-view">Due Date</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="value-view">{this.state.issue.due_date}</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="key-view">Assigned to</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="value-view">
                                        <Link to={BasicStore.urlPaths.profiles + '/' + this.state.issue.assigned_to.id}>
                                            {assigned_to}
                                        </Link>
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <p className="key-view">Progress</p>
                                </div>
                                <div className="col-md-4">
                                    <p className="value-view">{this.state.issue.progress} %</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="b-t"/>
                    {/* Issue Description */}
                    <div className="row p-3">
                        <h5 className="w-100 f-700">Description</h5>
                        <p className="issue-desc" dangerouslySetInnerHTML={{__html: this.state.issue.description}}/>
                    </div>
                    <div className="b-t"/>
                    {/* History Section */}
                    <div className="row p-3">
                        <h5 className="w-100 f-700">History</h5>
                        <div className="col-md-12 col-sm-12" >
                            <ol>
                                {
                                    this.state.issue.history.map(hh =>
                                        <li key={hh.id} style={{paddingBottom: '1rem'}}>
                                            {hh.comment} at
                                            <mark>{hh.created_at}</mark>
                                            <button
                                                data-toggle="modal" data-target="#myModal"
                                                className="btn btn-info btn-xs p-l-r-1 m-l-1"
                                                onClick={this.collapseHistory.bind(this, hh)}>
                                                {this.state.showDiffButtonText}
                                            </button>
                                        </li>
                                    )
                                }
                            </ol>
                        </div>
                        {HistoryModal}
                        {/* Show Conversation modal */}
                        <div className="modal fade" id="conversationModal"
                             role="dialog" aria-labelledby="conversationModalLabel" aria-hidden="true">
                            <IssueConversationView issueId={this.state.issueId}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default IssueDetails;