// elegir arquitectura en base a lo que se desea hacer
//Jest y Supertest (Testing)

import express from "express";
import colors from "colors";
import cors, {CorsOptions} from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express"
import swaggerSpec from "./config/swagger";
import router from "./router";
import db from "./config/db";

// connect to DB
export async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        //console.log( colors.magenta('Conexión establecida con la DB'))
    } catch (error) {
        console.log(error)
        console.log( colors.red.bold('Error al conectar a la DB'))
    }
}
connectDB()

//instancia de express
const server = express()

//permitir conexiones
const corsOptions : CorsOptions = {
    /* who send the petition, allow or block conection */
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL ){
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions))

//leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

// API Docs
server.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec) )

export default server