import express from "express";
import cartEndPoint from "./routes/CartEndPoint.js";
import ProductViews from "./routes/ProductViews.js";
import ProductEndPoint from "./routes/ProductEndPoint.js";
import userRouter from "./routes/UserRouter.js";
import handlebars from "express-handlebars";

const port = 8081;
const app = express();
app.use(express.urlencoded({ extended: true }));

/* Starting Handlebars */
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");
/* Ending Handlebars */

app.use(express.json());
/* css */
app.use("/public", express.static("public"));
/* css */
app.use("/api/products", ProductEndPoint);
app.use("/api/carts", cartEndPoint);
app.use("/home", ProductViews);
/* Multer Start */
app.use("/api/users", userRouter);
/* Multer End*/

const connectionInstance = app.listen(port, () => {
  console.log(`Server is running on port 8081 ${port}`);
});

export default connectionInstance;
