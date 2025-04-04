import mongoose from "mongoose";

export const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description:{
    type:String
    },

    favorite: {
      type:Boolean,
      default:false
    },


    most_visited: {
      type:Boolean,
      default:false
    },
    picture: {
      type: String,
      required: false
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      default: null,
    },
  },
{ timestamps: true }
);

const Location = mongoose.model('Location', LocationSchema);

export default Location;
