import express from "express";
import { register, login, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, downloadProfile, sendConnectionRequest, getMyConnectionsRequest, whatAreMyConnections, acceptConnectionRequest, getUserProfileAndUserBasedOnUsername, } from "../controllers/user.controller.js";
import multer from "multer"

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage});


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/update_profile_picture").post(upload.single('profile_picture'),  uploadProfilePicture)
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequest").post(getMyConnectionsRequest);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route("/user/get_profile_based_on_username").get(getUserProfileAndUserBasedOnUsername)

// router.route("/comment_post").post(commentPost);
// router.route("/get_comment_by_post").get(get_commnets_by_post);
// router.route("/delete_comment_of_user").get(delete_comment_of_user);

export default router;