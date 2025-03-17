const { Router } = require("express");
const {
  addTest,
  updateTest,
  deleteTest,
  getAllTests,
  getATest,
} = require("../controller/testController");

const router = Router();

router.post("/add", addTest);
router.put("/update", updateTest);
router.delete("/delete", deleteTest);
router.get("/tests",getAllTests)
router.get("/test",getATest)

module.exports = router;
