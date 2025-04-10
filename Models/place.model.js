import mongoose from "mongoose";
import { required } from "react-admin";

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PlaceImage'},
  tags: { type: [String] },
  video: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  contact_info: { type: Object },
  opening_hours: { type: Object },
}, { timestamps: true });

const Place = mongoose.model('Place',PlaceSchema);
const NearbyPlaces = new mongoose.Schema(
  {
    place_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
    nearbyplace_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true,
    },
     distance_km: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const nearbyplace = mongoose.model('nearbyplace', NearbyPlaces);

export {Place,nearbyplace}