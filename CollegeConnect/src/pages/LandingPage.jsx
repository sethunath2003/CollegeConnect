const LandingPage = () => {
    return ( 
        <div className="flex justify-center items-center"> //main container
            <header className="flex justify-center items-center bg-blue-500">//header
                <h2>CollegeConnect</h2>
                <div className="flex items-center"> //nav links
                    <button className="px-5 py-3 bg-blue-500 hover:bg-white-300 text:white">
                        Home
                    </button>
                    <button className="bg-blue-500 hover:bg-white-300 text:white">
                        About
                    </button>
                    <button className="bg-blue-500 hover:bg-white-300 text:white">
                        Services
                    </button>
                    <button className="bg-blue-500 hover:bg-white-300 text:white">
                        Contact
                    </button>
                </div>
                <div className="flex-justify-right">//login and signup buttons
                    <button className="px-5 py-3 bg-white-600 text:blue-500 hover:bg-blue-600 text:white-500">
                        Login
                    </button>
                    <button className="bg-white-600 text:blue-500 hover:bg-blue-600 text:white-500">
                        Sign Up
                    </button>
                </div>
            </header>
            <div className="flex bg-gray-350"> //main content
                <h3><b>Welcome to CollegeConnect</b></h3><br />
                <h4>Your gateway to College resources,networking and opportunities</h4><br />
                <div className="flex-justify-center gap-6 py-10 px-4">//services offered    
                    <div className="bg-white rounded-lg shadow-md p-6 flex-column">//letter drafting
                        <img src="" alt="Compose" />
                        <h3><b>Compose</b></h3>
                        <h4>Get Assistance in drafting letters for applications,internships and more</h4>
                        <button className="bg-blue-600 hover:bg-blue-300 shadow">
                            Learn More
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 flex-column">//study material exchange
                        <img src="" alt="Study Materials" />
                        <h3><b>Study Material Exchange</b></h3>
                        <h4>Share and access a variety of study materials with your peers</h4>
                        <button className="bg-blue-600 hover:bg-blue-300 shadow">
                            Join Now
                        </button>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 flex-column">//event calendar
                        <img src="" alt="Events" />
                        <h3><b>Events & Hackathons</b></h3>
                        <h4>Participate in exciting events and hackathons to showcase your skills.</h4>
                        <button className="bg-blue-600 hover:bg-blue-300 shadow">
                            Explore
                        </button>
                    </div>
                </div>
            </div>
            <footer className="bg-blue-500 text-white py-4">
                <div className="container mx-auto text-center text-sm">
                    © {new Date().getFullYear()} College Connect. All rights reserved.
                </div>
             </footer>
        </div>
    );
}
 
export default LandingPage;