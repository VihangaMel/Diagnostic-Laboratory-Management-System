const { Router } = require("express");
const {
  doctorRegister,
  doctorLogin,
  doctorUpdate,
  doctorDelete,
  getDoctorById,
  getAllDoctors,
  getOneDoctor,
  doctorCount,
  sentResetPasswordCode,
  resetPassword,
  doctorUpdateByToken,
  doctorDeleteByToken,
} = require("../controller/doctorController");
const auth = require("../middlewares/auth");

const router = Router();

router.post("/register", doctorRegister);
router.post("/login", doctorLogin);
router.put("/update", doctorUpdate);
router.put("/me/update", auth, doctorUpdateByToken);
router.delete("/delete", doctorDelete);
router.delete("/me/delete",auth, doctorDeleteByToken);
router.get("/me", auth, getDoctorById);
router.get("/doctor", getOneDoctor);
router.get("/doctors", getAllDoctors);
router.get("/doctor-count", doctorCount);
router.post("/forgot-password", sentResetPasswordCode);
router.post("/reset-password", auth, resetPassword);

module.exports = router;
