// ...existing code...

function getRegistrationStatus(startDate, endDate) {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) {
        return 'Registration Not Started';
    } else if (currentDate > end) {
        return 'Registration Closed';
    } else {
        return 'Register Now';
    }
}

// Example usage
const hackathons = [
    {
        name: 'Imagine Cup x AVV Amaravati',
        startDate: '2025-02-22',
        endDate: '2025-02-28',
        // ...other properties...
    },
    // ...other hackathons...
];

hackathons.forEach(hackathon => {
    hackathon.registrationStatus = getRegistrationStatus(hackathon.startDate, hackathon.endDate);
});

// ...existing code...
