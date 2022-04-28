const express = require("express");
const app = express();
const fs = require("fs");
const path = "./data/tours.json";
const { v4: uuidv4 } = require("uuid");
const tours = JSON.parse(fs.readFileSync(path));

app.use(express.json()); //use this middleware to get access of req.body.


//custom middleware
app.use((req, res, next)=>{
    console.log("Hello from the middleware");
    next();
})

//another custom middleware using date and time
app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

const getTours = (req, res) => {
  //200 means okay
  res.status(200).json({
    message: "request recieved",
    status: "success",
    time: req.requestTime,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; //req.params is basically parameter which has been passed inside the req url, and it's an object.
  const tour = tours.find((el) => el.id === id);

  if (tour) {
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } else {
    res.status(404).json({
      status: "Not Found",
    });
  }
};

const createTour = (req, res) => {
  const newId = uuidv4();
  const newTour = Object.assign({ id: newId }, req.body); //Object.assign basically creates a new object

  tours.push(newTour);

  fs.writeFile(path, JSON.stringify(tours), (error) => {
    if (error) res.status(404).send(error);
    //201 means created
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });
};

const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: "Not found",
      message: "invalid id",
    });
  }

  res.status(200).json({
    status: "success",
    message: "<Updated>",
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({
      status: "Not found",
      message: "invalid id",
    });
  } else {
    const newTour = tours.filter((el) => el.id != id);

    res.status(204).json({
      status: "deleted",
      data: {
        newTour,
      },
    });
  }
};

//Getting data from database
// app.get("/api/v1/tours", getTours);

//Getting tour by id
// app.get("/api/v1/tours/:id", getTour);

//Posting data to the database
// app.post("/api/v1/tours", createTour );

//Patch array
// app.patch('/api/v1/tours/:id', updateTour);

//Delete element from array
// app.delete('/api/v1/tours/:id', deleteTour );

app.route("/api/v1/tours").get(getTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log("listening....");
});
