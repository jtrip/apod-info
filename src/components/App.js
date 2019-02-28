import React from 'react';
import Spinner from './Spinner'
import SearchBox from './SearchBox';
import LoginForm from './LoginForm';
import Image from './Image';
import jtripin from '../api/jtripin';


class App extends React.Component{
    state = {
        image: {},
        word: null,
        link: null,
        showLogin: true,
        showSearch: false,
        authStatus: null,
        errorMsg: null
    };

    componentDidMount = async () => {
        const response = await jtripin.get('/checkuser');
        console.log(response.data['status']);
        this.setState({authStatus: response.data['status']});
    };

    onSearchSubmit = async (day, month, year) => {
        const response = await jtripin.post('/apod-info', {
            day, month, year
        });
        console.log(response.data);

        let wiki_pages = response.data.w.query.pages;
        let top_page = Object.keys(wiki_pages)[0];

        this.setState({
            image: {
                title: response.data.nasa.title,
                url: response.data.nasa.url,
                description: response.data.nasa.explanation,
            },
            word: response.data.fw,
            link: response.data.w.query.pages[top_page].canonicalurl

        });
    };

    onLoginSubmit = async (username, password) => {
        const response = await jtripin.post('/login', {
            username, password
        });
        console.log(response.data);
        if (response.data['status'] === 'authenticated'){
            this.setState({authStatus: 'authenticated'})
        }
    };

    renderContent() {
        if (this.state.errorMsg){
            return <div>Error: {this.state.errorMsg}</div>
        }
        if(this.state.authStatus === 'not authenticated'){
            return (
                <div className="ui container" style={{ marginTop: '10px'}}>
                    <LoginForm onSubmit={this.onLoginSubmit} />
                </div>
            );
        }
        if(this.state.authStatus === 'authenticated') {
            return (
                <div className="ui container" style={{ marginTop: '10px'}}>
                    <SearchBox onSubmit={this.onSearchSubmit}/>
                    {this.state.image.url ? <Image image={this.state.image} link={this.state.link} word={this.state.word}/> : null}
                </div>
            );
        }
        return <Spinner message={"Loading"}/>
    }

    render() {
        return (
            <div>
                {this.renderContent()}
            </div>
        )
    }
}


export default App;
