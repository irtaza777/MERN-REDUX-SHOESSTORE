const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize express app and Prisma client
const app = express();
const prisma = new PrismaClient();
const jwtkey = "shoestore";

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dtjgspe71',
  api_key: '479751656152939',
  api_secret: 'OjUmVkaHK7Fr6rf3fvFAuCo8GcA',
  secure: true,
});

// Multer storage configuration
const upload = require('./upload');

// Add a new category
app.post('/AdminPanel/AddCategory', async (req, res) => {
  const { name } = req.body;

  // Validate that the category name is present
  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    return res.status(400).json({ message: 'Category name must be a non-empty string with at least 3 characters.' });
  }

  try {
    const newCategory = await prisma.category.create({
      data: { name: name.trim() } // Trim any leading/trailing whitespace
    });
    res.status(201).json(newCategory); // Successfully created the category
  } catch (error) {
    console.error('Error creating category:', error);

    // Handle unique constraint violation error (category already exists)
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    // Handle any other errors
    res.status(500).json({ message: 'An error occurred while creating the category.' });
  }
});

// Backend route for fetching all categories
app.get('/AdminPanel/AllCategories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).send('An error occurred while fetching categories.');
  }
});

// Update an existing category by ID
app.put('/AdminPanel/UpdateCategory/:id', async (req, res) => {
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
app.delete('/AdminPanel/DeleteCategory/:id', async (req, res) => {
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

// POST endpoint to add a new brand
app.post('/AdminPanel/Brands', upload.single('logo'), async (req, res) => {
  const { name } = req.body;
  let logoUrl;

  try {
    // Validation for brand name length
    if (!name || name.length < 3 || name.length > 50) {
      return res.status(400).json({ message: 'Brand name must be between 3 and 50 characters.' });
    }

    // Check for existing brand with the same name
    const existingBrand = await prisma.brand.findUnique({
      where: { name },
    });

    if (existingBrand) {
      return res.status(400).json({ message: 'Brand name must be unique. This name already exists.' });
    }

    // Handle file upload logic
    if (req.file) {
      // Validate file type (ensure it is an image)
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.' });
      }

      // Upload logo to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      logoUrl = result.secure_url;
    }

    // Create new brand in the database
    const newBrand = await prisma.brand.create({
      data: {
        name,
        imageUrl: logoUrl, // Store the logo URL
      },
    });

    res.status(201).json({ message: 'Brand added successfully!', brand: newBrand });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Failed to add brand', error: error.message });
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

// Create an order
app.post('/orders', async (req, res) => {
  const { userId, cartItems } = req.body;

  try {
    // Create a new order
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'pending',
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            sizeId: item.sizeId,
            quantity: item.quantity
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

// User registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while registering the user');
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id }, jwtkey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while logging in');
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
