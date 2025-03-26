import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)
        //not expect
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })
    it('should validate that the price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Pantalla 4k',
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        //not expect
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })
    it('should validate that the price is greater than 0 and a number', async () => {
        const response = await request(server).post('/api/products').send({
            name: 'Pantalla 4k',
            price: "prueba"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        //not expect
        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(5)
    })

    it('should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            "name": "Mouse - Testing",
            "price": 70
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
        //not expect
        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('GET /api/products', () => {
    it('should check if api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    it('GET a JSON response with products', async () => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        //not expect
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto No Encontrado')
    })

    it('should check a valid ID in te URL', async () => {
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('get a JSON response dor a single product', async () => {
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    it('should check a valid ID in te URL', async () => {
        const response = await request(server).put('/api/products/not-valid-url')
                                .send({
                                    name: "pnatalla LED",
                                    availability: true,
                                    price: 300
                                })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('should display validation error messages when updatinf a product', async() => {
        const response = await request(server).put('/api/products/1').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()   //have to contain something
        expect(response.body.errors).toHaveLength(5)
        //not expect
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should validate that the prices is greater than 0', async() => {
        const response = await request(server).put('/api/products/1')
                                .send({
                                    name: "pnatalla LED",
                                    availability: true,
                                    price: 0
                                })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no valido')
        //not expect
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should return a 404 response for a non-existent product', async() => {
        const productId = 5000
        const response = await request(server).put(`/api/products/${productId}`)
                                .send({
                                    name: "pnatalla LED",
                                    availability: true,
                                    price: 300
                                })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')
        //not expect
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an exisiting product with valid data', async() => {
        const response = await request(server).put(`/api/products/1`)
                                .send({
                                    name: "pnatalla LED",
                                    availability: true,
                                    price: 300
                                })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        //not expect
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 5000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')
        //not expect
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)
        //not expect
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no valido')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 5000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')
        //not expect
        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')
        //not expect
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
    })
})