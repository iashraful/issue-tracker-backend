import React, {Component} from "react";
import {Link} from "react-router-dom";

class LogListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    render() {
        if (this.props.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        if (this.props.logs.length === 0) {
            return (
                <div className="text-center">
                    <p>No data found.</p>
                </div>
            )
        }

        const tableRowView = this.props.logs.map(function (lg) {
            let tableRowClass = '';

            return(
                <tr className={tableRowClass} key={lg.id}>
                    <th scope="row">{lg.profile.name}</th>
                    <td title={lg.operational_text}>
                        <Link to={lg.link}>{lg.operational_text}</Link>
                    </td>
                    <td>{lg.action.toLowerCase()}</td>
                    <td>{lg.created_at}</td>
                </tr>
            )
        });

        // Default return
        return (
            <div>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Action Done by</th>
                        <th>Action Message</th>
                        <th>Action Type</th>
                        <th>Action Time</th>
                    </tr>
                    </thead>
                    <tbody>
                        {tableRowView}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default LogListView;