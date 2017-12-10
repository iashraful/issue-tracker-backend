import React from "react";
import DailyReport from "./DailyReport";
import {Link} from "react-router-dom";
import BasicStore from "../../stores/basic-store";
import ReactTable from "react-table";
import "react-table/react-table.css";


class ProjectWiseDailyReport extends DailyReport {
    render() {
        return (
            <div>
                <h2 className="text-center pt-4 pb-4">Daily Report (Project wise data)</h2>
                <ReactTable
                    noDataText="No Data Found!!"
                    data={this.state.reportData['project_wise']}
                    columns={[
                        {
                            columns: [
                                {
                                    Header: "Project",
                                    id: "project",
                                    accessor: (project => {
                                        return (
                                            <Link
                                                to={BasicStore.urlPaths.projects + '/' + project.project_slug}>
                                                {project.project}
                                            </Link>
                                        )
                                    }),
                                },
                                {
                                    Header: "Total Issues",
                                    id: "total_issues",
                                    accessor: "total_issues",
                                },
                                {
                                    Header: "Today Updated",
                                    id: "today_updated",
                                    accessor: (log => {
                                        return log.today_updated  + " Issue(s)"
                                    }),
                                },
                                {
                                    Header: "Today Created",
                                    id: "today_created",
                                    accessor: (log => {
                                        return log.today_created  + " Issue(s)"
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

export default ProjectWiseDailyReport;
