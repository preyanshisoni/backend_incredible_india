import mongoose from "mongoose";
import Location from "../Models/location.model.js";
import {addLocationservice } from "../Service/locationService.js";


export const addLocation = async (req, res) => {
  try {
    const { name,description, favorite, most_visited, parent_id } = req.body;
    let picturePath = "";

    if (req.file) {
      // const fullUrl = `${req.protocol}://${req.get("host")}`;
      const fullUrl = process.env.NODE_ENV === "production"
      ? "https://incredible-backend.vercel.app"
      : `${req.protocol}://${req.get("host")}`;
      picturePath = `${fullUrl}/uploads/${req.file.filename}`;
    }

    const normalizedParentId =
      parent_id === "null" || parent_id === "" ? null : parent_id;

    const newLocation = new Location({
      name,
      description,
      favorite,
      most_visited,
      parent_id: normalizedParentId,
      picture: picturePath,
    });

    const savedLocation = await newLocation.save();

    res.status(201).json({
      ...savedLocation.toObject(),
      id: savedLocation._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};






export const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate('parent_id').exec();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getChildLocationsByParentId = async (req, res) => {
  try {
    const {id} = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid parent ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    // Find locations where parent_id matches the given parentId
    const childLocations = await Location.find({ parent_id: objectId }).populate("parent_id");

    return res.status(200).json({
      data: childLocations.length > 0 ? childLocations : [],
      message:
        childLocations.length > 0
          ? "Child locations retrieved successfully"
          : "No child locations available",
    });
  } catch (error) {
    console.error("Error in getChildLocationsByParentId:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const updateLocation = async (req, res) => {

  const { id } = req.params;
  const { name, description,favorite, most_visited, parent_id } = req.body;
  let picturePath = req.body.picture || "";

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    if (req.file) {
      const fullUrl = `${req.protocol}://${req.get("host")}`;
      picturePath = `${fullUrl}/uploads/${req.file.filename}`;
    }

    const normalizedParentId =
      parent_id === "null" || parent_id === "" ? null : parent_id;

    const updates = {
      name,
      description,
      favorite,
      most_visited,
      parent_id: normalizedParentId,
      picture: picturePath,
    };

    const updatedLocation = await Location.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({
      data: updatedLocation,
      message: "Location updated successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLocationById = async (req, res) => {

  try {
    const locationId = req.params.id;

    const location = await Location.findById(locationId).populate('parent_id');
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID Format" });
  }

  try {
    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({ message: "Location deleted sucessfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMany = async (req, res) => {
   try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Invalid or missing IDs array" });
    }
    const areIdsValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!areIdsValid) {
      return res.status(400).json({ message: "One or more IDs are invalid" });
    }


    const result = await Location.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No locations found for the provided IDs" });
    }

    res.status(200).json({
      message: "Locations deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
