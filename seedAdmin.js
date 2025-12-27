// Seed script to create first admin user
// Run with: node seedAdmin.js
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/mernAuth'
mongoose.connect(MONGODB_URI)

const User = require('./models/user')

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.username)
      process.exit(0)
    }

    // Hash the password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('admin123', saltRounds)

    // Create admin user
    const admin = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    })

    await admin.save()
    console.log('✅ Admin user created successfully!')
    console.log('   Username: admin')
    console.log('   Password: admin123')
    console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  }
}

seedAdmin()
