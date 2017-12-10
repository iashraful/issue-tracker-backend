import React, {Component} from 'react';
import BasicStore from '../../stores/basic-store';
import AccessControlView from "./AccessControlView";


class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: BasicStore.userRole,
            loading: false,
            testLoading: false,
            success: false,
            statusCode: "",
            testedReport: "",
        };
        this.runTests = this.runTests.bind(this);
    }

    runTests(e) {
        this.setState({testLoading: true});
        const postBody = JSON.stringify({
            tests: true
        });

        // Here will be save API call
        const url = BasicStore.makeUrl('api/v1/core/run-tests/');
        const payload = {
            method: 'POST',
            headers: BasicStore.headers,
            body: postBody
        };
        fetch(url, payload).then((response) => {
            if (response.status === 400) {
                this.setState({statusCode: response.status, testLoading: false});
            }
            if (response.status === 403) {
                this.setState({statusCode: response.status, testLoading: false});
            }
            if (response.status === 200) {
                this.setState({statusCode: response.status, success: true, testLoading: false});
            }
            return response.json();
        }).then((data) => {
            if (!this.state.success) {
                this.setState({errorData: data});
            }
            if (this.state.success) {
                this.setState({testLoading: false, testedReport: data, errorData: []});
            }
        }).catch((err) => {
            console.log(err);
        });
        e.preventDefault();
    }

    render() {
        const testLoader = this.state.testLoading ? "d-block" : "d-none";
        const wellTested = this.state.testedReport !== "" ? "d-block" : "d-none";
        const notTestedYet = this.state.testedReport === "" ? "d-block" : "d-none";
        const notPermitted = this.state.statusCode === 403 ? "d-block" : "d-none";

        if (this.state.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        return (
            <div className="container">
                <div className="row">
                    <AccessControlView/>
                    <div className="col-md-6 col-sm-6">
                        <div className="card">
                            <div className="card-header">
                                <h3>Run Tests</h3>
                            </div>
                            <div className="card-body m-2">
                                <button className="btn btn-outline-danger w-50ps" onClick={this.runTests}>Run</button>
                                <button className="btn btn-outline-success w-50ps"
                                        data-toggle="modal" data-target="#myModal">
                                    Show Report
                                </button>
                                <div className={testLoader + " container-loading text-center align-middle"}>
                                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                                </div>
                                <div className={notPermitted + " alert alert-danger m-2"}>
                                    <p className="text-center m-0">You don't have permission to do this.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL PART*/}
                <div className="modal fade" id="myModal"
                     role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <h4 className="modal-title text-truncate p-l-r-1" id="myModalLabel">
                                    Project's Issue Tracking System
                                </h4>
                            </div>
                            <div className="modal-body">
                                <div className={notTestedYet}>
                                    <h5 className="text-center">Please run a test and wait until it completed.</h5>
                                </div>
                                <div className={wellTested + " container-fluid"}>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <strong>Total Tests:</strong>
                                            <span style={{paddingLeft: '10px'}}>
                                                {this.state.testedReport.count_tests}
                                            </span>
                                        </div>
                                        <div className="col-sm-12">
                                            <strong>Success Tests:</strong>
                                            <span style={{paddingLeft: '10px'}}>
                                                {this.state.testedReport.success_tests}
                                            </span>
                                        </div>
                                        <div className="col-sm-12">
                                            <strong>Failed Tests:</strong>
                                            <span style={{paddingLeft: '10px'}}>
                                                {this.state.testedReport.failed_tests}
                                            </span>
                                        </div>
                                        <hr/>
                                        <div className="col-sm-12">
                                            <strong>Test Results:</strong>
                                            <p dangerouslySetInnerHTML={{__html: this.state.testedReport.result}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings