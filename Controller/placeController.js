import mongoose from "mongoose";
import { Place } from "../Models/place.model.js";
import Location, { LocationSchema } from "../Models/location.model.js";
import PlaceImage from "../Models/PlaceImages.model.js";
import Category, { CategorySchema } from "../Models/category.model.js";
export const addPalace = async (req, res) => {
  try {
    // const fullUrl = `${req.protocol}://${req.get("host")}`;
    const fullUrl = process.env.NODE_ENV === "production"
    ? "https://incredible-backend.vercel.app"
    : `${req.protocol}://${req.get("host")}`;

    const fixString = (str) => (str ? str.replace(/^"|"$/g, "") : null);

    const fixObjectId = (id) =>
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(id)
        : null;

    const location_id = fixObjectId(req.body.location_id);
    const category_id = fixObjectId(req.body.category_id);

    if (!location_id || !category_id) {
      return res
        .status(400)
        .json({
          message:
            "Location ID and Category ID are required and must be valid ObjectIds.",
        });
    }

    const picturePaths = req.files
      ? req.files.map((file) => `${fullUrl}/uploads/${file.filename}`)
      : [];

    const tags = req.body.tags
      ? Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags]
      : [];

    const newPlace = new Place({
      name: fixString(req.body.name),
      description: fixString(req.body.description),
      location_id,
      category_id,
      tags,
      video: fixString(req.body.video),
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
      contact_info: JSON.parse(req.body.contact_info || "{}"),
      opening_hours: JSON.parse(req.body.opening_hours || "[]"),
    });

    const savedPlace = await newPlace.save();

    const newPlaceImage = new PlaceImage({
      place_id: savedPlace._id,
      pictures: picturePaths,
    });

    const savedPlaceImage = await newPlaceImage.save();

    savedPlace.image_id = savedPlaceImage._id;
    await savedPlace.save();

    res.status(200).json({
      data: savedPlace,
      message: "Place and image created successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getPlaces = async (req, res) => {
  try {
    const palace = await Place.find().populate([
      { path: "location_id" },
      { path: "category_id" },
      { path: "image_id" },
    ]);
    res.json(palace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListByCityId = async (req, res) => {
  try {
    const { locationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(locationId)) {
      return res.status(400).json({ message: "Invalid location ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(locationId);
    const places = await Place.find({ location_id: objectId }).populate([
      { path: "location_id" },
      { path: "category_id" },
      { path: "image_id" },
    ]);
    return res.status(200).json({
      data: places.length > 0 ? places : [],
      message:
        places.length > 0
          ? "Places data retrieved successfully"
          : "No places available",
    });
  } catch (error) {
    console.error("Error in : getListByCityId", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const updatePlace = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const {
      name,
      description,
      location_id,
      category_id,
      tags,
      video,
      latitude,
      longitude,
      contact_info,
      opening_hours,
    } = req.body;

    const fullUrl = `${req.protocol}://${req.get("host")}`;
    const picturePaths =
      req.files?.map((file) => `${fullUrl}/uploads/${file.filename}`) || [];

    const updates = {
      name,
      description,
      location_id,
      category_id,
      tags,
      pictures: picturePaths,
      video,
      latitude,
      longitude,
      contact_info,
      opening_hours,
    };

    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );
    const updatedPlace = await Place.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res
      .status(200)
      .json({ data: updatedPlace, message: "Place updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getpalaceById = async (req, res) => {
  try {
    const palaceId = req.params.id;

    const palace = await Place.findById(palaceId).populate([
      { path: "location_id" },
      { path: "category_id" },
      { path: "image_id" },
    ]);
    res.status(200).json(palace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletepalaceById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID Format" });
  }

  try {
    const deletepalace = await Place.findByIdAndDelete(id);

    if (!deletepalace) {
      return res.status(404).json({ message: "palace not found" });
    }

    res.status(200).json({ message: "palace deleted sucessfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const Search = async (req, res) => {
  try {
    const { search, locations, categories, cities } = req.query;

    if (req.query.filter === "most_visited") {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.location_id.most_visited
      );
    }

    if (req.query.filter === "favorite") {
      filteredPlaces = filteredPlaces.filter(
        (place) => place.location_id.favorite
      );
    }

    let filter = {};

    if (!search && !locations && !categories && !cities) {
      return res.json([]);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [search] } },
      ];
    }

    if (locations) {
      const locationArray = locations.split(",");

      const citiesInStates = await Location.find(
        { parent_id: { $in: locationArray } },
        { _id: 1 }
      );

      const cityIds = citiesInStates.map((city) => city._id.toString());
      filter.location_id = { $in: [...locationArray, ...cityIds] };
    }

    if (cities) {
      const cityArray = cities.split(",");
      filter.location_id = { $in: cityArray };
    }

    if (categories) {
      const categoryArray = categories.split(",");
      filter.category_id = { $in: categoryArray };
    }
    const places = await Place.find(filter).populate(
      "location_id category_id image_id"
    );
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: "Error fetching places", error });
  }
};

export const getListByCategoryId = async (req, res) => {
  try {
    const {category_id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(category_id)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(category_id);
    const places = await Place.find({ category_id: objectId }).populate([
      { path: "location_id" },
      { path: "category_id" },
      { path: "image_id" },
    ]);
    return res.status(200).json({
      data: places.length > 0 ? places : [],
      message:
        places.length > 0
          ? "Places data retrieved successfully"
          : "No places available",
    });
  } catch (error) {
    console.error("Error in : getListByCityId", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};