import { httpServer } from "./app.js";
import connectDB from "./src/db/index.js";

const startServer = () => {
  httpServer.listen(process.env.PORT || 8080, () => {
    console.info(
      `📑 Visit the documentation at: http://localhost:${
        process.env.PORT || 8080
      }`
    );
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
};

connectDB()
  .then(() => {
    startServer();
  })
  .catch((err) => {
    console.log("Mongo db connect error: ", err);
  });
