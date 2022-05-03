import './map.css';

import React from 'react';

export default function MapAnnouncementPopup(props) {
    if (props.anon !== undefined && props.anon !== null) {
        return (
            <div className='anonPopup'>
                <img src={process.env.REACT_APP_SERVER_ROOT_URL + '/anons/photo?name=' + props.anon.image} />
                <b>{props.anon.title}</b><br />
                {props.anon.description}
            </div>
        )
    }
    else {
        return (
            <div className='basicPopup'></div>
        )
    }    
}