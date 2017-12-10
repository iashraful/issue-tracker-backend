import React, {Component} from 'react';
import BasicStore from '../stores/basic-store';
import {HashRouter, Route, Switch} from 'react-router-dom';
import NavLinkCustom from "./utility/NavLinkCustom";
import NotFound from "./utility/NotFound";
import ProjectDetails from "./projects/ProjectDetails";
import IssueDetails from "./issues/IssueDetails";
import CreateEditProject from "./projects/CreateEditProject";
import CreateEditIssue from "./issues/IssueCreateView";
import IssueEditView from "./issues/IssueEditView";
import ProfileDetailsView from "./profiles/ProfileDetailsView";

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const navItems = BasicStore.navItems;
        const dropDownItems = BasicStore.dropdownItems;

        return (
            <HashRouter>
                <div>
                    <div className="nav-content">
                        <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse fixed-top">
                            <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                                    data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault"
                                    aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"/>
                            </button>
                            <a className="navbar-brand" href="/">Project's Issue Tracking System</a>
                            <div className="collapse navbar-collapse" id="navbarsExampleDefault">
                                <ul className="navbar-nav ml-auto">
                                    {dropDownItems.map(item =>
                                        <li className="nav-item dropdown" key={item.id}>
                                            <a
                                                className="nav-link dropdown-toggle" href=""
                                                id="navbarDropdownMenuLink" data-toggle="dropdown"
                                                aria-haspopup="true" aria-expanded="false"> {item.text}
                                            </a>
                                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                {item.menus.map(subMenu =>
                                                    <NavLinkCustom
                                                        key={subMenu.id}
                                                        cssClass="dropdown-item"
                                                        activeClass=""
                                                        auth={subMenu.auth}
                                                        text={subMenu.text}
                                                        url={subMenu.url}
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    )}
                                    {navItems.map(item =>
                                        <li className="nav-item" key={item.id}>
                                            {/* map require unique key. So, I just put. Nothing special */}
                                            <NavLinkCustom
                                                cssClass="nav-link"
                                                activeClass="active"
                                                auth={item.auth}
                                                text={item.text}
                                                url={item.url}
                                            />
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </nav>
                    </div>

                    {/* Defining Route */}
                    <Switch>
                        {navItems.map(item =>
                            <Route exact path={item.url} component={item.component} key={item.id}/>
                        )}
                        {dropDownItems.map(items =>
                            items.menus.map(menu =>
                                <Route exact path={menu.url} component={menu.component} key={menu.id}/>
                            )
                        )}
                        {/* Defining details page urls */}
                        <Route exact path="/projects/create" component={CreateEditProject}/>
                        <Route exact path="/projects/:slug" component={ProjectDetails}/>
                        <Route exact path="/issues/create" component={CreateEditIssue}/>
                        <Route exact path="/issues/:id" component={IssueDetails}/>
                        <Route exact path="/issues/:id/edit" component={IssueEditView}/>
                        <Route exact path="/profiles/:id" component={ProfileDetailsView}/>
                        {/* Defining 404 url */}
                        <Route component={NotFound}/>
                    </Switch>
                </div>
            </HashRouter>
        )
    }
}

export default NavBar;