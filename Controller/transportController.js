import mongoose from "mongoose";

// import Transport from "../Models/Transport.model.js";
import Transport from "../Models/transport.model.js"

export const addtransport = async (req, res) => {
  try {
    const newCategory = new Transport(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const gettransport = async (req, res) => {
  try {
    const transport = await Transport.find().populate("place_id");
    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatetransport = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const updatedtransport = await Transport.findByIdAndUpdate(id, updates);

    if (!updatedtransport) {
      return res.status(404).json({ message: "transport not found" });
    }
    res
      .status(201)
      .json({
        data: updatedtransport,
        message: "transport update sucessfully",
      });
  } catch (err) {
    res.status(400).json({ message: "error.message" });
  }
};

export const gettransportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ data: [], message: "Invalid place_id" });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const transport = await Transport.find({ place_id: objectId });

    return res.status(200).json({
      data: transport.length > 0 ? transport : [],
      message:
        transport.length > 0
          ? "Transport data retrieved successfully"
          : "No transport available",
    });
  } catch (error) {
    console.error("Error in gettransportById:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const deletetransportById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID Format" });
  }

  try {
    const deletetransport = await Transport.findByIdAndDelete(id);

    if (!deletetransport) {
      return res.status(404).json({ message: "transport not found" });
    }

    res.status(200).json({ message: "transport deleted sucessfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
