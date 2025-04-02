import express from "express";
import upload from "../upload.js";

import {addPalace, deletepalaceById, getListByCategoryId, getListByCityId, getpalaceById, getPlaces, Search, updatePlace } from "../Controller/placeController.js";
import { deletenearByPlaceById, getListNearByPlaces , getNearbyPlaces, NearbyPlace, nearByPlaceById, updateNearByplaceData } from "../Controller/nearByplaceController.js";

const router = express.Router();



// Near By routes :-
router.post('/addnearby',NearbyPlace);
router.get('/getall',getListNearByPlaces);


router.get('/get/:place_id', getNearbyPlaces); // here we pass the place_id and will get  all the nearByPlace.

router.get('/nearby_places/:id',nearByPlaceById) // here we pass the id and will get the data of that id.

router.put('/updatenearby/:id',updateNearByplaceData);

router.delete('/deletnearby/:id',deletenearByPlaceById);

// ---------places Routes---------------
router.get('/getbycityid/:locationId',getListByCityId);
router.get('/getbycategoryid/:category_id',getListByCategoryId) // here we pass the Categoryid and will get the all places match with id.
router.get('/search',Search);
router.post('/', upload.array('pictures', 10), addPalace);

router.get('/', getPlaces);

router.put('/:id', upload.array('pictures', 10), updatePlace);
router.get('/:id',getpalaceById);
router.delete('/:id',deletepalaceById);
export default router;
