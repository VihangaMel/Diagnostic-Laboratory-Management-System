const { Router } = require("express");
const {
  registerPatient,
  updatePatient,
  deletePatient,
  getAllPatients,
  getOnePatient,
} = require("../controller/patientController");
const auth = require("../middlewares/auth");

const router = Router();

router.post("/register", registerPatient);
router.put("/update", updatePatient);
router.put("/me/update",auth, updatePatient);
router.delete("/delete", deletePatient);
router.delete("/me/delete",auth, deletePatient);
router.get("/me",auth,);
router.get("/patients", getAllPatients);
router.get("/patient", getOnePatient);
router.get("/forgot-password", getOnePatient);
router.get("/reset-password", getOnePatient);

module.exports = router;
