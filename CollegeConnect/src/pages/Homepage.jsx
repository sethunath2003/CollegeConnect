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
            <div className='card-container'>
                {/*Letter Drafting Card*/}
                <div className='card'>
                    <div className='card-content'>
                        {/*image here*/}
                    </div>
                    <div className='card-content'>
                        <h2>Letter Drafting</h2>
                        <Link to = '/letter-drafting'>
                        <button className='card-button'>Start Drafting</button>
                        </Link>
                    </div>
                </div>

             {/* Study Material Exchange Card */}
             <div className="card">
                    <div className="card-image">
                        {/* Insert image for study material exchange here, e.g.: */}
                        {/* <img src="/path/to/book-exchange.jpg" alt="Book Exchange" /> */}
                    </div>
                    <div className="card-content">
                        <h2>Study Material Exchange</h2>
                        <Link to="/bookexchange">
                            <button className="card-button">Go For Exchange</button>
                        </Link>
                    </div>
                </div>

                {/* Events and Hackathons Card */}
                <div className="card">
                    <div className="card-image">
                        {/* Insert image for events and hackathons here, e.g.: */}
                    </div>
                    <div className="card-content">
                        <h2>Events and Hackathons</h2>
                        <Link to="/eventlister">
                            <button className="card-button">View Events and Hackathons</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;