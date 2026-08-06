import React, { useState, useEffect } from 'react';
import { 
  getFilms, saveFilm, deleteFilm, 
  getTheaters, saveTheater, deleteTheater, 
  getShowtimes, saveShowtime, deleteShowtime, 
  getBookings 
} from '../utils/data';

export default function AdminDashboard({ user, onSignOut, showToast }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'movies', 'theaters', 'showtimes'
  
  // Data States
  const [films, setFilms] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modal States
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [movieForm, setMovieForm] = useState({ id: '', title: '', genre: '', duration: '', rating: '', description: '', poster: '' });

  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [theaterForm, setTheaterForm] = useState({ id: '', name: '', rows: 8, cols: 10 });

  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [showtimeForm, setShowtimeForm] = useState({ id: '', filmId: '', theaterId: '', dateTime: '', price: '' });

  // Load datasets on mount and update
  const refreshData = () => {
    setFilms(getFilms());
    setTheaters(getTheaters());
    setShowtimes(getShowtimes());
    setBookings(getBookings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Summary Metrics
  const totalFilms = films.length;
  const totalTheaters = theaters.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Movie Handlers
  const handleMovieSubmit = (e) => {
    e.preventDefault();
    if (!movieForm.title || !movieForm.genre || !movieForm.duration || !movieForm.rating) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    saveFilm({
      ...movieForm,
      poster: movieForm.poster || 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80'
    });
    showToast(movieForm.id ? 'Film updated successfully!' : 'Film added successfully!', 'success');
    setIsMovieModalOpen(false);
    setMovieForm({ id: '', title: '', genre: '', duration: '', rating: '', description: '', poster: '' });
    refreshData();
  };

  const handleEditMovie = (film) => {
    setMovieForm(film);
    setIsMovieModalOpen(true);
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Are you sure you want to delete this film? This will also delete all associated showtimes.')) {
      deleteFilm(id);
      showToast('Film deleted successfully!', 'success');
      refreshData();
    }
  };

  // Theater Handlers
  const handleTheaterSubmit = (e) => {
    e.preventDefault();
    if (!theaterForm.name || theaterForm.rows <= 0 || theaterForm.cols <= 0) {
      showToast('Please provide a valid name and seat configuration', 'error');
      return;
    }
    saveTheater({
      ...theaterForm,
      rows: parseInt(theaterForm.rows),
      cols: parseInt(theaterForm.cols)
    });
    showToast(theaterForm.id ? 'Theater updated successfully!' : 'Theater added successfully!', 'success');
    setIsTheaterModalOpen(false);
    setTheaterForm({ id: '', name: '', rows: 8, cols: 10 });
    refreshData();
  };

  const handleEditTheater = (theater) => {
    setTheaterForm(theater);
    setIsTheaterModalOpen(true);
  };

  const handleDeleteTheater = (id) => {
    if (window.confirm('Are you sure you want to delete this theater? This will also delete all associated showtimes.')) {
      deleteTheater(id);
      showToast('Theater deleted successfully!', 'success');
      refreshData();
    }
  };

  // Showtime Handlers
  const handleShowtimeSubmit = (e) => {
    e.preventDefault();
    if (!showtimeForm.filmId || !showtimeForm.theaterId || !showtimeForm.dateTime || !showtimeForm.price) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    saveShowtime({
      ...showtimeForm,
      price: parseFloat(showtimeForm.price)
    });
    showToast(showtimeForm.id ? 'Showtime updated!' : 'Showtime created!', 'success');
    setIsShowtimeModalOpen(false);
    setShowtimeForm({ id: '', filmId: '', theaterId: '', dateTime: '', price: '' });
    refreshData();
  };

  const handleDeleteShowtime = (id) => {
    if (window.confirm('Are you sure you want to delete this showtime? Associated bookings will be cancelled.')) {
      deleteShowtime(id);
      showToast('Showtime deleted!', 'success');
      refreshData();
    }
  };

  return (
    <div className="admin-layout">
      {/* Header Bar */}
      <header className="admin-header">
        <div className="header-top-row container">
          <div className="logo-section">
            <span className="logo font-serif">CINÉVAULT</span>
          </div>
          <div className="user-section">
            <span className="badge badge-admin">ADMIN</span>
            <button className="btn-signout" onClick={onSignOut}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="admin-main container">
        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">FILMS</span>
            <span className="stat-value">{totalFilms}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">THEATERS</span>
            <span className="stat-value">{totalTheaters}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">CONFIRMED BOOKINGS</span>
            <span className="stat-value">{confirmedBookings}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">REVENUE</span>
            <span className="stat-value font-mono">${totalRevenue.toFixed(2)}</span>
          </div>
        </section>

        {/* Tab Navigation (Placed below metrics and above main content block) */}
        <div className="tabs-container">
          <nav className="tab-navigation">
            <button 
              className={`tab-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-link ${activeTab === 'movies' ? 'active' : ''}`}
              onClick={() => setActiveTab('movies')}
            >
              Movies
            </button>
            <button 
              className={`tab-link ${activeTab === 'theaters' ? 'active' : ''}`}
              onClick={() => setActiveTab('theaters')}
            >
              Theaters
            </button>
            <button 
              className={`tab-link ${activeTab === 'showtimes' ? 'active' : ''}`}
              onClick={() => setActiveTab('showtimes')}
            >
              Showtimes
            </button>
          </nav>
        </div>

        {/* Tab Contents */}
        <section className="tab-content">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="card fade-in">
              <h2 className="section-title font-serif">Recent Confirmed Bookings</h2>
              {bookings.length === 0 ? (
                <div className="empty-state">No bookings confirmed yet.</div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>User</th>
                        <th>Film</th>
                        <th>Seats Booked</th>
                        <th>Total Price</th>
                        <th>Booking Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice().reverse().map(booking => {
                        const show = showtimes.find(s => s.id === booking.showtimeId);
                        const film = show ? films.find(f => f.id === show.filmId) : null;
                        return (
                          <tr key={booking.id}>
                            <td className="font-mono" style={{ color: 'var(--primary)' }}>{booking.id}</td>
                            <td>{booking.userName}</td>
                            <td>{film ? film.title : 'Deleted Movie'}</td>
                            <td>
                              <div className="seat-pills">
                                {booking.seats.map(s => <span key={s} className="seat-pill">{s}</span>)}
                              </div>
                            </td>
                            <td className="font-mono">${booking.totalPrice.toFixed(2)}</td>
                            <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td>
                              <span className={`status-pill ${booking.status.toLowerCase()}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MOVIES TAB */}
          {activeTab === 'movies' && (
            <div className="card fade-in">
              <div className="section-header">
                <h2 className="section-title font-serif">Films</h2>
                <button className="btn btn-primary" onClick={() => {
                  setMovieForm({ id: '', title: '', genre: '', duration: '', rating: '', description: '', poster: '' });
                  setIsMovieModalOpen(true);
                }}>
                  + Add Film
                </button>
              </div>

              {films.length === 0 ? (
                <div className="empty-state">No movies added. Add your first film!</div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Genre</th>
                        <th>Duration</th>
                        <th>Rating</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {films.map(film => (
                        <tr key={film.id}>
                          <td>
                            <div className="film-info-cell">
                              <img src={film.poster} alt={film.title} className="table-poster-thumb" />
                              <span className="film-title-text">{film.title}</span>
                            </div>
                          </td>
                          <td>{film.genre}</td>
                          <td>{film.duration}</td>
                          <td>
                            <span className="rating-tag">{film.rating}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="action-button-group">
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditMovie(film)}>
                                Edit
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMovie(film.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* THEATERS TAB */}
          {activeTab === 'theaters' && (
            <div className="card fade-in">
              <div className="section-header">
                <h2 className="section-title font-serif">Theaters</h2>
                <button className="btn btn-primary" onClick={() => {
                  setTheaterForm({ id: '', name: '', rows: 8, cols: 10 });
                  setIsTheaterModalOpen(true);
                }}>
                  + Add Theater
                </button>
              </div>

              {theaters.length === 0 ? (
                <div className="empty-state">No theaters registered. Add one to screen movies!</div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Layout (Rows x Columns)</th>
                        <th>Total Capacity</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theaters.map(theater => (
                        <tr key={theater.id}>
                          <td className="table-main-title">{theater.name}</td>
                          <td>{theater.rows} rows × {theater.cols} columns</td>
                          <td className="font-mono">{theater.totalSeats} seats</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="action-button-group">
                              <button className="btn btn-secondary btn-sm" onClick={() => handleEditTheater(theater)}>
                                Edit
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTheater(theater.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SHOWTIMES TAB */}
          {activeTab === 'showtimes' && (
            <div className="card fade-in">
              <div className="section-header">
                <h2 className="section-title font-serif">Showtimes</h2>
                <button className="btn btn-primary" onClick={() => {
                  if (films.length === 0 || theaters.length === 0) {
                    showToast('Please ensure you have at least one Film and Theater created first!', 'error');
                    return;
                  }
                  setShowtimeForm({ id: '', filmId: films[0].id, theaterId: theaters[0].id, dateTime: '', price: 12.00 });
                  setIsShowtimeModalOpen(true);
                }}>
                  + Add Showtime
                </button>
              </div>

              {showtimes.length === 0 ? (
                <div className="empty-state">No showtimes scheduled. Link films and theaters here!</div>
              ) : (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Movie</th>
                        <th>Theater</th>
                        <th>Date & Time</th>
                        <th>Ticket Price</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showtimes.map(show => {
                        const film = films.find(f => f.id === show.filmId);
                        const theater = theaters.find(t => t.id === show.theaterId);
                        return (
                          <tr key={show.id}>
                            <td className="table-main-title">{film ? film.title : 'Deleted Film'}</td>
                            <td>{theater ? theater.name : 'Deleted Theater'}</td>
                            <td>{new Date(show.dateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td>
                            <td className="font-mono">${show.price.toFixed(2)}</td>
                            <td style={{ textAlign: 'right' }}>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteShowtime(show.id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </section>
      </main>

      {/* MOVIE FORM MODAL */}
      {isMovieModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="font-serif" style={{ fontSize: '20px' }}>{movieForm.id ? 'Edit Film' : 'Add New Film'}</h3>
              <button className="modal-close" onClick={() => setIsMovieModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleMovieSubmit}>
              <div className="form-group">
                <label className="form-label">Film Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  placeholder="e.g. Neon Frontier"
                  required
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Genre *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={movieForm.genre}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    placeholder="e.g. Sci-Fi"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Duration *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    placeholder="e.g. 142m"
                    required
                  />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Rating *</label>
                  <select 
                    className="form-control"
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    required
                  >
                    <option value="">Select Rating</option>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Poster URL (Optional)</label>
                  <input 
                    type="url" 
                    className="form-control" 
                    value={movieForm.poster}
                    onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
                    placeholder="https://example.com/poster.jpg"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  placeholder="Enter a brief plot summary..."
                  rows="3"
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: '1' }}>Save Film</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsMovieModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* THEATER FORM MODAL */}
      {isTheaterModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="font-serif" style={{ fontSize: '20px' }}>{theaterForm.id ? 'Edit Theater' : 'Add New Theater'}</h3>
              <button className="modal-close" onClick={() => setIsTheaterModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleTheaterSubmit}>
              <div className="form-group">
                <label className="form-label">Theater Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={theaterForm.name}
                  onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
                  placeholder="e.g. IMAX Screen 3"
                  required
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Rows (A-Z) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={theaterForm.rows}
                    onChange={(e) => setTheaterForm({ ...theaterForm, rows: parseInt(e.target.value) || '' })}
                    min="1"
                    max="20"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Columns (Seats per row) *</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={theaterForm.cols}
                    onChange={(e) => setTheaterForm({ ...theaterForm, cols: parseInt(e.target.value) || '' })}
                    min="1"
                    max="20"
                    required
                  />
                </div>
              </div>
              <div className="seat-preview-note">
                Total seat capacity will be: <strong className="font-mono">{(theaterForm.rows || 0) * (theaterForm.cols || 0)}</strong> seats
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: '1' }}>Save Theater</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsTheaterModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHOWTIME FORM MODAL */}
      {isShowtimeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="font-serif" style={{ fontSize: '20px' }}>Schedule Showtime</h3>
              <button className="modal-close" onClick={() => setIsShowtimeModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleShowtimeSubmit}>
              <div className="form-group">
                <label className="form-label">Select Film *</label>
                <select 
                  className="form-control"
                  value={showtimeForm.filmId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, filmId: e.target.value })}
                  required
                >
                  {films.map(f => <option key={f.id} value={f.id}>{f.title} ({f.rating})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Theater *</label>
                <select 
                  className="form-control"
                  value={showtimeForm.theaterId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, theaterId: e.target.value })}
                  required
                >
                  {theaters.map(t => <option key={t.id} value={t.id}>{t.name} (Max {t.totalSeats} seats)</option>)}
                </select>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Date & Time *</label>
                  <input 
                    type="datetime-local" 
                    className="form-control" 
                    value={showtimeForm.dateTime}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, dateTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ticket Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={showtimeForm.price}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, price: e.target.value })}
                    placeholder="12.50"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: '1' }}>Schedule</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsShowtimeModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-layout {
          min-height: 100vh;
          background-color: var(--bg-base);
          display: flex;
          flex-direction: column;
        }

        .admin-header {
          background-color: var(--bg-surface);
          border-bottom: 1px solid var(--border-color);
        }

        .header-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 40px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          font-size: 28px;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 3px;
        }

        .badge {
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .badge-admin {
          background-color: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .btn-signout {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: color var(--transition-fast);
          padding: 6px 12px;
        }

        .btn-signout:hover {
          color: var(--text-main);
        }

        .admin-main {
          flex: 1;
          padding-top: 40px;
          padding-bottom: 60px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: linear-gradient(145deg, #12121C 0%, #0F0F17 100%);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal), border-color var(--transition-fast);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-color-hover);
        }

        .stat-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 48px;
          font-weight: 700;
          color: var(--primary);
          line-height: 1.1;
        }

        .tabs-container {
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 40px;
          padding-bottom: 1px;
        }

        .tab-navigation {
          display: flex;
          gap: 48px;
        }

        .tab-link {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 500;
          padding-bottom: 16px;
          cursor: pointer;
          position: relative;
          transition: color var(--transition-fast);
          margin-bottom: -1px;
        }

        .tab-link:hover {
          color: var(--text-main);
        }

        .tab-link.active {
          color: var(--primary);
          font-weight: 600;
        }

        .tab-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--primary);
          border-radius: 2px 2px 0 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 600;
          text-align: left;
        }

        .empty-state {
          padding: 60px;
          color: var(--text-secondary);
          font-size: 15px;
          text-align: center;
        }

        .film-info-cell {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .film-title-text {
          font-weight: 600;
          font-size: 18px;
          color: var(--text-main);
        }

        .table-poster-thumb {
          width: 75px;
          height: 105px;
          object-fit: cover;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          transition: transform var(--transition-normal);
        }

        tr:hover .table-poster-thumb {
          transform: scale(1.04);
        }

        .rating-tag {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .custom-table th {
          background-color: var(--bg-surface);
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
        }

        .custom-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-main);
          background-color: rgba(18, 18, 28, 0.4);
          font-size: 16px;
          vertical-align: middle;
        }

        .action-button-group {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .action-button-group .btn-sm {
          padding: 8px 16px;
          font-size: 13px;
          border-radius: var(--radius-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action-button-group .btn-secondary {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .action-button-group .btn-secondary:hover {
          border-color: var(--primary);
          color: var(--primary);
          background-color: var(--primary-muted);
        }

        .action-button-group .btn-danger {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .action-button-group .btn-danger:hover {
          border-color: var(--danger);
          color: var(--danger);
          background-color: rgba(231, 76, 60, 0.08);
        }

        .seat-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          max-width: 200px;
        }

        .seat-pill {
          font-size: 11px;
          font-weight: 600;
          background-color: var(--primary-muted);
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .status-pill {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .status-pill.confirmed {
          background-color: rgba(46, 204, 113, 0.1);
          color: var(--success);
          border: 1px solid var(--success);
        }

        .status-pill.cancelled {
          background-color: rgba(231, 76, 60, 0.1);
          color: var(--danger);
          border: 1px solid var(--danger);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .seat-preview-note {
          background-color: rgba(210, 154, 46, 0.05);
          border: 1px dashed var(--primary);
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 12px;
          text-align: center;
        }

        .fade-in {
          animation: fadeIn 0.25s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .admin-header {
            padding: 16px 20px;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .tab-navigation {
            gap: 16px;
          }
          .tab-link {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
