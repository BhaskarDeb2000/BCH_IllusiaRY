import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Item from '../models/Item';
import connectDB from '../config/db';

// Load environment variables
dotenv.config();

// Mock items data
const mockItems = [
  {
    name: 'Projector',
    description: 'High-resolution digital projector with HDMI and VGA ports',
    location: 'Storage Room A',
    quantity: 2,
    tags: ['electronics', 'presentation', 'meetings'],
    isActive: true
  },
  {
    name: 'Folding Tables',
    description: 'Portable folding tables for events',
    location: 'Storage Room B',
    quantity: 10,
    tags: ['furniture', 'events', 'outdoor'],
    isActive: true
  },
  {
    name: 'Chairs',
    description: 'Stackable chairs for events and meetings',
    location: 'Storage Room B',
    quantity: 50,
    tags: ['furniture', 'events', 'meetings'],
    isActive: true
  },
  {
    name: 'Microphones',
    description: 'Wireless microphones with receivers',
    location: 'AV Cabinet',
    quantity: 4,
    tags: ['audio', 'events', 'presentation'],
    isActive: true
  },
  {
    name: 'Tent',
    description: 'Large outdoor tent for events',
    location: 'Outdoor Storage',
    quantity: 1,
    tags: ['outdoor', 'events', 'large'],
    isActive: true
  },
  {
    name: 'Board Games',
    description: 'Collection of board games for recreation',
    location: 'Recreation Room',
    quantity: 15,
    tags: ['games', 'recreation', 'indoor'],
    isActive: true
  },
  {
    name: 'Speakers',
    description: 'Bluetooth speakers for music',
    location: 'AV Cabinet',
    quantity: 3,
    tags: ['audio', 'electronics', 'events'],
    isActive: true
  },
  {
    name: 'Extension Cords',
    description: 'Various lengths of extension cords',
    location: 'Utility Closet',
    quantity: 8,
    tags: ['electronics', 'utility', 'events'],
    isActive: true
  },
  {
    name: 'Whiteboard',
    description: 'Portable whiteboard with stand',
    location: 'Meeting Room',
    quantity: 2,
    tags: ['presentation', 'meetings', 'office'],
    isActive: true
  },
  {
    name: 'Coffee Maker',
    description: 'Professional coffee maker for events',
    location: 'Kitchen',
    quantity: 1,
    tags: ['kitchen', 'appliance', 'events'],
    isActive: true
  },
  {
    name: 'First Aid Kit',
    description: 'Emergency first aid supplies',
    location: 'Admin Office',
    quantity: 3,
    tags: ['safety', 'emergency', 'health'],
    isActive: true
  },
  {
    name: 'Decorative Lights',
    description: 'String lights for event decoration',
    location: 'Decoration Storage',
    quantity: 6,
    tags: ['decoration', 'lights', 'events'],
    isActive: true
  }
];

// Seed database function
const seedItems = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing items
    await Item.deleteMany({});
    console.log('Items collection cleared');
    
    // Insert mock items
    const createdItems = await Item.insertMany(mockItems);
    console.log(`${createdItems.length} items created successfully`);
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error instanceof Error ? error.message : String(error)}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seeder
seedItems(); 