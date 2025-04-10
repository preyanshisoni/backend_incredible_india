
import mongoose from "mongoose";
import { required } from "react-admin";
export const PlaceImageSchema = new mongoose.Schema({
  place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true }, // Reference to Place
  pictures: { type: [String], required:true },
  // pictures: [
  //   {
  //     src: { type: String, required: true },
  //     title: { type: String, required: true },
  //   }
  // ],
}, { timestamps: true });

const PlaceImage = mongoose.model('PlaceImage', PlaceImageSchema);
export default PlaceImage;
