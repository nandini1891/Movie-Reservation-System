import React, { useState, useEffect } from 'react';
import { 
  getFilms, getTheaters, getShowtimes, 
  getBookings, addBooking 
} from '../utils/data';

export default function MemberPortal({ user, onSignOut, showToast }) {
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog', 'bookings'
  const [films, setFilms] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection Flow States
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const refreshData = () => {
    setFilms(getFilms());
    setTheaters(getTheaters());
    setShowtimes(getShowtimes());
    setBookings(getBookings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSelectFilm = (film) => {
    setSelectedFilm(film);
    setSelectedShowtime(null);
    setSelectedSeats([]);
  };

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
    setSelectedSeats([]);
  };

  // Get occupied seats for a specific showtime
  const getOccupiedSeats = (showtimeId) => {
    return bookings
      .filter(b => b.showtimeId === showtimeId && b.status === 'Confirmed')
      .flatMap(b => b.seats);
  };

  const handleSeatClick = (seatCode, isOccupied) => {
    if (isOccupied) return;
    
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      showToast('Please select at least one seat to book.', 'error');
      return;
    }

    const theater = theaters.find(t => t.id === selectedShowtime.theaterId);
    const totalPrice = selectedSeats.length * selectedShowtime.price;

    const bookingPayload = {
      userId: user.id,
      userName: user.name,
      showtimeId: selectedShowtime.id,
      seats: selectedSeats,
      totalPrice: totalPrice
    };

    addBooking(bookingPayload);
    showToast(`Successfully booked ${selectedSeats.length} ticket(s)!`, 'success');
    
    // Clear selections and redirect to bookings page
    setSelectedSeats([]);
    setSelectedShowtime(null);
    setSelectedFilm(null);
    refreshData();
    setCurrentView('bookings');
  };

  // Filter films by search
  const filteredFilms = films.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="member-layout">
      {/* Header Bar */}
      <header className="member-header">
        <div className="logo-section">
          <span className="logo font-serif">CINÉVAULT</span>
          <span className="badge badge-member">MEMBER</span>
        </div>
        <nav className="header-nav">
          <button 
            className={`nav-link ${currentView === 'catalog' && !selectedFilm ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('catalog');
              setSelectedFilm(null);
              setSelectedShowtime(null);
            }}
          >
            Browse Movies
          </button>
          <button 
            className={`nav-link ${currentView === 'bookings' ? 'active' : ''}`}
            onClick={() => {
              setCurrentView('bookings');
              setSelectedFilm(null);
              setSelectedShowtime(null);
            }}
          >
            My Bookings
          </button>
        </nav>
        <div className="user-section">
          <span className="user-name">Welcome, {user.name.split(' ')[0]}!</span>
          <button className="btn-signout" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <main className="member-main container">
        
        {/* CATALOG VIEW */}
        {currentView === 'catalog' && !selectedFilm && (
          <div className="fade-in">
            {/* Search Bar */}
            <div className="catalog-header-row">
              <h1 className="catalog-title font-serif">Now Screening</h1>
              <div className="search-box">
                <input 
                  type="text" 
                  className="form-control search-input" 
                  placeholder="Search by movie title or genre..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredFilms.length === 0 ? (
              <div className="card empty-state">No matching films found. Check back later!</div>
            ) : (
              <div className="movie-grid">
                {filteredFilms.map(film => (
                  <div key={film.id} className="movie-card">
                    <div className="poster-wrapper">
                      <img src={film.poster} alt={film.title} className="movie-poster" />
                      <div className="poster-overlay">
                        <button className="btn btn-primary" onClick={() => handleSelectFilm(film)}>
                          Get Tickets
                        </button>
                      </div>
                    </div>
                    <div className="movie-info">
                      <span className="movie-genre">{film.genre}</span>
                      <h3 className="movie-title">{film.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-duration">{film.duration}</span>
                        <span className="rating-tag">{film.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FILM DETAIL & SHOWTIMES VIEW */}
        {currentView === 'catalog' && selectedFilm && !selectedShowtime && (
          <div className="fade-in">
            <button className="back-btn" onClick={() => setSelectedFilm(null)}>
              ← Back to Movies
            </button>
            
            <div className="movie-detail-card card">
              <div className="movie-detail-layout">
                <img src={selectedFilm.poster} alt={selectedFilm.title} className="detail-poster" />
                <div className="detail-info">
                  <span className="movie-genre">{selectedFilm.genre}</span>
                  <h1 className="detail-title font-serif">{selectedFilm.title}</h1>
                  
                  <div className="detail-meta">
                    <span className="detail-meta-item"><strong>Duration:</strong> {selectedFilm.duration}</span>
                    <span className="detail-meta-item"><strong>Rating:</strong> {selectedFilm.rating}</span>
                  </div>

                  <p className="detail-desc">{selectedFilm.description}</p>
                </div>
              </div>

              <div className="showtimes-section">
                <h3 className="section-heading font-serif">Available Showtimes</h3>
                {showtimes.filter(s => s.filmId === selectedFilm.id).length === 0 ? (
                  <div className="empty-state">No showtimes scheduled for this film. Please contact administrator.</div>
                ) : (
                  <div className="showtime-list">
                    {showtimes
                      .filter(s => s.filmId === selectedFilm.id)
                      .map(show => {
                        const theater = theaters.find(t => t.id === show.theaterId);
                        const isUpcoming = new Date(show.dateTime) > new Date();
                        return (
                          <div key={show.id} className="showtime-row">
                            <div className="showtime-info">
                              <span className="showtime-theater">{theater ? theater.name : 'Unknown Theater'}</span>
                              <span className="showtime-date">
                                {new Date(show.dateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at{' '}
                                <strong>
                                  {new Date(show.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </strong>
                              </span>
                            </div>
                            <div className="showtime-pricing-action">
                              <span className="showtime-price">${show.price.toFixed(2)}</span>
                              <button 
                                className={`btn btn-primary ${!isUpcoming ? 'btn-disabled' : ''}`}
                                onClick={() => handleSelectShowtime(show)}
                              >
                                {isUpcoming ? 'Select Seats' : 'Expired'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SEAT SELECTION VIEW */}
        {currentView === 'catalog' && selectedFilm && selectedShowtime && (
          <div className="fade-in">
            <button className="back-btn" onClick={() => setSelectedShowtime(null)}>
              ← Back to Showtimes
            </button>

            <div className="booking-layout">
              {/* Left Side: Seat Map */}
              <div className="seat-selection-card card">
                <h2 className="section-title font-serif">Select Your Seats</h2>
                
                {/* Cinema Screen Visualizer */}
                <div className="screen-container">
                  <div className="screen-bar"></div>
                  <span className="screen-text">SCREEN THIS WAY</span>
                </div>

                {/* Seats Grid */}
                {(() => {
                  const theater = theaters.find(t => t.id === selectedShowtime.theaterId);
                  if (!theater) return <p>Theater config not found.</p>;
                  
                  const occupied = getOccupiedSeats(selectedShowtime.id);
                  const rowsArray = Array.from({ length: theater.rows }, (_, i) => String.fromCharCode(65 + i)); // A, B, C...
                  const colsArray = Array.from({ length: theater.cols }, (_, i) => i + 1);

                  return (
                    <div className="seats-map-wrapper">
                      <div className="seats-grid" style={{ gridTemplateColumns: `repeat(${theater.cols}, 1fr)` }}>
                        {rowsArray.map(row => 
                          colsArray.map(col => {
                            const seatCode = `${row}-${col}`;
                            const isOccupied = occupied.includes(seatCode);
                            const isSelected = selectedSeats.includes(seatCode);
                            
                            return (
                              <button
                                key={seatCode}
                                className={`seat ${isOccupied ? 'occupied' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSeatClick(seatCode, isOccupied)}
                                title={`Seat ${seatCode}`}
                              >
                                {seatCode}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Legend */}
                <div className="seats-legend">
                  <div className="legend-item">
                    <span className="legend-box seat-available"></span>
                    <span className="legend-text">Available</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-box seat-selected"></span>
                    <span className="legend-text">Selected</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-box seat-occupied"></span>
                    <span className="legend-text">Occupied</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Price Details Card */}
              <div className="checkout-summary-card card">
                <h3 className="summary-title font-serif">Booking Summary</h3>
                
                <div className="summary-divider"></div>
                
                <div className="summary-info-rows">
                  <div className="summary-row">
                    <span className="summary-label">Movie</span>
                    <span className="summary-value">{selectedFilm.title}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Theater</span>
                    <span className="summary-value">
                      {theaters.find(t => t.id === selectedShowtime.theaterId)?.name}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Showtime</span>
                    <span className="summary-value">
                      {new Date(selectedShowtime.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Ticket Price</span>
                    <span className="summary-value font-mono">${selectedShowtime.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-seats-row">
                  <span className="summary-label">Selected Seats</span>
                  {selectedSeats.length === 0 ? (
                    <span className="summary-value text-placeholder">None chosen</span>
                  ) : (
                    <div className="selected-seat-tags">
                      {selectedSeats.map(seat => (
                        <span key={seat} className="seat-tag">{seat}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="summary-divider"></div>

                <div className="total-price-row">
                  <span className="total-label">Total Amount</span>
                  <span className="total-val font-mono">
                    ${(selectedSeats.length * selectedShowtime.price).toFixed(2)}
                  </span>
                </div>

                <button 
                  className={`btn btn-primary checkout-btn ${selectedSeats.length === 0 ? 'btn-disabled' : ''}`}
                  onClick={handleConfirmBooking}
                >
                  Pay & Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS VIEW (TICKETS LIST) */}
        {currentView === 'bookings' && (
          <div className="fade-in">
            <h1 className="catalog-title font-serif" style={{ marginBottom: '32px' }}>My Confirmed Passes</h1>
            
            {bookings.filter(b => b.userId === user.id).length === 0 ? (
              <div className="card empty-state">
                You haven't booked any movie tickets yet. 
                <button 
                  className="btn btn-primary" 
                  style={{ display: 'block', margin: '20px auto 0' }}
                  onClick={() => setCurrentView('catalog')}
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div className="tickets-container">
                {bookings
                  .filter(b => b.userId === user.id)
                  .slice()
                  .reverse()
                  .map(booking => {
                    const show = showtimes.find(s => s.id === booking.showtimeId);
                    const film = show ? films.find(f => f.id === show.filmId) : null;
                    const theater = show ? theaters.find(t => t.id === show.theaterId) : null;

                    return (
                      <div key={booking.id} className="ticket-stub">
                        {/* Left Side: Movie Info */}
                        <div className="ticket-main">
                          <div className="ticket-brand">CINÉVAULT PREMIUM</div>
                          <div className="ticket-movie-title font-serif">{film ? film.title : 'Deleted Film'}</div>
                          
                          <div className="ticket-details-grid">
                            <div className="ticket-detail">
                              <span className="td-label">THEATER</span>
                              <span className="td-val">{theater ? theater.name : 'Unknown Theater'}</span>
                            </div>
                            <div className="ticket-detail">
                              <span className="td-label">DATE & TIME</span>
                              <span className="td-val">
                                {show ? new Date(show.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}{' '}
                                at {show ? new Date(show.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                              </span>
                            </div>
                            <div className="ticket-detail">
                              <span className="td-label">SEATS</span>
                              <span className="td-val font-mono">{booking.seats.join(', ')}</span>
                            </div>
                            <div className="ticket-detail">
                              <span className="td-label">PRICE PAID</span>
                              <span className="td-val font-mono">${booking.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="ticket-badge-row">
                            <span className={`status-pill ${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                            <span className="ticket-id font-mono">ID: {booking.id}</span>
                          </div>
                        </div>

                        {/* Right Side: QR/Barcode Stub */}
                        <div className="ticket-stub-bar">
                          <div className="ticket-circle-top"></div>
                          <div className="ticket-circle-bottom"></div>
                          
                          <div className="barcode-container">
                            <svg className="barcode" viewBox="0 0 100 40">
                              {/* Draw standard visual barcode lines */}
                              <rect x="5" y="0" width="2" height="40" fill="currentColor" />
                              <rect x="9" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="12" y="0" width="3" height="40" fill="currentColor" />
                              <rect x="18" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="21" y="0" width="2" height="40" fill="currentColor" />
                              <rect x="25" y="0" width="4" height="40" fill="currentColor" />
                              <rect x="31" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="34" y="0" width="2" height="40" fill="currentColor" />
                              <rect x="38" y="0" width="3" height="40" fill="currentColor" />
                              <rect x="43" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="46" y="0" width="4" height="40" fill="currentColor" />
                              <rect x="52" y="0" width="2" height="40" fill="currentColor" />
                              <rect x="56" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="59" y="0" width="3" height="40" fill="currentColor" />
                              <rect x="64" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="67" y="0" width="2" height="40" fill="currentColor" />
                              <rect x="71" y="0" width="4" height="40" fill="currentColor" />
                              <rect x="77" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="80" y="0" width="2" height="40" fill="currentColor" />
                              <rect x="84" y="0" width="3" height="40" fill="currentColor" />
                              <rect x="89" y="0" width="1" height="40" fill="currentColor" />
                              <rect x="92" y="0" width="3" height="40" fill="currentColor" />
                            </svg>
                            <span className="barcode-number font-mono">{booking.id.toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        .member-layout {
          min-height: 100vh;
          background-color: var(--bg-base);
          display: flex;
          flex-direction: column;
        }

        .member-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
        }

        .header-nav {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .nav-link:hover, .nav-link.active {
          color: var(--primary);
          background-color: var(--primary-muted);
        }

        .badge-member {
          background-color: rgba(46, 204, 113, 0.1);
          border: 1px solid var(--success);
          color: var(--success);
        }

        .member-main {
          flex: 1;
          padding-top: 40px;
          padding-bottom: 60px;
        }

        .catalog-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .catalog-title {
          font-size: 36px;
          font-weight: 700;
          text-align: left;
        }

        .search-box {
          width: 320px;
        }

        .search-input {
          padding: 10px 16px;
          font-size: 14px;
        }

        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 28px;
        }

        .movie-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-sm);
        }

        .movie-card:hover {
          transform: translateY(-6px);
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
        }

        .poster-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 2 / 3;
          background-color: var(--bg-input);
          overflow: hidden;
        }

        .movie-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .movie-card:hover .movie-poster {
          transform: scale(1.05);
        }

        .poster-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(4, 4, 6, 0.7);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity var(--transition-fast);
        }

        .poster-wrapper:hover .poster-overlay {
          opacity: 1;
        }

        .movie-info {
          padding: 20px;
          text-align: left;
        }

        .movie-genre {
          display: block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--primary);
          margin-bottom: 6px;
        }

        .movie-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-main);
          margin-bottom: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .movie-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .back-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 24px;
          transition: color var(--transition-fast);
          display: flex;
          align-items: center;
        }

        .back-btn:hover {
          color: var(--primary);
        }

        .movie-detail-card {
          text-align: left;
          padding: 40px;
          margin-bottom: 30px;
        }

        .movie-detail-layout {
          display: flex;
          gap: 40px;
          margin-bottom: 40px;
        }

        .detail-poster {
          width: 220px;
          height: 310px;
          object-fit: cover;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
        }

        .detail-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .detail-title {
          font-size: 40px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .detail-meta {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .detail-meta-item strong {
          color: var(--text-main);
        }

        .detail-desc {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        .showtimes-section {
          border-top: 1px solid var(--border-color);
          padding-top: 32px;
        }

        .section-heading {
          font-size: 22px;
          margin-bottom: 24px;
        }

        .showtime-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .showtime-row {
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: border-color var(--transition-fast);
        }

        .showtime-row:hover {
          border-color: var(--primary-hover);
        }

        .showtime-theater {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 4px;
        }

        .showtime-date {
          font-size: 15px;
          color: var(--text-main);
        }

        .showtime-pricing-action {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .showtime-price {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary);
          font-family: var(--font-sans);
        }

        .booking-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          align-items: start;
        }

        .screen-container {
          margin: 32px 0 48px;
          text-align: center;
        }

        .screen-bar {
          height: 4px;
          background: linear-gradient(90deg, transparent 0%, var(--primary) 50%, transparent 100%);
          border-radius: 2px;
          box-shadow: 0 0 16px var(--primary-glow);
          margin-bottom: 8px;
        }

        .screen-text {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 3px;
        }

        .seats-map-wrapper {
          display: flex;
          justify-content: center;
          padding: 0 20px;
          overflow-x: auto;
        }

        .seats-grid {
          display: grid;
          gap: 8px;
          max-width: 100%;
        }

        .seat {
          aspect-ratio: 1;
          width: 36px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
          color: var(--text-secondary);
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .seat:hover:not(.occupied) {
          border-color: var(--primary);
          background-color: var(--primary-muted);
          color: var(--text-main);
        }

        .seat.selected {
          background-color: var(--primary) !important;
          border-color: var(--primary) !important;
          color: #12121C !important;
          font-weight: 700;
        }

        .seat.occupied {
          background-color: #242436;
          border-color: #242436;
          color: var(--text-muted);
          cursor: not-allowed;
          position: relative;
        }
        .seat.occupied::after {
          content: '×';
          position: absolute;
          font-size: 14px;
          color: var(--text-muted);
        }

        .seats-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 36px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .seat-available {
          border: 1px solid var(--border-color);
          background-color: var(--bg-input);
        }

        .seat-selected {
          background-color: var(--primary);
        }

        .seat-occupied {
          background-color: #242436;
        }

        .legend-text {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .checkout-summary-card {
          text-align: left;
        }

        .summary-title {
          font-size: 20px;
          font-weight: 600;
        }

        .summary-divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 20px 0;
        }

        .summary-info-rows {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .summary-label {
          color: var(--text-secondary);
        }

        .summary-value {
          font-weight: 600;
          color: var(--text-main);
          text-align: right;
          max-width: 180px;
        }

        .summary-value.text-placeholder {
          font-style: italic;
          color: var(--text-muted);
        }

        .selected-seat-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: flex-end;
          max-width: 180px;
        }

        .seat-tag {
          font-size: 11px;
          font-weight: 700;
          background-color: var(--primary-muted);
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .total-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .total-label {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
        }

        .total-val {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary);
        }

        .checkout-btn {
          width: 100%;
          padding: 16px;
          font-size: 16px;
        }

        /* TICKET PASSES STYLING */
        .tickets-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(640px, 1fr));
          gap: 30px;
          width: 100%;
        }

        .ticket-stub {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          display: flex;
          width: 100%;
          max-width: 680px;
          min-height: 180px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          text-align: left;
          position: relative;
        }

        .ticket-main {
          flex: 1;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
        }

        .ticket-brand {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .ticket-movie-title {
          font-size: 26px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 16px;
        }

        .ticket-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .ticket-detail {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .td-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .td-val {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .ticket-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px dashed var(--border-color);
        }

        .ticket-id {
          font-size: 11px;
          color: var(--text-muted);
        }

        .ticket-stub-bar {
          width: 140px;
          border-left: 2px dashed var(--bg-base);
          background-color: rgba(26, 26, 40, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 20px;
        }

        /* Punch Holes */
        .ticket-circle-top {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bg-base);
          box-shadow: inset 0 -3px 3px rgba(0,0,0,0.2);
        }

        .ticket-circle-bottom {
          position: absolute;
          bottom: -10px;
          left: -10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bg-base);
          box-shadow: inset 0 3px 3px rgba(0,0,0,0.2);
        }

        .barcode-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          transform: rotate(90deg) translateY(-2px);
          width: 150px;
        }

        .barcode {
          width: 110px;
          height: 35px;
        }

        .barcode-number {
          font-size: 9px;
          letter-spacing: 1px;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .member-header {
            padding: 16px 20px;
            flex-direction: column;
            gap: 16px;
          }
          .catalog-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .search-box {
            width: 100%;
          }
          .movie-detail-layout {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .booking-layout {
            grid-template-columns: 1fr;
          }
          .ticket-stub {
            flex-direction: column;
          }
          .ticket-stub-bar {
            width: 100%;
            height: 90px;
            border-left: none;
            border-top: 2px dashed var(--bg-base);
          }
          .ticket-circle-top, .ticket-circle-bottom {
            display: none;
          }
          .barcode-container {
            transform: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
