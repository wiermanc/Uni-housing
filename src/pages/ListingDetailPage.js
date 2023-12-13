import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import mockListings from '../data/mockListings.json';
import axios from 'axios';
import './ListingDetailPage.css';

function ListingDetailPage() {
  let { id } = useParams();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [floorplanLightboxOpen, setFloorplanLightboxOpen] = useState(false);
const [currentFloorplanIndex, setCurrentFloorplanIndex] = useState(0);
const [bedroomLightboxOpen, setBedroomLightboxOpen] = useState(false);
const [currentBedroomImageIndex, setCurrentBedroomImageIndex] = useState(0);
const listing = mockListings.find(l => l.id.toString() === id);
const [userAddress, setUserAddress] = useState('');
const [distance, setDistance] = useState('');

const calculateDistance = async () => {
  if (!userAddress.trim() || !listing.address) {
    setDistance('Listing Address is not available or no user address provided');
    return;
  }

  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const listingAddress = encodeURI(listing.address.trim());
  const userEncodedAddress = encodeURI(userAddress.trim());
  const apiKey = 'AIzaSyATPxBqtzcd4ITt7Ydy_f-whXoXspJfs1o';

  const urlDriving = `${proxyUrl}https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${listingAddress}&destinations=${userEncodedAddress}&mode=driving&key=${apiKey}`;
  const urlWalking = `${proxyUrl}https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${listingAddress}&destinations=${userEncodedAddress}&mode=walking&key=${apiKey}`;

  try {
    const responseDriving = await axios.get(urlDriving);
    const responseWalking = await axios.get(urlWalking);
    
    const drivingResult = responseDriving.data.rows[0].elements[0];
    const walkingResult = responseWalking.data.rows[0].elements[0];

    if (drivingResult.status === 'OK' && walkingResult.status === 'OK') {
      setDistance(
        <>
          <p>Driving Distance: {drivingResult.distance.text}</p>
          <p>Driving Duration: {drivingResult.duration.text}</p>
          <p>Walking Distance: {walkingResult.distance.text}</p>
          <p>Walking Duration: {walkingResult.duration.text}</p>
        </>
      );
    } else {
      setDistance('Unable to calculate distance');
    }
    
  } catch (error) {
    // Updated error handling to reflect potential issues with the proxy or the API
    console.error('Error making the request:', error);
    setDistance('Error fetching distance. Please try again later.');
  }
};





   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!listing) {
    return <div className="listing-not-found">Listing not found.</div>;
  }

  const handleArrowClick = (direction, event) => {
    event.stopPropagation();
    if (direction === 'prev') {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  const openBedroomLightbox = (index) => {
    setCurrentBedroomImageIndex(index);
    setBedroomLightboxOpen(true);
  };

  const closeBedroomLightbox = () => {
    setBedroomLightboxOpen(false);
  };
  

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.propertyImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.propertyImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openFloorplanLightbox = (index) => {
    setCurrentFloorplanIndex(index);
    setFloorplanLightboxOpen(true);
  };
  
  const closeFloorplanLightbox = () => {
    setFloorplanLightboxOpen(false);
  };

  const renderRoomDetails = () => {
    return listing.availableBedrooms.map((room, index) => (
      <div className={`room-detail ${index === listing.availableBedrooms.length - 1 ? 'room-detail-last' : ''}`} key={room.bedroomNumber}>
        <div className="room-info">
          <h4>Room {room.bedroomNumber}</h4>
          <p>Status: {room.status === 'Open' ? 'Available' : 'Occupied'}</p>
          <p>Bathroom: {room.bathroom}</p>
          {room.status === 'Open' && (
            <>
              <p>Rent: ${room.rent}/month</p>
              <p>Security Deposit: ${room.securityDeposit}</p>
              <p>Size: {room.size}</p>
            </>
          )}
        </div>
        {room.bedroomImage && (
          <img src={room.bedroomImage} alt={`Bedroom ${room.bedroomNumber}`} className="room-image" onClick={() => openBedroomLightbox(index)}/>
        )}
      </div>
    ));
  };


  const renderFullPropertyDetails = () => {
    if (listing.propertyType === 'Full Property') {
      return (
        <>
          <p>Bedrooms: {listing.bedrooms}</p>
          <p>Bathrooms: {listing.bathrooms}</p>
          <p>Security Deposit: ${listing.securityDeposit}</p>
          <p>Utilities Included: {listing.utilitiesIncluded}</p>
          <p>Distance to University: {listing.distanceToUniversity} miles</p>
          <p>Parking: {listing.parking}</p>
          <p>Pets: {listing.pets}</p>
          <p>Air Conditioning: {listing.airConditioning}</p>
          <p>Heating: {listing.heating}</p>
          <p>Laundry: {listing.laundry}</p>
        </>
      );
    }
    return null; // Don't render anything for individual room listings
  };

  

  return (
    <div className="listing-detail-page">
      <div className="listing-detail-content">
        <div className="listing-detail-images">
          {listing.propertyImages.slice(0, 4).map((image, index) => (
            <img 
              key={index} 
              src={image} 
              alt={`Property ${index + 1}`} 
              onClick={() => openLightbox(index)}
              className="property-image"
            />
          ))}
           <p className="image-caption">These are just a few pictures of the property! Click on any image to scroll through them all!</p>
        </div>
        <div className="listing-detail-info">
          <h1>{listing.title}</h1>
          {listing.propertyType === 'Full Property' && <p className="listing-price">${listing.price}/month</p>}
          {listing.displayAddress === 'Yes' && <p className="listing-address">{listing.address}</p>}
          <p className="listing-description">{listing.description}</p>
          {listing.propertyType === 'Full Property' && (
            <>
              <p>Bedrooms: {listing.bedrooms}</p>
              <p>Bathrooms: {listing.bathrooms}</p>
              <p>Security Deposit: ${listing.securityDeposit}</p>
            </>
          )}
          <div className="distance-calculator-section">
    <h2>Find Out Your Commute!</h2>
    <p className="distance-calculator-caption">
      Enter your address below to calculate the driving and walking distance to this property.
    </p>
    <div className="input-group">
      <input
        type="text"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
        placeholder="Enter your address"
        className="user-address-input"
      />
      <button onClick={calculateDistance} className="calculate-button">
        Calculate Distance
      </button>
    </div>
    {distance && <p className="distance-result">Distance from the property: {distance}</p>}
  </div>

{listing.ownerContact && (
  <div className="listing-contact-info">
    {listing.ownerContact.email && listing.ownerContact.displayEmail === 'Yes' && (
      <p>Email: {listing.ownerContact.email}</p>
    )}
    {listing.ownerContact.phoneNumber && listing.ownerContact.displayPhone === 'Yes' && (
      <p>Phone: {listing.ownerContact.phoneNumber}</p>
    )}
    <p className="contact-message">{listing.ownerContact.contactMessage}</p>
  </div>
)}


          {listing.propertyType === 'Individual Room' && renderRoomDetails()}
          <p>Utilities Included: {listing.utilitiesIncluded}</p>
          <p>Distance to University: {listing.distanceToUniversity} miles</p>
          {listing.propertyType === 'Full Property' && (
            <>
              <p>Parking: {listing.parking}</p>
              <p>Pets: {listing.pets}</p>
            </>
          )}
          <p>Air Conditioning: {listing.airConditioning}</p>
          <p>Heating: {listing.heating}</p>
          <p>Laundry: {listing.laundry}</p>
          <p>Pets: {listing.pets}</p>
          <div className="listing-amenities">
            <h3>Amenities:</h3>
            <ul>
              {listing.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
          
          <p>Lease Start Date: {listing.leaseStartDate}</p>
          <p>Lease End Date: {listing.leaseEndDate}</p>
          <p>Available Units: {listing.availableUnits}</p>
          <div className="listing-floorplan-images">
  <h3>Floorplan Image(s):</h3>
  {listing.floorplanImages.map((image, index) => (
    <img 
      key={index} 
      src={image} 
      alt={`Floorplan ${index + 1}`} 
      className="floorplan-image" 
      onClick={() => openFloorplanLightbox(index)}
      />
      ))}
    </div>
        </div>
      </div>

      {floorplanLightboxOpen && (
  <div className="lightbox" onClick={closeFloorplanLightbox}>
    <span className="close" onClick={(e) => { e.stopPropagation(); closeFloorplanLightbox(); }}>&times;</span>
    <img 
      src={listing.floorplanImages[currentFloorplanIndex]} 
      alt={`Floorplan image ${currentFloorplanIndex + 1}`} 
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}
  
  {bedroomLightboxOpen && (
    <div className="lightbox" onClick={closeBedroomLightbox}>
      <span className="close" onClick={(e) => { e.stopPropagation(); closeBedroomLightbox(); }}>&times;</span>
      <img
        src={listing.availableBedrooms[currentBedroomImageIndex].bedroomImage}
        alt={`Bedroom image`}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )}

      {lightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="close" onClick={(e) => { e.stopPropagation(); closeLightbox(); }}>&times;</span>
          <span className="arrow left" onClick={(e) => handleArrowClick('prev', e)}>&lt;</span>
          <img 
            src={listing.propertyImages[currentImageIndex]} 
            alt={`Property image ${currentImageIndex + 1}`} 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="arrow right" onClick={(e) => handleArrowClick('next', e)}>&gt;</span>
        </div>
      )}
    </div>
  );
}

export default ListingDetailPage;
