const { Router } = require("express");
const { addSample,updateSample,getAllTestSamples,getTestSamplesByPatient } = require("../controller/testSampleController");

const router = Router();

router.post("/add", addSample);
router.put("/update",updateSample);
router.get("/test-samples",getAllTestSamples);
router.get("/test-samples-by-patient/",getTestSamplesByPatient);

module.exports = router;
