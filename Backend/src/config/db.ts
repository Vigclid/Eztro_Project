import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGO_URI as string, {
      autoIndex: true,    
      maxPoolSize: 10,       
      serverSelectionTimeoutMS: 5000, 
    });

    isConnected = true;
    console.log("Connect DB Successfull ✅")
  } catch (error) {
    console.log("Error connect DB ❌")
    process.exit(1);
  }
};
