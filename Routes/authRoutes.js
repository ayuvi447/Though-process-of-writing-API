import express from 'express';
import multer from 'multer';
import { isAuth } from '../middlewares/isAuth.js';
import {
  register,
  login,
  getUsers,
  logOutUser,
  updateProfile,
  deleteUser,
  forgetPassword,
  changePassword,
} from '../controllers/authControllers.js';

import { upload } from '../middlewares/multer.js';

const Router = express.Router();

// Multer storage setup niche ka setup h normal localstorage m save krne k
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Make sure this folder exists
//   },
//   filename: (req, file, cb) => {
//     const suffix = Date.now();
//     cb(null, suffix + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });




//ab hm save krenge mongo db mai to hm ky krege ki req.file m ek buffer name ka chij aata h jisme ki photo ka buffer hota h mtlb ki 0 and 1 formate k data hota hai us buffer value ko hi save krdete h string base64 m convert krke







// Use multer middleware only for register route
Router.post('/register', upload.single('photo'), register); // "photo" is the key of form-data file
Router.post('/login', login);
Router.get('/getusers', isAuth, getUsers);
Router.post('/logout', isAuth, logOutUser);
Router.post('/updateprofile', isAuth, updateProfile);
Router.delete('/deleteuser', isAuth, deleteUser);
Router.post('/forgetpassword', forgetPassword);
Router.post('/changepassword', isAuth, changePassword);

export default Router;
