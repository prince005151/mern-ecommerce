import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"
import { connectDB } from "./lib/db.js";

//routes importing
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoute from "./routes/payment.route.js"
import analyticsRoute from "./routes/analytics.route.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());

// Content Security Policy middleware
app.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' http://localhost:5173 https://api.stripe.com ws: wss:; frame-src 'self' https://js.stripe.com;"
	);
	next();
});

//important to write as it is to remove cors error
app.use(cors({
	origin: 'http://localhost:5173', // only allow this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],        // restrict allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // restrict headers
	credentials: true 
}))

//api Endpoint
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupon", couponRoutes)
app.use("/api/payment", paymentRoute)
app.use("/api/analytics", analyticsRoute)




 
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.use("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	connectDB()
});

 