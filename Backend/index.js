const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

// Initialize express app and Prisma client
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Routes

// Add a new category
app.post('/AddCategory', async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).send('Category name is required');
    }
  
    try {
      const newCategory = await prisma.category.create({
        data: { name }
      });
      res.status(201).json(newCategory);
    } catch (error) {
      console.error(error);
      if (error.code === 'P2002') {
        res.status(409).send('Category name must be unique');
      } else {
        res.status(500).send('An error occurred while creating the category');
      }
    }
  });
  
// Update an existing category by ID
app.put('/UpdateCategory/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).send('Category name is required');
    }
  
    try {
      const updatedCategory = await prisma.category.update({
        where: { id: parseInt(id) }, // Convert id to an integer
        data: { name }
      });
      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        res.status(404).send('Category not found');
      } else if (error.code === 'P2002') {
        res.status(409).send('Category name must be unique');
      } else {
        res.status(500).send('An error occurred while updating the category');
      }
    }
  });
  
// Delete a category by ID
app.delete('/DeleteCategory/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedCategory = await prisma.category.delete({
        where: { id: parseInt(id) }, // Convert id to an integer
      });
      res.status(200).json({ message: 'Category deleted successfully', deletedCategory });
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        res.status(404).send('Category not found');
      } else {
        res.status(500).send('An error occurred while deleting the category');
      }
    }
  });
  
// Add a new product
app.post('/products', async (req, res) => {
    const { name, description, price, imageUrl, stock, categoryId, brandId, sizes, colors } = req.body;
  
    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          imageUrl,
          stock,
          category: { connect: { id: categoryId } },
          brand: { connect: { id: brandId } },
          sizes: { connect: sizes.map(size => ({ id: size })) }, // Assuming ShoeSize records already exist
          colors: { connect: colors.map(color => ({ id: color })) } // Assuming Color records already exist
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while adding the product');
    }
  });
  
  // Get all products
  app.get('/products', async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        include: { category: true, brand: true, sizes: true, colors: true }, // Including related data
      });
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the products');
    }
  });
  
  // Update a product by ID
  app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl, stock, categoryId, brandId, sizes, colors } = req.body;
  
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          price,
          imageUrl,
          stock,
          category: { connect: { id: categoryId } },
          brand: { connect: { id: brandId } },
          sizes: { set: sizes.map(size => ({ id: size })) }, // Reset and set new sizes
          colors: { set: colors.map(color => ({ id: color })) } // Reset and set new colors
        },
      });
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while updating the product');
    }
  });
  
  // Delete a product by ID
  app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while deleting the product');
    }
  });
// Add an item to the cart
app.post('/cart', async (req, res) => {
    const { userId, productId, sizeId, quantity } = req.body;
  
    try {
      // Check if the user already has a cart
      let cart = await prisma.cart.findUnique({
        where: { userId }
      });
  
      if (!cart) {
        // Create a new cart if it doesn't exist
        cart = await prisma.cart.create({
          data: {
            userId,
          }
        });
      }
  
      // Add the item to the cart
      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          sizeId,
          quantity
        }
      });
  
      res.status(201).json(cartItem);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while adding the item to the cart');
    }
  });
  
  // Get all items in the user's cart
  app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: parseInt(userId) },
        include: {
          items: {
            include: {
              product: true,
              size: true
            }
          }
        }
      });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the cart');
    }
  });
  
  // Update quantity of an item in the cart
  app.put('/cart/:cartItemId', async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
  
    try {
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: parseInt(cartItemId) },
        data: { quantity }
      });
  
      res.status(200).json(updatedCartItem);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while updating the cart item');
    }
  });
  
  // Delete an item from the cart
  app.delete('/cart/:cartItemId', async (req, res) => {
    const { cartItemId } = req.params;
  
    try {
      await prisma.cartItem.delete({
        where: { id: parseInt(cartItemId) }
      });
  
      res.status(200).json({ message: 'Item deleted from cart' });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while deleting the item from the cart');
    }
  });
  
  // Clear the entire cart for a user
  app.delete('/cart/clear/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: parseInt(userId) }
      });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
  
      res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while clearing the cart');
    }
  });
  // Create an order
app.post('/order', async (req, res) => {
    const { userId, items, total, status = 'pending' } = req.body;
  
    try {
      const order = await prisma.order.create({
        data: {
          userId,
          total,
          status,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              sizeId: item.sizeId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });
  
      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while creating the order');
    }
  });
  
  // Get all orders for a user
  app.get('/orders/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const orders = await prisma.order.findMany({
        where: { userId: parseInt(userId) },
        include: {
          items: {
            include: {
              product: true,
              size: true
            }
          }
        }
      });
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the orders');
    }
  });
  
  // Get a specific order
  app.get('/order/:orderId', async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          items: {
            include: {
              product: true,
              size: true
            }
          }
        }
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the order');
    }
  });
  
  // Update an order status
  app.put('/order/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    try {
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status }
      });
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while updating the order');
    }
  });
  
  // Delete an order
  app.delete('/order/:orderId', async (req, res) => {
    const { orderId } = req.params;
  
    try {
      await prisma.order.delete({
        where: { id: parseInt(orderId) }
      });
  
      res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while deleting the order');
    }
  });
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
