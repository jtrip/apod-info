import React from 'react';

const Image = (props) => {

    return (
        <div className="ui card" style={{width: '100vw'}}>
                <div className="ui image centered">
                    <img src={props.image.url} alt={props.image.title}/>
                </div>
                <div className="content">
                    <div className="header">
                        {props.image.title}
                    </div>
                    <p style={{marginTop: '10px'}}>
                        {props.image.description}
                    </p>
                </div>
                <div className="extra content">
                    <div className="header">
                        {props.word}
                    </div>
                    <p>
                        <a href={props.link}>
                            {props.link}
                        </a>
                    </p>
                </div>
        </div>
    );
};

export default Image;
