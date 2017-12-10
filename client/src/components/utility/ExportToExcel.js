import React, {Component} from "react";
import Workbook from 'react-excel-workbook'


class ExportToExcel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            fields: this.props.fields,
        };
    }

    render() {
        return (
            <div className="row text-center export-view">
                <Workbook filename={this.props.fileName} element={this.props.buttonElement}>
                    <Workbook.Sheet data={this.props.data} name="Sheet A">
                        {
                            this.props.fields.map(item => {
                                return <Workbook.Column key={item} label={item} value={item}/>
                            })
                        }
                    </Workbook.Sheet>
                </Workbook>
            </div>
        )
    }
}

export default ExportToExcel;