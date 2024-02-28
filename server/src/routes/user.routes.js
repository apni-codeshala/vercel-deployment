import { Router } from "express";
import { addLocationForm, changeCurrentPassword, getAddedLocations, getAllLocationPhotos, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, singleLocation, updateAccountDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/changePassword").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/places/:id").post(verifyJWT, upload.array("photos"), addLocationForm);
router.route("/places").get(verifyJWT,getAddedLocations)
router.route("/all-location-photos").get(getAllLocationPhotos)
router.route("/place/:id").get(singleLocation)


export default router;
