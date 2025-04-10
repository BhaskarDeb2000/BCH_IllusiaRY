import axios from "axios";
import { API_BASE_URL, USE_MOCK_DATA } from "../config";

const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;

// Mock booking data for development
const mockBookings = [
  {
    _id: "b1",
    item: {
      _id: "1",
      contentSummary: "Military Helmets",
      description: "Sotilaskypärä x 6 musta, large",
      storageLocation: "Varastohyllyt, sisäänkäynnin puolella",
      quantity: 6,
    },
    startDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    quantity: 2,
    purpose: "For cosplay event",
    status: "active",
  },
  {
    _id: "b2",
    item: {
      _id: "4",
      contentSummary: "Combat Vests",
      description: "Taisteluliivi x 5, musta (uusi malli), EL-nauhoilla",
      storageLocation: "Varastohyllyt, sisäänkäynnin puolella",
      quantity: 5,
    },
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    quantity: 3,
    purpose: "For training session",
    status: "completed",
  },
  {
    _id: "b3",
    item: {
      _id: "6",
      contentSummary: "Protective Glasses and Masks",
      description:
        "Suojalasit/-maski x 17, EL-nauhaa (2x3m, 3x2m), Molle-kiinnitteinen kännykkäpidike",
      storageLocation: "Etuvaraston perällä, musta laatikko",
      quantity: 17,
    },
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    quantity: 5,
    purpose: "For photoshoot",
    status: "cancelled",
  },
];

// Mock get user bookings
const mockGetUserBookings = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockBookings];
};

// Mock create booking
const mockCreateBooking = async (bookingData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newBooking = {
    _id: `b${mockBookings.length + 1}`,
    item: {
      _id: bookingData.itemId,
      contentSummary: "New Booked Item",
      description: "Automatically created from booking",
      storageLocation: "Storage",
    },
    startDate: new Date(bookingData.startDate),
    endDate: new Date(bookingData.endDate),
    quantity: bookingData.quantity,
    purpose: bookingData.purpose,
    status: "active",
  };

  mockBookings.push(newBooking);
  return newBooking;
};

// Mock cancel booking
const mockCancelBooking = async (bookingId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const index = mockBookings.findIndex((booking) => booking._id === bookingId);

  if (index === -1) {
    throw new Error("Booking not found");
  }

  // Update the booking status
  mockBookings[index].status = "cancelled";
  return mockBookings[index];
};

// Get all bookings for the current user
export const getUserBookings = async () => {
  if (USE_MOCK_DATA) {
    return mockGetUserBookings();
  }

  try {
    const response = await axios.get(`${BOOKINGS_ENDPOINT}/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  if (USE_MOCK_DATA) {
    return mockCreateBooking(bookingData);
  }

  try {
    const response = await axios.post(BOOKINGS_ENDPOINT, bookingData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  if (USE_MOCK_DATA) {
    return mockCancelBooking(bookingId);
  }

  try {
    const response = await axios.put(
      `${BOOKINGS_ENDPOINT}/${bookingId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
};
