const { Router } = require("express");
const patientRoutes = require("./patientRoutes");
const staffRoutes = require("./staffRoutes");
const doctorRoutes = require("./doctorRoutes");
const testRoutes = require("./testRoutes");
const testSampleRoutes = require("./testSampleRoutes");

const router = Router();

router.use("/patient", patientRoutes);
router.use("/staff", staffRoutes);
router.use("/doctor", doctorRoutes);
router.use("/test",testRoutes)
router.use("/test-sample",testSampleRoutes)

module.exports = router;
