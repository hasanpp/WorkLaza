export const getAddressFromCoordinates = async (latitude, longitude ) => {
    const apiKey = 'AIzaSyA0eNABot64Wdu0CjPDa-qKmVJVhV11UiI'; 
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
            const address = data.results[0].formatted_address;
            return address
        } else {
            console.error('Geocoding failed:', data.status);
            return(null)
        }
    } catch (error) {
        console.error('Error fetching address:', error);
        return(null)
    }
};



export const getGeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getAddressFromCoordinates(latitude, longitude);
            },
            (error) => {
                console.error("Error getting geolocation:", error);
                return(null)
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        return(null)
    }
};
