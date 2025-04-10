const express = require("express");
const swaggerUi = require("swagger-ui-express");
const app = express();
const port = 3000;

// Your Swagger definition
const swaggerDocument = require("./swagger.json");

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// A sample API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Swagger API!" });
});

// New signup API endpoint
app.post("/api/signup", (req, res) => {
  // This is a mock response
  const { email, username, password } = req.body;

  // Normally you would validate inputs and save to a database
  // For demo purposes, we'll just echo back some data with a success message
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: Math.floor(Math.random() * 1000) + 1,
      username,
      email,
      createdAt: new Date().toISOString(),
    },
    token: "mock-jwt-token-" + Math.random().toString(36).substring(2, 15),
  });
});

app.listen(port, () => {
  console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
  console.log(`Server running on port ${port}`);
});
