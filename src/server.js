import express from "express"
import dotenv from "dotenv"
import indexRouter from "./routers/index.js"
import errorHandler from "./utils/errorHandler.js"
import logger from "./utils/logger.js"
dotenv.config({ quiet: true })

const PORT = process.env.PORT

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", indexRouter.authRouter)

app.use(indexRouter.staffRouter)
app.use(indexRouter.transportRouter)
app.use(indexRouter.branchRouter)
app.use(indexRouter.adminRouter)
app.use(indexRouter.permissionRouter)

app.use(errorHandler)

app.listen(PORT, ()=>logger.info(`Server is running on port ${PORT}`))