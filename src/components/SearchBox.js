import React from 'react';

const day = new Date().getDate();
const month = new Date().getMonth();
const year = new Date().getFullYear();

class SearchBox extends React.Component {
    state = {day: day, month: month, year: year};

    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.day, this.state.month, this.state.year)
    };

    render() {
        return (
            <div className="ui segment">
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <label>Day</label>
                    <input className="field" type="number"
                           value={this.state.day}
                           onChange={(e) => this.setState({day: e.target.value})}/>
                    <label>Month</label>
                    <input className="field" type="number"
                           value={this.state.month}
                           onChange={(e) => this.setState({month: e.target.value})}/>
                    <label>Year</label>
                    <input className="field" type="number"
                           value={this.state.year}
                           onChange={(e) => this.setState({year: e.target.value})}/>
                    <button className="ui button" style={{ marginTop: '10px'}} type="submit">Get APOD</button>
                </form>
            </div>
        );
    };
}

export default SearchBox;
