import React from "react";
import DailyReport from "./DailyReport";
import {Link} from "react-router-dom";
import BasicStore from "../../stores/basic-store";
import ReactTable from "react-table";
import "react-table/react-table.css";


class UserWiseDailyReport extends DailyReport {
    render() {
        return (
            <div>
                <h2 className="text-center pt-4 pb-4">Daily Report (User wise data)</h2>
                <ReactTable
                    noDataText="No Data Found!!"
                    data={this.state.reportData['user_wise']}
                    columns={[
                        {
                            columns: [
                                {
                                    Header: "User",
                                    id: "updated_by_id",
                                    accessor: (log => {
                                        return (
                                            <Link
                                                to={BasicStore.urlPaths.profiles + '/' + log.updated_by_id}>
                                                {log.updated_by_name}
                                            </Link>
                                        )
                                    }),
                                },
                                {
                                    Header: "Project",
                                    id: "project_name",
                                    accessor: (project => {
                                        return (
                                            <Link
                                                to={BasicStore.urlPaths.projects + '/' + project.project_slug}>
                                                {project.project_name}
                                            </Link>
                                        )
                                    }),
                                },
                                {
                                    Header: "Done (%)",
                                    id: "total_progress",
                                    accessor: (log => {
                                        return log.total_progress  + " %"
                                    }),
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

export default UserWiseDailyReport;
