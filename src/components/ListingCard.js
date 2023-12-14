import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ListingCard.css'; // Make sure this path is correct for your CSS file

function ListingCard({ listing }) {
  let navigate = useNavigate();

  // Function to navigate to the detail page of the listing when the card is clicked
  const goToDetailPage = () => {
    navigate(`/listing/${listing.id}`);
  };

  // Calculates and formats the price range for display on the card
  // If it's an individual room, show the range, otherwise, show the fixed price
  const getPriceRange = (listing) => {
    if (listing.propertyType === 'Individual Room' && listing.availableBedrooms.length) {
      const openRooms = listing.availableBedrooms.filter(room => room.status === 'Open');
      const prices = openRooms.map(room => parseInt(room.rent, 10));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return prices.length > 1 ? `$${minPrice}-${maxPrice}/month` : `$${minPrice}/month`;
    }
    return `$${listing.price}/month`;
  };

  const priceRange = getPriceRange(listing);
  const firstImage = listing.propertyImages[0];

  return (
    <div className="card" onClick={goToDetailPage}>
      <div className="card-image">
        {/* Display the first image of the listing */}
        {firstImage && <img src={firstImage} alt={listing.title} />}
        <div className="property-type-label">
          {/* Label indicating if the listing is for a full property or an individual room */}
          {listing.propertyType === 'Full Property' ? 'Full Property' : 'Room'}
        </div>
      </div>
      <div className="card-content">
        {/* Display the price or price range of the listing */}
        <div className="card-price">{priceRange}</div>
        {/* Display the title of the listing */}
        <h3 className="card-title">{listing.title}</h3>
        {/* Display the address if they say to */}
        {listing.displayAddress === 'Yes' && <p className="card-address">{listing.address}</p>}
        {/* Display the description of the listing */}
        <p className="card-description">{listing.description}</p>
      </div>
    </div>
  );
}

export default ListingCard;

