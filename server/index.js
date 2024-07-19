const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  destroyReservation,
  fetchReservations,
} = require("./db");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    console.log(error);
  }
});
app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(
      await createReservation({
        date: req.body.date,
        party_count: req.body.party_count,
        restaurant_id: req.body.restaurant_id,
        customer_id: req.params.customer_id,
      })
    );
  } catch (error) {
    console.log(error);
  }
});
app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservation({
        id: req.params.id,
        customer_id: req.params.customer_id,
      });
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
    }
  }
);
app.use((error, req, res, next) => {
  res.status(error.status || 500).send({ error: error });
});

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("created tables");
  const [Patrick, Paul, Barcadia, Dorsia] = await Promise.all([
    createCustomer({ name: "Patrick" }),
    createCustomer({ name: "Paul" }),
    createRestaurant({ name: "Barcadia" }),
    createRestaurant({ name: "Dorsia" }),
  ]);
  console.log(await fetchCustomers());
  console.log(await fetchRestaurants());
  const [reservation, reservation2] = await Promise.all([
    createReservation({
      date: "07/10/2024",
      party_count: "2",
      restaurant_id: Barcadia.id,
      customer_id: Patrick.id,
    }),
    createReservation({
      date: "07/8/2024",
      party_count: "2",
      restaurant_id: Dorsia.id,
      customer_id: Paul.id,
    }),
  ]);
  console.log(await fetchReservations());
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
init();
