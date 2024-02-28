import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Places = () => {
  const {} = useParams();
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllAddedLocations = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found.');
        }

        const response = await axios.get(
          `http://localhost:8000/api/v1/users/places`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setAllLocations(response.data.data);
      } catch (error) {
        setError(error.message || 'Error fetching all the locations.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAddedLocations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="text-center">
        <Link
          className="inline-flex bg-pink-600 rounded-full items-center justify-center uppercase p-2 gap-2 hover:bg-white border border-solid "
          to={'/account/places/new'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Place
        </Link>
      </div>

      <div className="mt-8 grid  justify-items-center  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {allLocations.map((location) => (
          <div key={location._id} className="bg-white border-2 p-2 border-pink-500 border-solid  shadow-2xl rounded-lg overflow-hidden w-80">
            <img
              className="w-full h-56 object-cover object-center border-2 border-pink-600 rounded-md"
              src={location.photos[0]} // Assuming the first photo is the main photo
              alt={location.title}
            />
            <div className="p-4">
              <h2 className="text-gray-800 text-lg font-semibold capitalize">{location.title}</h2>
              <p className="mt-2 text-gray-600">{location.description}</p>
              <Link
                to={`/places/${location._id}`}
                className="mt-4 block text-center w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Places;
