import React from 'react';

const LandingPage = () => {
    return (
        <div className="bg-gray-900 min-h-screen flex flex-col font-sans"> {/* Added font-sans */}

            {/* Header */}
            <header className="bg-gray-900 text-white p-4 flex items-center justify-between w-full">
                <h2 className="text-3xl font-bold ml-[-10px]">CollegeConnect</h2> {/* Increased text size, added negative margin */}
                <div className="flex space-x-8"> {/* Increased horizontal spacing */}
                    <button className="px-4 py-2 hover:bg-gray-700 rounded">Home</button>
                    <button className="px-4 py-2 hover:bg-gray-700 rounded">About</button>
                    <button className="px-4 py-2 hover:bg-gray-700 rounded">Services</button>
                    <button className="px-4 py-2 hover:bg-gray-700 rounded">Contact</button>
                </div>
                <div className="flex space-x-4">
                    <button className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Login</button>
                    <button className="px-5 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Sign Up</button>
                </div>
            </header>

            {/* Main Content */}
                        <main className="flex-grow container mx-auto px-4 py-12">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold text-white">Welcome to CollegeConnect</h3>
                                <h4 className="text-lg text-gray-300 mt-2">Your gateway to College resources, networking and opportunities</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                                    <img src="letterdrafing.jpg" alt="Compose" />
                                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                                    <h3 className="text-xl font-bold mb-2">Compose</h3>
                                    <h4 className="text-gray-700 text-center mb-4">Get Assistance in drafting letters for applications, internships and more</h4>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Learn More
                                    </button>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                                    {/* Placeholder for image - Replace with your actual image */}
                        <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">Study Material Exchange</h3>
                        <h4 className="text-gray-700 text-center mb-4">Share and access a variety of study materials with your peers</h4>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Join Now
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                        {/* Placeholder for image - Replace with your actual image */}
                        <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">Events & Hackathons</h3>
                        <h4 className="text-gray-700 text-center mb-4">Participate in exciting events and hackathons to showcase your skills.</h4>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Explore
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-4 text-center">
                <div className="text-sm">
                    © {new Date().getFullYear()} College Connect. All rights reserved.
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;