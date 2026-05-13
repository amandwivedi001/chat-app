import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`\n Mongoose connected !!! DB Host 
            ${conn.connection.host}`
        );

    } catch (error) {
        console.error("Database connection error");
        process.exit(1);
    }
}

export default connectdb;