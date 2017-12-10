import React, {Component} from 'react';
import '../static/styles/landing-page.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <header className="intro-header">
                    <div className="container">
                        <div className="intro-message">
                            <h1>Issue Tracker</h1>
                            <h3>A simple light weight issue tracking system.</h3>
                            <span className="intro-divider">
                                <ul className="list-inline intro-social-buttons">
                                    <li className="list-inline-item">
                                        <a href="https://twitter.com/__ashraful" target="_blank" rel="noopener noreferrer"
                                           className="btn btn-secondary btn-lg">
                                            <i className="fa fa-twitter fa-fw"/>
                                            <span className="network-name">Twitter</span>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="https://github.com/iamashraful/issue-tracker-backend" target="_blank"
                                           className="btn btn-secondary btn-lg" rel="noopener noreferrer">
                                            <i className="fa fa-github fa-fw"/>
                                            <span className="network-name">API Codes</span>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a href="https://github.com/iamashraful/issue-tracker-frontend" target="_blank"
                                           className="btn btn-secondary btn-lg" rel="noopener noreferrer">
                                            <i className="fa fa-github fa-fw"/>
                                            <span className="network-name">Client Codes</span>
                                        </a>
                                    </li>
                                </ul>
                            </span>
                        </div>
                    </div>
                </header>

                <section className="content-section-a">

                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 ml-auto">
                                <span className="section-heading-spacer">
                                    <div className="clearfix"/>
                                    <h2 className="section-heading">Are you bored with pen & paper?</h2>
                                    <p className="lead">
                                        Actually we have been experienced with pen and paper. It lot hard to remember the state,
                                        also manage. So, We stop worried about that and stated building new system for tracking issues.
                                        It will be nice system we hope.
                                    </p>
                                </span>
                            </div>
                            <div className="col-lg-5 mr-auto">
                                <img className="img-fluid projects-card-img" alt=""/>
                            </div>
                        </div>

                    </div>

                </section>

                <section className="content-section-b">

                    <div className="container">

                        <div className="row">
                            <div className="col-lg-5 mr-auto order-lg-2">
                                <span className="section-heading-spacer">
                                    <div className="clearfix"/>
                                    <h2 className="section-heading">The cool projects view</h2>
                                    <p className="lead">
                                        Here's the project's card view. Just keeping these as like scram card.
                                        So that we can feel our old system looking at this. The design is cutting edge
                                        and much clean.
                                    </p>
                                </span>
                            </div>
                            <div className="col-lg-5 ml-auto order-lg-1">
                                <img className="img-fluid issues-list-img" src="../static/images/dog.png" alt=""/>
                            </div>
                        </div>

                    </div>
                </section>

                <section className="content-section-a">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 ml-auto">
                                <span className="section-heading-spacer">
                                    <div className="clearfix"/>
                                    <h2 className="section-heading">Issues are ridiculous to developer.</h2>
                                    <p className="lead">
                                        Yeah you guess right! It's issue list view for all projects. Easy to manage and
                                        understand the simplicity is really simple. You just can feel the simplicity.
                                    </p>
                                </span>
                            </div>
                            <div className="col-lg-5 mr-auto ">
                                <img className="img-fluid reporting-img" alt=""/>
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 my-auto">
                                <h2 className="text-center">{"{This}"} lets you work more collaboratively and get more done.</h2>
                            </div>
                        </div>
                    </div>
                </aside>
                <footer>
                    <h4 className="text-center p-5">
                        I declare hereby, This software is made for no harm, no awards or no competition or anything else.
                        This is created as internship project for <a href="https://field.buzz" target="_blank" rel="noopener noreferrer">Field Buzz</a>.
                    </h4>
                </footer>
            </div>
        )
    }
}

export default Home;