export class Connection {
    constructor(mongoose, redis) {
        this.mongoose = mongoose;
        this.redis = redis;
        this.connectDB();
        const connectRedis = this.connectRedis()
        this.clientRedis = connectRedis
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

    connectRedis() {
        const { createClient } = this.redis;
        const client = createClient(
            {
                password: process.env.REDIS_PASSWORD,
                socket: {
                    host: process.env.REDIS_URL,
                    port: process.env.REDIS_PORT,
                }
            }
        );
        client.connect()
        .then(() => {
            console.log('Database redis connection successful');
        })
        .catch((error) => {
            console.error('Database redis connection failed:', error.message);
        });

        return client
    }

}