import React from 'react';
import { Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './styles.css';

const Homepage = () => {
    return (
        <div className="homepage">
            <header className="titlebar">
                <h1>CollegeConnect</h1>
                <Avatar className="avatar" alt="Profile" /*src="/path/to/avatar.jpg"*/ />
            </header>
            {/* <div className="body">
                <Link to="/page1" className="link-div">Page 1</Link>
                <Link to="/page2" className="link-div">Page 2</Link>
                <Link to="/page3" className="link-div">Page 3</Link>
            </div> */}
        </div>
    );
};

export default Homepage;