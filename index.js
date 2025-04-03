  import express from "express";
  import dotenv from "dotenv";
  import cors from "cors";
  import { connectDB } from "./DB/db.js";
  import locationRoutes from "./Routes/locationRoutes.js";
  import categoryRoutes from "./Routes/categoryRoutes.js";
  import placeRoutes from "./Routes/placesRoutes.js";
  import transportRoutes from "./Routes/transportRoutes.js";
  import locationTransportRoutes from "./Routes/LocationTransportRoutes.js";
  import imageUploadRoutes from "./Routes/imageUploadRoutes.js"
  import SearchRouter from "./Routes/SearchRoutes.js";
  import multer from "multer";
  import path from "path";
  import { fileURLToPath } from "url";
//  import { createServer } from "@vercel/node";



  dotenv.config();
  const app = express();
  app.use(cors());

  const upload =  multer();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use("/admin", express.static(path.join(__dirname, "admin-panel/build")));
  app.use("/static", express.static(path.join(__dirname, "admin-panel/build/static")));
  app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin-panel/build", "index.html"));
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.use(cors({ origin: ["http://localhost:3000","https://frontend-incredible-india.vercel.app/"] }));
  app.use("/uploads", express.static("uploads"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const PORT = process.env.PORT;
  connectDB();

  app.use(express.json());
  app.use(cors());

  app.use("/ckeditor",imageUploadRoutes);
  app.use("/locations", locationRoutes);
  app.use("/categories", upload.none(), categoryRoutes);
  app.use("/places", placeRoutes);
  app.use("/transport", upload.none(), transportRoutes);
  app.use("/locationtransport", upload.none(), locationTransportRoutes);
  app.use("/search",SearchRouter);



  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


  export default app;
