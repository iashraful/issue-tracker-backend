import React, {Component} from "react";
import BasicStore from "../../stores/basic-store";


class IssueConversationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            statusCode: 0,
            permissionError: false,
            conversation: {},
            commentText: "",
            replyText: "",
        };
        this.conversation = {};
        this.handleCommitSubmit = this.handleCommitSubmit.bind(this);
        this.handleReplySubmit = this.handleReplySubmit.bind(this);
    }

    getConversation() {
        const url = BasicStore.makeUrl('api/v1/pms/issues/' + this.props.issueId + '/conversations/');
        const payload = {
            method: 'GET',
            headers: BasicStore.headers
        };
        fetch(url, payload).then((response) => {
            if (response.status === 401) {
                this.setState({unAuth: true});
            }
            if (response.status === 403) {
                this.setState({permissionError: true});
            }
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.conversation = data;
            this.setState({loading: false, conversation: data});
        }).catch((err) => {
            console.log(err);
        });
    }

    handleCommitSubmit(e) {
        const url = BasicStore.makeUrl('api/v1/pms/conversations/' + this.conversation.id + '/');
        const postBody = JSON.stringify({
            text: this.state.commentText,
            comment: true
        });
        const payload = {
            method: 'POST',
            headers: BasicStore.headers,
            body: postBody
        };
        fetch(url, payload).then((response) => {
            if (response.status === 403) {
                this.setState({permissionError: true});
            }
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false, commentText: ""});
            this.conversation.comments.unshift(data);
            this.setState({conversation: this.conversation});
        }).catch((err) => {
            console.log(err);
        });
        e.preventDefault();
    }

    handleReplySubmit(comment) {
        const url = BasicStore.makeUrl('api/v1/pms/conversations/' + this.conversation.id + '/');
        const postBody = JSON.stringify({
            text: this.state.replyText,
            reply: true,
            comment_id: comment.id
        });
        const payload = {
            method: 'POST',
            headers: BasicStore.headers,
            body: postBody
        };
        fetch(url, payload).then((response) => {
            if (response.status === 403) {
                this.setState({permissionError: true});
            }
            return response.json();
        }).then((data) => {
            // set loading false for stop loading feature
            this.setState({loading: false, replyText: ""});
            this.conversation.comments.map((cm) => {
                if(cm.id === comment.id) {
                    cm.replies.unshift(data);
                }
                return 0
            });
            this.setState({conversation: this.conversation});
            console.log(this.state.conversation);
        }).catch((err) => {
            console.log(err);
        });
    }


    componentDidMount() {
        this.getConversation();
    }

    render() {
        if(Object.keys(this.state.conversation).length === 0 && this.state.conversation.constructor === Object) {
            return <p className="text-center">No Notes Found!!</p>;
        }

        return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Notes</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p className="text-center">
                            {this.state.conversation.comments.length <= 0 ? "No notes found!!": ""}
                        </p>
                        <form onSubmit={this.handleCommitSubmit}>
                            <textarea
                                value={this.state.commentText}
                                rows="2" required placeholder="Write a note here..." style={{width: '80%'}}
                                onChange={(e) => this.setState({commentText: e.target.value})}
                            />
                            <button
                                type="submit"
                                className="pl-2 pr-2 btn btn-lg btn-outline-primary pull-right">
                                Comment
                            </button>
                        </form>
                        {this.state.conversation.comments.map(comment => {
                            return (
                                <div className="card m-b-15" key={comment.id}>
                                    <div className="card-header p-0 pl-2">
                                        <h4>Comment & Replies</h4>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="pl-2 mb-0">
                                            <i className="fa fa-comments" aria-hidden="true"/>
                                            <span className="pl-1">{comment.text}</span>
                                        </h5>
                                        <p className="pl-2 pt-0 text-muted">Commented by, {comment.author.name}</p>
                                        <div className="ml-5">
                                            <strong>Replies</strong>
                                            <p className="text-center">
                                                {comment.replies.length <= 0 ? "No reply found": ""}
                                            </p>
                                                <textarea
                                                    required placeholder="Write a reply here..."
                                                    rows="2" style={{width: '80%'}} value={this.state.replyText}
                                                    onChange={(e) => this.setState({replyText: e.target.value})}
                                                />
                                                <button
                                                    onClick={this.handleReplySubmit.bind(this, comment)}
                                                    className="pl-2 pr-2 btn btn-xs btn-outline-primary pull-right">
                                                    Reply
                                                </button>
                                            {
                                                comment.replies.map(reply => {
                                                    return (
                                                        <p key={reply.id}>
                                                            <i className="fa fa-reply" aria-hidden="true"/>
                                                            <span className="pl-1">{reply.text} --</span>
                                                            <span className="text-muted">{reply.author.name}</span>
                                                        </p>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default IssueConversationView;