import React, {Component} from "react";
import {Link} from "react-router-dom";
import BasicStore from "../../stores/basic-store";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


class IssueTableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issues: []
        }
    }

    render() {
        // console.log(this)
        if (this.props.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        if (this.props.issues.length === 0) {
            return (
                <div className="text-center">
                    <p>No issues found.</p>
                </div>
            )
        }

        return (
            <div>
                <ReactTable
                    noDataText="No Issues Found!!"
                    data={this.props.issues}
                    columns={[
                        {
                            columns: [
                                {
                                    Header: "#",
                                    accessor: "id",
                                    width: 40
                                },
                                {
                                    Header: "Title",
                                    id: "title",
                                    accessor: (issue => {
                                        return (
                                            <Link
                                                to={BasicStore.urlPaths.issues + '/' + issue.id}>
                                                {issue.title}
                                            </Link>
                                        )
                                    }),
                                    width: 230
                                },
                                {
                                    Header: "Project Name",
                                    id: "project_name",
                                    accessor: (issue => {
                                        return (
                                            <Link
                                                to={BasicStore.urlPaths.projects + '/' + issue.project.slug}>
                                                {issue.project.name}
                                            </Link>
                                        )
                                    }),
                                    width: 180
                                },
                                {
                                    Header: "Author",
                                    id: "author",
                                    accessor: (issue => {
                                        return (
                                        <Link
                                            to={BasicStore.urlPaths.profiles + '/' + issue.author_id}>
                                            {issue.author}
                                        </Link>
                                        )
                                    }),
                                },
                                {
                                    Header: "Due Date",
                                    accessor: "due_date"
                                },
                                {
                                    Header: "Assigned to",
                                    id: "assigned_to.name",
                                    accessor: (issue => {
                                        return (
                                            <Link
                                                to={BasicStore.urlPaths.profiles + '/' + issue.assigned_to.id}>
                                                {issue.assigned_to.name}
                                            </Link>
                                        )
                                    })
                                },
                                {
                                    Header: "Progress (%)",
                                    accessor: "progress"
                                },
                                {
                                    Header: "Status",
                                    id: "status",
                                    accessor: issue => BasicStore.issueStatusEnum[issue.status]
                                },
                                {
                                    Header: "Priority",
                                    id: "priority",
                                    accessor: issue => BasicStore.issuePriorityEnum[issue.priority]
                                },
                                {
                                    Header: "Tracker",
                                    id: 'tracker',
                                    accessor: issue => BasicStore.issueTrackerEnum[issue.tracker]
                                },
                                {
                                    Header: "Created at",
                                    accessor: "created_at"
                                },
                                {
                                    Header: "Updated at",
                                    accessor: "updated_at"
                                },

                            ]
                        },
                    ]}
                    defaultPageSize={this.props.defaultPageSize > 0 ? this.props.defaultPageSize : 5}
                    className="-striped -highlight"
                />
            </div>
        )
    }
}

export default IssueTableView;