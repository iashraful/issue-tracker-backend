import dispatcher from "../dispatcher";

export function createAction() {
    dispatcher.dispatch({
        type: "CREATE"
    });
}

export function updateAction(id) {
    dispatcher.dispatch({
        type: "UPDATE",
        id
    });
}

export function deleteAction(id) {
    dispatcher.dispatch({
        type: "DELETE",
        id
    });
}
