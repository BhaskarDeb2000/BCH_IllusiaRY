import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Helper to determine if we should use mock data (for development)
// Default to true if the environment variable isn't set
const useMockData = process.env.REACT_APP_USE_MOCK_DATA !== "false";

// Mock storage items data imported from Backend's inventoryData.ts
const mockItems = [
  {
    _id: "1",
    name: "Military Helmets",
    description: "Sotilaskypärä x 6 musta, large",
    location: "Varastohyllyt, sisäänkäynnin puolella",
    quantity: 6,
    isActive: true,
    tags: ["military", "protective"],
    categoryId: "1",
  },
  {
    _id: "2",
    name: "Military Helmets",
    description: "Sotilaskypärä x 6 musta, 3 x large, 3 x medium",
    location: "Varastohyllyt, sisäänkäynnin puolella",
    quantity: 6,
    isActive: true,
    tags: ["military", "protective"],
    categoryId: "1",
  },
  {
    _id: "3",
    name: "Military Helmets",
    description: "Sotilaskypärä x 6 musta, small + pehmusteita",
    location: "Varastohyllyt, sisäänkäynnin puolella",
    quantity: 6,
    isActive: true,
    tags: ["military", "protective"],
    categoryId: "1",
  },
  {
    _id: "4",
    name: "Combat Vests",
    description: "Taisteluliivi x 5, musta (uusi malli), EL-nauhoilla",
    location: "Varastohyllyt, sisäänkäynnin puolella",
    quantity: 5,
    isActive: true,
    tags: ["military", "protective"],
    categoryId: "1",
  },
  {
    _id: "5",
    name: "Combat Vests",
    description:
      "Taisteluliivi x 5, musta (vanha malli) + taisteluliivi x 3, musta (kevyt), EL-nauhoilla",
    location: "Varastohyllyt, sisäänkäynnin puolella",
    quantity: 8,
    isActive: true,
    tags: ["military", "protective"],
    categoryId: "1",
  },
  {
    _id: "6",
    name: "Protective Glasses and Masks",
    description:
      "Suojalasit/-maski x 17, EL-nauhaa (2x3m, 3x2m), Molle-kiinnitteinen kännykkäpidike",
    location: "Etuvaraston perällä, musta laatikko",
    quantity: 17,
    isActive: true,
    tags: ["protective", "accessories"],
    categoryId: "1",
  },
  {
    _id: "7",
    name: "Fighter Consoles",
    description: "2 x hävittäjän Helms-konsoli, 2 x hävittäjän Weapons-konsoli",
    location: "Varastolaatikko",
    quantity: 4,
    isActive: true,
    tags: ["electronics", "props"],
    categoryId: "1",
  },
  {
    _id: "8",
    name: "Starcaller Consoles",
    description: "Starcallerin Helms- ja Weapons-konsolit",
    location: "Varastolaatikko",
    quantity: 2,
    isActive: true,
    tags: ["electronics", "props"],
    categoryId: "1",
  },
  {
    _id: "9",
    name: "Bridge Consoles",
    description: "7x bridge konsoleita",
    location: "Varastolaatikko",
    quantity: 7,
    isActive: true,
    tags: ["electronics", "props"],
    categoryId: "1",
  },
  {
    _id: "10",
    name: "Foam Fire Extinguishers",
    description: "12x vaahtosammutinta, sammutuspeite",
    location: "Etuvaraston perällä, musta laatikko",
    quantity: 12,
    isActive: true,
    tags: ["safety", "props"],
    categoryId: "1",
  },
  {
    _id: "11",
    name: "Curtain",
    description: "Tummansininen esirippu mustalla kuvioinnilla",
    location: "Takavaraston ikkunaseinällä",
    quantity: 1,
    isActive: true,
    tags: ["furniture", "decoration"],
    categoryId: "4",
  },
  {
    _id: "12",
    name: "Medical Supplies",
    description:
      "Medbay supplies / wooden crate, Bedding, curtains, meds, instruments, manuals papers",
    location: "Keskialue, alla",
    quantity: 1,
    isActive: true,
    tags: ["medical", "supplies"],
    categoryId: "3",
  },
];

// Mock get all items
const mockGetAllItems = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return [...mockItems];
};

// Mock get item by ID
const mockGetItemById = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  const item = mockItems.find((item) => item._id === id);

  if (!item) {
    throw new Error("Item not found");
  }

  return item;
};

// Mock create item
const mockCreateItem = async (itemData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newItem = {
    _id: String(mockItems.length + 1),
    name: itemData.description || "New Item",
    description: itemData.contentSummary || "",
    location: itemData.storageLocation || "",
    quantity: itemData.quantity || 1,
    isActive: true,
    tags: itemData.storageDetails
      ? itemData.storageDetails.split(",").map((tag) => tag.trim())
      : [],
    categoryId: itemData.categoryId || 1,
  };

  mockItems.push(newItem);
  return newItem;
};

// Mock update item
const mockUpdateItem = async (id, itemData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  const index = mockItems.findIndex((item) => item._id === id);

  if (index === -1) {
    throw new Error("Item not found");
  }

  // Update the item
  mockItems[index] = {
    ...mockItems[index],
    name: itemData.description || mockItems[index].name,
    description: itemData.contentSummary || mockItems[index].description,
    location: itemData.storageLocation || mockItems[index].location,
    quantity: itemData.quantity || mockItems[index].quantity,
    tags: itemData.storageDetails
      ? itemData.storageDetails.split(",").map((tag) => tag.trim())
      : mockItems[index].tags,
  };

  return mockItems[index];
};

// Mock delete item
const mockDeleteItem = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const index = mockItems.findIndex((item) => item._id === id);

  if (index === -1) {
    throw new Error("Item not found");
  }

  // Remove the item
  const deletedItem = mockItems.splice(index, 1)[0];
  return {
    success: true,
    message: "Item deleted successfully",
    item: deletedItem,
  };
};

// Get all items
export const getAllItems = async () => {
  if (useMockData) {
    return mockGetAllItems();
  }

  try {
    const response = await axios.get(`${API_URL}/items`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

// Get item by ID
export const getItemById = async (id) => {
  if (useMockData) {
    return mockGetItemById(id);
  }

  try {
    const response = await axios.get(`${API_URL}/items/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error;
  }
};

// Create item
export const createItem = async (itemData) => {
  if (useMockData) {
    return mockCreateItem(itemData);
  }

  try {
    const response = await axios.post(`${API_URL}/items`, itemData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

// Update item
export const updateItem = async (id, itemData) => {
  if (useMockData) {
    return mockUpdateItem(id, itemData);
  }

  try {
    const response = await axios.put(`${API_URL}/items/${id}`, itemData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating item with ID ${id}:`, error);
    throw error;
  }
};

// Delete item
export const deleteItem = async (id) => {
  if (useMockData) {
    return mockDeleteItem(id);
  }

  try {
    const response = await axios.delete(`${API_URL}/items/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting item with ID ${id}:`, error);
    throw error;
  }
};

// Search items
export const searchItems = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/items/search?query=${query}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error searching items with query '${query}':`, error);
    throw error;
  }
};
