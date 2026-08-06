// LocalStorage keys
const KEYS = {
  USERS: 'cinevault_users',
  FILMS: 'cinevault_films',
  THEATERS: 'cinevault_theaters',
  SHOWTIMES: 'cinevault_showtimes',
  BOOKINGS: 'cinevault_bookings',
  CURRENT_USER: 'cinevault_current_user'
};

// Initial mock data
const INITIAL_USERS = [
  {
    id: 'u-1',
    name: 'Nandini Administrator',
    email: 'admin@cinevault.com',
    password: 'admin',
    role: 'admin'
  },
  {
    id: 'u-2',
    name: 'Jane Doe',
    email: 'member@cinevault.com',
    password: 'member',
    role: 'member'
  }
];

const INITIAL_FILMS = [
  {
    id: 'f-1',
    title: 'Neon Frontier',
    genre: 'Sci-Fi',
    duration: '142m',
    rating: 'PG',
    description: 'A group of explorers venture into the outer reaches of the galaxy, discovering an ancient neon metropolis that holds the key to humanity\'s survival.',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80' // Cyberpunk neon art
  },
  {
    id: 'f-2',
    title: 'The Venetian Heist',
    genre: 'Thriller',
    duration: '118m',
    rating: 'R',
    description: 'An elite team of art thieves plans their final, most audacious heist during the glamorous Venice Carnivale.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' // Grand architecture/ Venice
  },
  {
    id: 'f-3',
    title: 'Amber Ash',
    genre: 'Drama',
    duration: '126m',
    rating: 'PG',
    description: 'A heartwarming and gripping story of a family trying to rebuild their lives in a forgotten mining town.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80' // Cinematic retro camera / drama feel
  },
  {
    id: 'f-4',
    title: 'The Laughing Comedy',
    genre: 'Comedy',
    duration: '95m',
    rating: 'PG',
    description: 'Two rival comedians are forced to share a tour bus, leading to chaotic and hysterical adventures across the country.',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80' // Theater stage/ comedy lights
  },
  {
    id: 'f-5',
    title: 'Deep Abyss',
    genre: 'Action',
    duration: '134m',
    rating: 'PG-13',
    description: 'A deep-sea research submarine crew discovers a prehistoric threat slumbering beneath the Mariana Trench.',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' // Ocean deep/ blue
  },
  {
    id: 'f-6',
    title: 'Shadow Whisperer',
    genre: 'Horror',
    duration: '110m',
    rating: 'R',
    description: 'A paranormal investigator discovers a dark presence lurking in her family\'s ancestral gothic estate.',
    poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80' // Dark haunted vibe
  }
];

const INITIAL_THEATERS = [
  {
    id: 't-1',
    name: 'Grand Screen 1',
    rows: 8,
    cols: 10,
    totalSeats: 80
  },
  {
    id: 't-2',
    name: 'Dolby Atmos 3D',
    rows: 6,
    cols: 8,
    totalSeats: 48
  },
  {
    id: 't-3',
    name: 'Lux VIP Suite',
    rows: 4,
    cols: 6,
    totalSeats: 24
  }
];

// Helper to get formatted dates
const getDateOffset = (days, hours, mins) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hours, mins, 0, 0);
  return d.toISOString();
};

const INITIAL_SHOWTIMES = [
  {
    id: 's-1',
    filmId: 'f-1', // Neon Frontier
    theaterId: 't-1', // Grand Screen 1
    dateTime: getDateOffset(0, 18, 0), // Today 6:00 PM
    price: 12.50
  },
  {
    id: 's-2',
    filmId: 'f-1', // Neon Frontier
    theaterId: 't-1',
    dateTime: getDateOffset(0, 21, 30), // Today 9:30 PM
    price: 14.00
  },
  {
    id: 's-3',
    filmId: 'f-2', // The Venetian Heist
    theaterId: 't-2', // Dolby Atmos
    dateTime: getDateOffset(0, 19, 0), // Today 7:00 PM
    price: 15.00
  },
  {
    id: 's-4',
    filmId: 'f-3', // Cinder Ash
    theaterId: 't-3', // VIP Suite
    dateTime: getDateOffset(1, 16, 0), // Tomorrow 4:00 PM
    price: 25.00
  },
  {
    id: 's-5',
    filmId: 'f-4', // The Laughing
    theaterId: 't-2',
    dateTime: getDateOffset(1, 14, 30), // Tomorrow 2:30 PM
    price: 10.00
  },
  {
    id: 's-6',
    filmId: 'f-5', // Deep Abyss
    theaterId: 't-1',
    dateTime: getDateOffset(1, 20, 0), // Tomorrow 8:00 PM
    price: 13.00
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'b-1',
    userId: 'u-2', // Jane Doe
    userName: 'Jane Doe',
    showtimeId: 's-1', // Neon Frontier at 6:00 PM Today
    seats: ['C-4', 'C-5'],
    totalPrice: 25.00,
    bookingDate: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    status: 'Confirmed'
  },
  {
    id: 'b-2',
    userId: 'u-2', // Jane Doe
    userName: 'Jane Doe',
    showtimeId: 's-3', // The Venetian Heist at 7:00 PM Today
    seats: ['D-6'],
    totalPrice: 15.00,
    bookingDate: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    status: 'Confirmed'
  }
];

// Database initialization
export const initDB = () => {
  const DB_VERSION_KEY = 'cinevault_db_version';
  const CURRENT_VERSION = 'v1.2';
  
  if (localStorage.getItem(DB_VERSION_KEY) !== CURRENT_VERSION) {
    localStorage.removeItem(KEYS.USERS);
    localStorage.removeItem(KEYS.FILMS);
    localStorage.removeItem(KEYS.THEATERS);
    localStorage.removeItem(KEYS.SHOWTIMES);
    localStorage.removeItem(KEYS.BOOKINGS);
    localStorage.setItem(DB_VERSION_KEY, CURRENT_VERSION);
  }

  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(KEYS.FILMS)) {
    localStorage.setItem(KEYS.FILMS, JSON.stringify(INITIAL_FILMS));
  }
  if (!localStorage.getItem(KEYS.THEATERS)) {
    localStorage.setItem(KEYS.THEATERS, JSON.stringify(INITIAL_THEATERS));
  }
  if (!localStorage.getItem(KEYS.SHOWTIMES)) {
    localStorage.setItem(KEYS.SHOWTIMES, JSON.stringify(INITIAL_SHOWTIMES));
  }
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
};

// Generic helper methods
const getItems = (key) => {
  initDB();
  return JSON.parse(localStorage.getItem(key)) || [];
};

const setItems = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

// Films CRUD
export const getFilms = () => getItems(KEYS.FILMS);
export const saveFilm = (film) => {
  const films = getFilms();
  if (film.id) {
    const index = films.findIndex(f => f.id === film.id);
    if (index !== -1) {
      films[index] = film;
    }
  } else {
    film.id = 'f-' + Date.now();
    films.push(film);
  }
  setItems(KEYS.FILMS, films);
  return film;
};
export const deleteFilm = (id) => {
  const films = getFilms().filter(f => f.id !== id);
  setItems(KEYS.FILMS, films);
  
  // Cascade delete showtimes associated with this film
  const showtimes = getShowtimes().filter(s => s.filmId !== id);
  setItems(KEYS.SHOWTIMES, showtimes);
};

// Theaters CRUD
export const getTheaters = () => getItems(KEYS.THEATERS);
export const saveTheater = (theater) => {
  const theaters = getTheaters();
  theater.totalSeats = theater.rows * theater.cols;
  if (theater.id) {
    const index = theaters.findIndex(t => t.id === theater.id);
    if (index !== -1) {
      theaters[index] = theater;
    }
  } else {
    theater.id = 't-' + Date.now();
    theaters.push(theater);
  }
  setItems(KEYS.THEATERS, theaters);
  return theater;
};
export const deleteTheater = (id) => {
  const theaters = getTheaters().filter(t => t.id !== id);
  setItems(KEYS.THEATERS, theaters);

  // Cascade delete showtimes
  const showtimes = getShowtimes().filter(s => s.theaterId !== id);
  setItems(KEYS.SHOWTIMES, showtimes);
};

// Showtimes CRUD
export const getShowtimes = () => getItems(KEYS.SHOWTIMES);
export const saveShowtime = (showtime) => {
  const showtimes = getShowtimes();
  if (showtime.id) {
    const index = showtimes.findIndex(s => s.id === showtime.id);
    if (index !== -1) {
      showtimes[index] = showtime;
    }
  } else {
    showtime.id = 's-' + Date.now();
    showtimes.push(showtime);
  }
  setItems(KEYS.SHOWTIMES, showtimes);
  return showtime;
};
export const deleteShowtime = (id) => {
  const showtimes = getShowtimes().filter(s => s.id !== id);
  setItems(KEYS.SHOWTIMES, showtimes);

  // Cascade cancel bookings for this showtime
  const bookings = getBookings().map(b => {
    if (b.showtimeId === id) {
      return { ...b, status: 'Cancelled' };
    }
    return b;
  });
  setItems(KEYS.BOOKINGS, bookings);
};

// Bookings CRUD
export const getBookings = () => getItems(KEYS.BOOKINGS);
export const addBooking = (booking) => {
  const bookings = getBookings();
  booking.id = 'b-' + Date.now();
  booking.bookingDate = new Date().toISOString();
  booking.status = 'Confirmed';
  bookings.push(booking);
  setItems(KEYS.BOOKINGS, bookings);
  return booking;
};

// Auth methods
export const getUsers = () => getItems(KEYS.USERS);
export const registerUser = (name, email, password, role = 'member') => {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  const newUser = {
    id: 'u-' + Date.now(),
    name,
    email: email.toLowerCase(),
    password,
    role
  };
  users.push(newUser);
  setItems(KEYS.USERS, users);
  return newUser;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem(KEYS.CURRENT_USER)) || null;
};

export const logoutUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};
