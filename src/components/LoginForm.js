import React from 'react';


class LoginForm extends React.Component {
    state = {username: '', password: ''};

    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.username, this.state.password)
    };

    render() {
        return (
            <div className="ui segment">
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <label> Username</label>
                    <input className="field" type="text"
                           value={this.state.username}
                           onChange={(e) => this.setState({username: e.target.value})}/>
                    <label> Password</label>
                    <input className="field" type="text"
                           value={this.state.password}
                           onChange={(e) => this.setState({password: e.target.value})}/>
                    <button className="ui button" style={{ marginTop: '10px'}} type="submit">Login</button>
                </form>
            </div>
        );
    };
}

export default LoginForm;
