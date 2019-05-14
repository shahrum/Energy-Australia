const express = require("express");

const CarController = require("../controllers/cars");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, CarController.createCar);

router.put("/:id", checkAuth, extractFile, CarController.updateCar);

router.get("", CarController.getCars);

router.get("/:id", CarController.getCar);

router.delete("/:id", checkAuth, CarController.deleteCar);

module.exports = router;
