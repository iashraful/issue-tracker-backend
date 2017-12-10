import React, {Component} from "react";
import BasicStore from "../../stores/basic-store";
import RichTextEditor from 'react-rte';
import Dropzone from 'react-dropzone';

class CreateEditProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //UI related state
            loading: false,
            // Project states
            name: "",
            description: RichTextEditor.createEmptyValue(),
            website: "",
            documents: [],
            logo: [],
            // API Response state
            projectPostResponse: "",
            statusCode: 400,
            // Error Response
            success: false,
            errorData: [],
        };
        this.handleSaveProject.bind(this);
    }

    uploadFile(logo) {
        // Here will be save API call
        const url = BasicStore.makeUrl('api/v1/pms/documents/' + logo.name);
        let formData  = new FormData();
        formData.append('file', logo);
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Token ' + BasicStore.token
            },
            body: formData
        };

        fetch(url, payload).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({documents: [data.pk]})
        }).catch((err) => {
            console.log(err);
        });
    }

    onDrop(files) {
        this.setState({logo: files});
        this.uploadFile(files[0]);
    }

    handleSaveProject(event) {
        this.setState({loading: true});
        const postBody = JSON.stringify({
            name: this.state.name,
            description: this.state.description.toString('html'),
            website: this.state.website,
            documents: this.state.documents,
        });

        // Here will be save API call
        const url = BasicStore.makeUrl('api/v1/pms/projects/');
        const payload = {
            method: 'POST',
            headers: BasicStore.headers,
            body: postBody
        };
        fetch(url, payload).then((response) => {
            if (response.status === 400) {
                this.setState({statusCode: response.status, loading: false});
            }
            if (response.status === 401 || response.status === 403) {
                this.setState({statusCode: response.status, loading: false});
            }
            if (response.status === 201) {
                this.setState({statusCode: response.status, success: true, loading: false});
            }
            return response.json();
        }).then((data) => {
            if(!this.state.success) {
                this.setState({errorData: data});
            }
            if(this.state.success) {
                this.setState({loading: false, projectPostResponse: data, errorData: []});
            }
        }).catch((err) => {
            console.log(err);
        });
        event.preventDefault();
    }

    render() {
        let cssClasses = "form-control ";
        let successMgs = "text-center alert alert-success ";
        const savingButton = this.state.loading ? 'd-block' : 'd-none';
        const saveButton = this.state.loading ? 'd-none' : 'd-block';
        successMgs += this.state.success ? "d-block" : "d-none";
        const notPermitted = this.state.statusCode === 403 ? "You don't have permission to create a project." : "";

        if(this.state.success) {
            setTimeout(function() {
                window.location.assign("/#" + BasicStore.urlPaths.projects);
            }, 3000);
        }

        return (
            <div className="container">
                <h2 className="text-center text-danger">Create new Project</h2>
                <hr/>
                <h4 className={successMgs}>Project created successfully.</h4>
                <form onSubmit={this.handleSaveProject.bind(this)}>
                    <fieldset className="p-l-r-20p">
                        <p
                        className={this.state.errorData.non_fields_errors !== undefined ? 'alert alert-danger' : ''}>
                        {this.state.errorData.non_fields_errors}
                        </p>
                        <div className="form-group">
                            <label>Name</label> <br/>
                            <span className="text-danger">{this.state.errorData.name}</span>
                            <input className={cssClasses} placeholder="Name of Project" type="text"
                                   onChange={(event) => this.setState({name: event.target.value})}
                                   value={this.state.name}
                            />
                        </div>
                        <div className="form-group">
                            <label>Website</label><br/>
                            <span className="text-danger">{this.state.errorData.website}</span>
                            <input className={cssClasses} placeholder="Website of Project"
                                   type="text"
                                   onChange={(event) => this.setState({website: event.target.value})}
                                   value={this.state.website}
                            />
                        </div>
                        <div className="form-group">
                            <label>Logo</label><br/>
                            <Dropzone onDrop={this.onDrop.bind(this)} multiple={false} accept="image/*">
                                <p className="p-2">Try dropping some files here, or click to select files to upload.</p>
                            </Dropzone>
                            <aside>
                                <h4>Dropped files</h4>
                                <ul>{this.state.logo.map(f => <img alt="" className="img-thumbnail" key={f.name} src={f.preview}/>)}</ul>
                            </aside>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <br/>
                            <span className="text-danger">{this.state.errorData.description}</span>
                            <RichTextEditor
                                className="h-250px"
                                value={this.state.description}
                                onChange={(val) => this.setState({description: val})}
                            />
                        </div>
                        <p className="alert-danger text-center">{notPermitted}</p>
                        <button className="btn btn-primary pull-right custom-btn-padding">
                            <span className={saveButton}>Save</span>
                            <span className={savingButton}>Please Wait...
                                <i className="fa fa-spinner fa-spin"/>
                            </span>
                        </button>
                    </fieldset>
                </form>
            </div>
        )
    }
}

export default CreateEditProject;