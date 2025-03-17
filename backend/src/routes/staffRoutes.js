const { Router } = require("express");
const {
  registerStaff,
  loginStaff,
  updateStaff,
  deleteStaff,
  getStaffMemberById,
  getAllStaff,
  getOneStaff,
  staffCount,
  sentResetPasswordCode,
  resetPassword,

} = require("../controller/staffController");
const auth = require("../middlewares/auth");

const router = Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.put("/update", updateStaff);
router.put("/me/update", updateStaff);
router.delete("/delete", deleteStaff);
router.delete("/me/delete", deleteStaff);
router.get("/me",auth, getStaffMemberById);
router.get("/staff", getAllStaff);
router.get("/staffer", getOneStaff);
router.get("/staff-count", staffCount);
router.post("/forgot-password", sentResetPasswordCode);
router.post("/reset-password", auth, resetPassword);

module.exports = router;
