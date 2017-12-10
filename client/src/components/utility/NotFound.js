import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class NotFound extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="error-template">
                            <h1>Oops!</h1>
                            <h2>404 Not Found</h2>
                            <div className="error-details">
                                Sorry, an error has occurred, Requested page not found!
                            </div>
                            <div className="error-actions">
                                <Link to="/" className="btn btn-outline-success btn-md" role="button">
                                    <i className="fa fa-home p-r-10"/>
                                    Take Me Home
                                </Link>
                                <a href="mailto:ashrafulrobin3@gmail.com?Subject=404%20Not%20Found" target="_top"
                                   className="btn btn-outline-primary btn-md">
                                    <i className="fa fa-envelope p-r-10"/>
                                    Mail to Author
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound;