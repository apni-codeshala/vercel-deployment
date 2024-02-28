import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Index = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllLocationPhotos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/users/all-location-photos');
                const placesData = response.data.data;
                setPlaces(placesData);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching places:', error);
                setError('Error fetching places. Please try again later.');
                setLoading(false);
            }
        };

        fetchAllLocationPhotos();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Check if places is truthy before mapping over it
    if (!places || places.length === 0) {
        return <p>No places found.</p>;
    }

    return (
        <div className='flex flex-wrap justify-center m-2 mt-16 gap-5'>
            {places.map(place => (
                <Link to={`/place/${place._id}`} key={place._id} className='flex flex-col border w-64'>
                    <img className='w-full rounded-lg object-cover' src={place.photos[0]} alt="Location Photo" />
                    <div className='p-4'>
                        <h2 className='font-mono font-light'>{place.title}</h2>
                        <h2 className='font-extralight text-sm'>{place.address}</h2>
                        <h5>${place.price}</h5>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Index;
