import React, {Component} from "react";
import BasicStore from "../../stores/basic-store";
import LogListView from "./LogListView";
import {withRouter} from "react-router-dom";
import qs from "query-string";
import ActivityLogExportMixin from "./ActivityLogExportMixin";

class ActivityLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            logs: [],
            q: "",
        };
        this.searchLog = this.searchLog.bind(this);
    }

    searchLog(e) {
        // Set loading True
        this.setState({loading: true});
        const val = e.target.value;
        this.setState({q: val});
        this.props.history.push("?q=" + val);
        // Call API when change
        this.getActivityLog();
        e.preventDefault();
    }

    getActivityLog() {
        const parsed = qs.parse(this.props.location.search);
        let q = parsed.q !== undefined ? parsed.q:"";
        const url = BasicStore.makeUrl('api/v1/pms/activity-logs/?q=' + q);
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false, logs: data.results});
        }).catch((err) => {
            console.log(err);
        });
    }

    componentWillMount() {
        this.getActivityLog();
    }

    render() {
        return (
            <div className="container-fluid">

                <div className="row">
                    <div className="col-md-4 col-sm-12 col-xs-12">
                        <h3>Activity Report</h3>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-12">
                        <div className="form-group">
                            <input type="text" className="form-control"
                                   onChange={this.searchLog} value={this.state.q}
                                   placeholder="Search here..."
                            />
                        </div>
                    </div>
                    {/*<div className="col-md-4 col-sm-6 col-xs-12">*/}
                        {/*<input type="date"  className="pull-right form-control" style={{padding: '5px'}}/>*/}
                    {/*</div>*/}
                </div>
                <ActivityLogExportMixin log={this.state.logs}/>
                <LogListView logs={this.state.logs} loading={this.state.loading}/>
            </div>
        )
    }
}

export default withRouter(ActivityLog);