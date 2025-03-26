import  { Router } from 'express'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from './handlers/product'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()

// Routing
router.get('/', getProducts )
// dynamic routing for ID Search's
router.get('/:id', 
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    getProductById 
)

router.post('/', 
    //validate
    body('name')
        .notEmpty().withMessage('Nombre de producto no puede estar vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('Precio de producto no puede estar vacio')
        .custom(value=>value>0).withMessage('Precio no valido'),
    handleInputErrors,
    createProduct
)

//reemplaza TODO el elemento con lo que se envia - ACTUALIZAR
router.put('/:id', 
    param('id').isInt().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('Nombre de producto no puede estar vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('Precio de producto no puede estar vacio')
        .custom(value=>value>0).withMessage('Precio no valido'),
    body('availability')
        .isBoolean().withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    updateProduct
)

//reemplaza TSOLO lo que se envia - MODIFICAR
router.patch('/:id', 
    param('id').isInt().withMessage('ID no valido'), 
    handleInputErrors,
    updateAvailability
)

router.delete('/:id', 
    param('id').isInt().withMessage('ID no valido'),
    handleInputErrors,
    deleteProduct
)

export default router;