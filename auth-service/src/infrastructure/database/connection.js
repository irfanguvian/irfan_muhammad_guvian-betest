export class Connection {
    constructor(mongoose) {
        this.mongoose = mongoose;
        this.connectDB();
    }

    connectDB() {
        this.mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Database connection successful');
        })
        .catch((error) => {
            console.error('Database connection failed:', error.message);
        });
    }

}