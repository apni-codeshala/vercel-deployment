import Cookies from "js-cookie";
import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

const PlacesPage = () => {
  const { action } = useParams();
  const [clicked, setclicked] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    photos: [],
    description: "",
    perks: {
      wifi: "",
      freeParking: "",
      metroPosition: "",
      laundryServices: "",
      tv: "",
      pets: "",
    },
    extraInfo: "",
    checkIn: "",
    checkOut: "",
    maxGuests: "",
    price:"",
  });
  const [redirect, setredirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChangePerk = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      perks: {
        ...prevState.perks,
        [name]: checked,
      },
    }));
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        perks: {
          ...prevState.perks,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prevState) => {
      const updatedPhotos = [...prevState.photos];
      updatedPhotos.splice(index, 1);
      const clickedImage=updatedPhotos.splice(index,1)[0];
      updatedPhotos.unshift(clickedImage);

      return {
        ...prevState,
        photos: updatedPhotos,
      };
    });
  };
  const setMain=(index)=>{
    setFormData((prevState)=>{

      const updatedPhotos=[...prevState.photos];
      const newMain=updatedPhotos.splice(index,1)[0];
      updatedPhotos.unshift(newMain);

      return {
        ...prevState,
        photos:updatedPhotos
      }
    })

  }

  const handlePhotoChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, value],
    }));
    // Clear the input field after adding the link
    e.target.value = "";
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = Cookies.get("accessToken");
    try {
      if (accessToken) {
        const formDataToSend = new FormData();
        for (const key in formData) {
          if (key === "photos") {
            for (let i = 0; i < formData[key].length; i++) {
              formDataToSend.append("photos", formData[key][i]);
            }
          } else if (typeof formData[key] === "object") {
            for (const subKey in formData[key]) {
              formDataToSend.append(`${key}.${subKey}`, formData[key][subKey]);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }

        const response = await axios.post(
          "http://localhost:8000/api/v1/users/places/add-new-locations", // Updated URL
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("Location added successfully:", response.data);
        setredirect(true);
        setIsSubmitting(false);
      } else {
        console.log("Access token not found.");
      }
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <>
      {action !== "new" && <></>}
      {action === "new" && (
        <div className="mt-4">
          <h1 className="text-center font-bold text-4xl uppercase">
            Add a new destination
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col max-w-md mx-auto"
          >
            <h2 className="text-xl mt-4">Title:</h2>
            <p className="text-gray-500 text-sm ">
              Title for your place, should be short and classy.
            </p>
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border-2 border-gray-500 rounded-lg"
            />

            <h2 className="text-xl mt-4">Address:</h2>
            <p className="text-gray-500 text-sm">Address for your place.</p>
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border-2 border-gray-500 rounded-lg"
            />

            <h2 className="text-xl mt-4">Photos:</h2>
            <p className="text-gray-500 text-sm">Add some photos.</p>
            <input
              type="url"
              placeholder="Enter Link's for Photos"
              name="photos"
              onChange={handlePhotoChange}
              className="border-2 border-gray-500 rounded-lg"
            />
            <div className="grid grid-cols-3 md:grid-cols-2 ">
              {formData.photos.map((photoUrl, index) => (
                <div className="relative">
                  <img
                    className="w-32 h-24 mt-4 rounded-lg "
                    key={index}
                    src={photoUrl} // Use the URL provided by the user
                    alt={`Uploaded photo ${index}`}
                  />
                  <div
                    className="absolute  z-10 bottom-0 text-white m-1 bg-black p-1 rounded-md bg-opacity-45"
                    onClick={() => removeImage(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </div>

                  <div
                    className="absolute z-10 bottom-0 right-6 md:right-24 text-white m-1 bg-black p-1 rounded-md bg-opacity-45"
                    onClick={() => setclicked(!clicked)}
                  >
                    {clicked ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                          onClick={()=>setMain(index)}
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl mt-4">Description:</h2>
            <p className="text-gray-500 text-sm">Description for your place.</p>
            <textarea
              type="text"
              rows={"6"}
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className=" mt-4 border-2 border-gray-500 rounded-lg"
            ></textarea>

            {/* Perks checkboxes */}
            <h2 className="text-xl mt-4">Perks:</h2>
            <div className="grid gap-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <div className="grid grid-cols-2  gap-4  ">
                {Object.entries(formData.perks).map(([key, isChecked]) => (
                  <label
                    htmlFor={key}
                    className="flex gap-3 items-center border border-solid p-2 m-1 w-auto text-wrap"
                    key={key}
                  >
                    <input
                      type="checkbox"
                      id={key}
                      checked={isChecked}
                      onChange={handleChangePerk}
                      name={key} // Use the perk name as the name attribute
                    />
                    <span className="text-gray-700 font-semibold">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            <h2 className="text-xl mt-4">Extra info:</h2>
            <p className="text-gray-500 text-sm">
              Extra information for your place.
            </p>
            <input
              type="text"
              placeholder="Extra info"
              name="extraInfo"
              value={formData.extraInfo}
              onChange={handleChange}
              className="border-2 border-gray-500 rounded-lg"
            />

            {/* Check-in time */}
            <h2 className="text-xl mt-4">Check-in time:</h2>
            <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-4">
              <div>
                <h3>Check-in</h3>
                <input
                  type="text"
                  placeholder="Check-in time"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="border-2 border-gray-500 rounded-lg"
                />
              </div>
              <div>
                <h3>Check-out</h3>
                <input
                  type="text"
                  placeholder="Check-out time"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="border-2 border-gray-500 rounded-lg"
                />
              </div>
              <div>
                <h3>Maximum Guests</h3>
                <input
                  type="text"
                  placeholder="Max in time"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  className="border-2 border-gray-500 rounded-lg"
                />
              </div>
              <div>
                <h3>Price</h3>
                <input
                  type="text"
                  placeholder="Price To Stay"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border-2 border-gray-500 rounded-lg"
                />
              </div>
              
            </div>


            {isSubmitting && (
              <p className="text-center text-green-600">Submitting...</p>
            )}
            <button className="primary my-3" type="submit">
              Add
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default PlacesPage;
