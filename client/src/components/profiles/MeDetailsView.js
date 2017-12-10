import React, {Component} from "react";
import ProfileDetailsView from "./ProfileDetailsView";
import BasicStore from "../../stores/basic-store";


class MeDetailsView extends Component {
    
    render() {
        return (
            <ProfileDetailsView profilePK={BasicStore.userId}/>
        )
    }
}

export default MeDetailsView;