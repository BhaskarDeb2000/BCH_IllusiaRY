import { Request, Response } from 'express';
import Item from '../models/Item';

// Get all items
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({ isActive: true });
    
    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching items'
    });
  }
};

// Get item by ID
export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching item'
    });
  }
};

// Create new item
export const createItem = async (req: Request, res: Response) => {
  try {
    // Transform frontend data format to backend model
    const itemData = {
      name: req.body.description || 'Unnamed Item',
      description: req.body.contentSummary || '',
      location: req.body.storageLocation || '',
      quantity: req.body.quantity || 1,
      tags: req.body.storageDetails ? req.body.storageDetails.split(',').map((tag: string) => tag.trim()) : [],
      isActive: true
    };
    
    const item = await Item.create(itemData);
    
    return res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error creating item:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while creating item'
    });
  }
};

// Update item
export const updateItem = async (req: Request, res: Response) => {
  try {
    // Transform frontend data format to backend model
    const itemData: any = {};
    
    if (req.body.description) itemData.name = req.body.description;
    if (req.body.contentSummary) itemData.description = req.body.contentSummary;
    if (req.body.storageLocation !== undefined) itemData.location = req.body.storageLocation;
    if (req.body.quantity) itemData.quantity = req.body.quantity;
    if (req.body.storageDetails) {
      itemData.tags = req.body.storageDetails.split(',').map((tag: string) => tag.trim());
    }
    
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      itemData,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item:', error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error while updating item'
    });
  }
};

// Delete item (soft delete by setting isActive to false)
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting item'
    });
  }
};

// Search items
export const searchItems = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const items = await Item.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(String(query), 'i')] } }
          ]
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error searching items:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while searching items'
    });
  }
}; 