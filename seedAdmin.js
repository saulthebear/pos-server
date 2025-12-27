// Seed script to create initial data for dettiPOS
// Run with: node seedAdmin.js
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/mernAuth'
mongoose.connect(MONGODB_URI)

const User = require('./models/user')
const Category = require('./models/category')
const Product = require('./models/product')

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n')

    // ========== SEED ADMIN USER ==========
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.username)
    } else {
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash('admin123', saltRounds)

      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      })

      await admin.save()
      console.log('✅ Admin user created!')
      console.log('   Username: admin')
      console.log('   Password: admin123')
      console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!\n')
    }

    // ========== SEED CATEGORIES ==========
    const existingCategories = await Category.countDocuments()
    if (existingCategories > 0) {
      console.log(`✅ Categories already exist (${existingCategories} found)\n`)
    } else {
      const categories = [
        { name: 'Beverages', color: '#3B82F6' },    // Blue
        { name: 'Food', color: '#EF4444' },         // Red
        { name: 'Snacks', color: '#F59E0B' },       // Amber
        { name: 'Desserts', color: '#EC4899' },     // Pink
        { name: 'Breakfast', color: '#10B981' },    // Green
      ]

      await Category.insertMany(categories)
      console.log(`✅ Created ${categories.length} categories\n`)
    }

    // ========== SEED PRODUCTS ==========
    const existingProducts = await Product.countDocuments()
    if (existingProducts > 0) {
      console.log(`✅ Products already exist (${existingProducts} found)\n`)
    } else {
      // Get category IDs for product references
      const beverages = await Category.findOne({ name: 'Beverages' })
      const food = await Category.findOne({ name: 'Food' })
      const snacks = await Category.findOne({ name: 'Snacks' })
      const desserts = await Category.findOne({ name: 'Desserts' })
      const breakfast = await Category.findOne({ name: 'Breakfast' })

      const products = [
        // Beverages
        { code: 'BEV001', name: 'Coffee - Regular', price: 2.50, category: beverages._id },
        { code: 'BEV002', name: 'Coffee - Large', price: 3.50, category: beverages._id },
        { code: 'BEV003', name: 'Latte', price: 4.50, category: beverages._id },
        { code: 'BEV004', name: 'Orange Juice', price: 3.00, category: beverages._id },
        { code: 'BEV005', name: 'Bottled Water', price: 1.50, category: beverages._id },

        // Food
        { code: 'FOOD001', name: 'Sandwich - Turkey', price: 7.99, category: food._id },
        { code: 'FOOD002', name: 'Sandwich - Veggie', price: 6.99, category: food._id },
        { code: 'FOOD003', name: 'Salad - Caesar', price: 8.99, category: food._id },
        { code: 'FOOD004', name: 'Soup - Tomato', price: 5.99, category: food._id },

        // Snacks
        { code: 'SNK001', name: 'Chips - Regular', price: 1.99, category: snacks._id },
        { code: 'SNK002', name: 'Chips - BBQ', price: 1.99, category: snacks._id },
        { code: 'SNK003', name: 'Granola Bar', price: 2.49, category: snacks._id },
        { code: 'SNK004', name: 'Mixed Nuts', price: 3.99, category: snacks._id },

        // Desserts
        { code: 'DST001', name: 'Chocolate Chip Cookie', price: 2.99, category: desserts._id },
        { code: 'DST002', name: 'Brownie', price: 3.49, category: desserts._id },
        { code: 'DST003', name: 'Muffin - Blueberry', price: 3.99, category: desserts._id },

        // Breakfast
        { code: 'BRK001', name: 'Bagel with Cream Cheese', price: 4.99, category: breakfast._id },
        { code: 'BRK002', name: 'Croissant', price: 3.99, category: breakfast._id },
        { code: 'BRK003', name: 'Breakfast Burrito', price: 6.99, category: breakfast._id },
      ]

      await Product.insertMany(products)
      console.log(`✅ Created ${products.length} sample products\n`)
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`   - Users: ${await User.countDocuments()}`)
    console.log(`   - Categories: ${await Category.countDocuments()}`)
    console.log(`   - Products: ${await Product.countDocuments()}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
