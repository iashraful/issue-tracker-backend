import React, {Component} from 'react';
import NoAccess from "../utility/NoAccess";
import {Link} from "react-router-dom";

import BasicStore from '../../stores/basic-store';


class ProjectsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Style related states
            displayClass: 'd-block',
            loading: true,
            projectName: "",

            // Business Logic related states
            projects: [],
            statusCode: 0,
            permissionError: false,
        };
        this.contentVisibility = this.contentVisibility.bind(this);
        this.searchProject = this.searchProject.bind(this);
    }

    contentVisibility(val) {
        this.setState({displayClass: val});
    }

    getProjectList(params) {
        const url = BasicStore.makeUrl('api/v1/pms/projects/?' + params);
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            if (response.status === 401 || response.status === 403) {
                this.setState({statusCode: response.status, loading: false, permissionError: true});
            }
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false, projects: data.results});
            // save list to store for future use
            BasicStore.setProjects(data.results);
        }).catch((err) => {
            console.log(err);
        });
    }

    searchProject(e) {
        this.getProjectList("name=" + e.target.value);
        e.preventDefault();
    }

    componentWillMount() {
        // This method will run when a component has mount
        this.getProjectList();
        // Set loading false when not necessary
        if (this.state.statusCode === 401) {
            this.setState({loading: false});
        }
    }

    render() {
        let mainContentClass = 'container-fluid ';
        mainContentClass += this.state.displayClass;

        if (this.state.loading) {
            return (
                <div className="container-loading text-center align-middle">
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                </div>
            )
        }

        let notFound = "";
        if (this.state.projects.length === 0) {
            notFound = "No projects found.";
        }

        return (
            <div>
                <NoAccess displayCSS={this.contentVisibility.bind(this)}/>
                <div className={mainContentClass}>
                    <div className="action-view">
                        {/* Action buttons view */}
                        <div>
                            <Link
                                className="btn btn-primary link-button pull-right"
                                to={BasicStore.urlPaths.projects + BasicStore.urlPaths.create}> Create
                            </Link>
                        </div>
                    </div>
                    {/* Search View */}
                    <div style={{marginTop: "1rem", marginBottom: "1rem"}}>
                        <input
                            className="form-control w-33ps m-auto"
                            placeholder="Search..."
                            onChange={this.searchProject}
                        />
                    </div>
                    <p className="text-center">{notFound}</p>
                    {/* All the projects card view */}
                    <div className="row p-t-b-1rem">
                        {this.state.projects.map(project =>
                            <div className="col-md-4 col-sm-6 m-b-15" key={project.id}>
                                <div className="card card-outline-primary">
                                    {/*<h5 className="card-header text-truncate">{project.name}</h5>*/}
                                    <Link
                                        to={BasicStore.urlPaths.projects + '/' + project.slug}
                                        className="card-header text-truncate project-card-title"
                                        >{project.name}
                                        </Link>
                                    <div className="card-block card-scroll">
                                        <h6 className="card-title">
                                            <a href={project.website} target="_blank">{project.website}</a>
                                        </h6>
                                        <p
                                            className="card-text text-truncate project-desc"
                                            dangerouslySetInnerHTML={{ __html: project.description }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default ProjectsList;