const Car = require("../models/car");

exports.createCar = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const car = new Car({
    name: req.body.name,
    make: req.body.make,
    model: req.body.model,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  car
    .save()
    .then(createdCar => {
      res.status(201).json({
        message: "Car added successfully",
        car: createdCar
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a car failed!",
        error: error
      });
    });
};

exports.updateCar = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const car = new Car({
    _id: req.body.id,
    name: req.body.name,
    make: req.body.make,
    model: req.body.model,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Car.updateOne({ _id: req.params.id, creator: req.userData.userId }, car)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate car!",
        error: error
      });
    });
};

exports.getCars = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const carQuery = Car.find();
  let fetchedCars;
  if (pageSize && currentPage) {
    carQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  carQuery
    .then(documents => {
      fetchedCars = documents;
      return Car.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Cars fetched successfully!",
        cars: fetchedCars,
        maxCars: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching cars failed!"
      });
    });
};

exports.getCar = (req, res, next) => {
  Car.findById(req.params.id)
    .then(car => {
      if (car) {
        res.status(200).json(car);
      } else {
        res.status(404).json({ message: "Car not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching car failed!"
      });
    });
};

exports.deleteCar = (req, res, next) => {
  Car.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting cars failed!"
      });
    });
};
