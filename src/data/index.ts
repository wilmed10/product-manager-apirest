import { exit } from 'node:process' //for stop nodejs code
import db from '../config/db'

const clearDB = async () => {
    try {
        await db.sync({force: true})
        console.log('datos eliminados correctamente')
        exit(0) //end properly
    } catch (error) {
        console.log(error)
        exit(1) //end with errors
    }
}
if(process.argv[2] === '--clear') {
    clearDB()
}