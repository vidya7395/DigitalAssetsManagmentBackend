import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
//routes import 
import styleRoutes from "./routes/style.routes.js";
import iconRoutes from "./routes/icon.routes.js";
import projectRoutes from "./routes/project.routes.js";
import variantRoutes from "./routes/variant.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import svgToReactRoutes from "./routes/svgToReact.routes.js";
//routes declaration
// console.log("Reached here");
app.get("/", (req, res) => {
    const jsonTobeSend={
        "message":"Hello World",
        "routes": {
            "style": "/api/v1/style",
            "icon": "/api/v1/icon",
            "project": "/api/v1/project",
            "variants": "/api/v1/variants",
            "category": "/api/v1/category",
            "download": "/api/v1/download"
        }
    }
    res.send(jsonTobeSend);
});
app.use("/api/v1/style", styleRoutes);
app.use("/api/v1/icon", iconRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/variants", variantRoutes);
app.use("/api/v1/category", categoryRoutes);

// Endpoint to handle SVG to React component conversion and tar creation
app.use('/api/v1/download', svgToReactRoutes);

export { app }