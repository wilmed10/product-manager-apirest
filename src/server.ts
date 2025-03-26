// elegir arquitectura en base a lo que se desea hacer
//Jest y Supertest (Testing)

import express from "express";
import colors from "colors";
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
//leer datos de formularios
server.use(express.json())

server.use('/api/products', router)

server.use('/api', (req,res) => {
    res.json({msg: 'Desde API'})
})

export default server