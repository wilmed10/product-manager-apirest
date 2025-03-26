import { Request, Response } from "express"
import Product from "../models/Product.model"

//all interactions with the model have to use await

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.findAll({
            order: [
                ['price', 'DESC']
            ],
            attributes: {exclude: ['createdAt', 'updatedAt']}
        })
        res.json({data: products})
    } catch (error) {
        console.log(error)
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
        }

        res.json({data: product})
    } catch (error) {
        console.log(error)
    }
}

export const createProduct = async (req: Request, res: Response) => {
    //const product = new Product(req.body)
    //const savedProduct = await product.save()
    try {
        const product = await Product.create(req.body)
        res.status(201).json({data: product})
    } catch (error) {
        console.log(error)
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
        }

        //update
        await product.update(req.body)
        await product.save()
        res.json({data: product})

    } catch (error) {
        console.log(error)
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
        }

        //modify
        product.availability = !product.dataValues.availability
        await product.save()
        res.json({data: product})

    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if(!product) {
            res.status(404).json({
                error: 'Producto No Encontrado'
            })
        }

        //delete
        await product.destroy() //change for logic eliminator in case that doen´t allow delete data
        res.json({data: 'Producto Eliminado'})

    } catch (error) {
        console.log(error)
    }
}