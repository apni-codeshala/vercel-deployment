import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format, differenceInDays } from "date-fns";

const SinglePlacePage = () => {
  const { subPlace } = useParams();
  const [placeData, setPlaceData] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberGuests, setNumberGuests] = useState(1);
  const [stayDuration, setStayDuration] = useState(0);
  const [Fullname, setFullname] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/users/place/${subPlace}`); // Updated URL
        const place = response.data.data;
        console.log(place.data)
        setPlaceData(place);

      } catch (error) {
        console.log("Error fetching place data:", error);
      }
    };

    if (subPlace) {
      fetchPlaceData();
    }
  }, [subPlace]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const duration = differenceInDays(new Date(checkOut), new Date(checkIn));
      setStayDuration(duration);
    }
  }, [checkIn, checkOut]);

  return (
    <div className="">
      {placeData ? (
        <>
          <h1 className="text-4xl font-mono text-gray-700 mt-4">
            {placeData.title}
          </h1>
          <p className="font-mono text-gray-700">{placeData.address}</p>
          <p className="text-sm font-extralight text-gray-500">
          Listed on {placeData.createdAt ? format(new Date(placeData.createdAt), "MM/dd/yyyy") : 'Unknown'}
          </p>

          <div className="grid grid-cols-[2fr_1fr] gap-3 mt-4 border h-96 rounded-3xl md:flex justify-between overflow-hidden">
            {placeData.photos.map((photo, key) => (
              <img key={key} className="" src={photo} alt={`Photo ${key}`} />
            ))}
          </div>

          <h2 className="text-lg text-gray-900 font-serif  ">
            {placeData.description}
          </h2>
          <p className="text-sm text-gray-600 ">
            {placeData.maxGuests} guests | 2 besdrooms | 2beds |1 bath
          </p>
          <p className="font-mono">
            Get it the best price{" "}
            <span className="text-blue-600">${placeData.price}</span>{" "}
          </p>
          <div className="grid grid-cols-2 ">
            <div className="border-2  w-fit p-2 rounded-lg">
              <span className="font-bold">checkIn:</span>{" "}
              {placeData.checkIn}
            </div>
            <div className="border-2  w-fit p-2 rounded-lg">
              <span className="font-bold">checkOut:</span>{" "}
              {placeData.checkOut}
            </div>
          </div>
          <div className="border flex flex-col w-full bg-slate-200 mt-4 rounded-2xl p-4  justify-center items-center">
            <h1 className="font-semibold text-xl">
              {" "}
              Price: ${placeData.price}/per night
            </h1>
            <div className="flex flex-col md:flex gap-4 md:gap-44 md:flex-row mt-4  text-sm">
              <div className="flex flex-col">
                <label className="font-bold">Check in:</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="font-bold">Check out:</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex flex-col">Number of guests:</label>
              <input
                type="number"
                value={numberGuests}
                onChange={(e) => setNumberGuests(e.target.value)}
              />
            </div>
            {stayDuration > 0 && (
              <>
                <p className="text-sm font-extralight text-gray-500">
                  Stay duration: {stayDuration} days
                </p>
                <label>
                  Name:
                  <input
                    type="text"
                    placeholder="John martis"
                    value={Fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    placeholder="9328XXXXXX"
                    value={PhoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </label>
              </>
            )}

            <button className="primary w-full mt-4">Book Now!</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SinglePlacePage;
