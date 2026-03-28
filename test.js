const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voting_app').then(async () => {
    try {
        await User.create({
            aadharCardNumber: 'Admin',
            password: 'Admin@123',
            role: 'admin',
        });
        console.log("Success");
    } catch(e) {
        console.log("Creation Error:");
        console.dir(e);
    }
    process.exit(0);
}).catch(e => {
    console.log("Connection Error:", e.message);
    process.exit(1);
});
