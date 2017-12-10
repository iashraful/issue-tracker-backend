import {Component} from "react";
import BasicStore from "../../stores/basic-store";


class DailyReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            reportData: [],
        };
    }

    getDailyReportData() {
        const url = BasicStore.makeUrl('api/v1/pms/daily-reports/');
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false, reportData: data});
        }).catch((err) => {
            console.log(err);
        });
    }

    componentWillMount() {
        this.getDailyReportData();
    }

    render() {
        return null
    }
}

export default DailyReport;
