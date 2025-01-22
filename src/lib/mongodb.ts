import {MongoClient} from 'mongodb';

const isProduction = process.env.NODE_ENV === 'production';
const maxPoolSize = isProduction ? 50 : 5; // 生产环境连接池较大，开发环境较小

const client = new MongoClient(process.env.MONGODB_URI as string, {
    maxPoolSize: maxPoolSize, // 设置连接池大小
    socketTimeoutMS: 30000,
    serverSelectionTimeoutMS: 5000,
});

let clientPromise: Promise<MongoClient>;

clientPromise = client.connect().catch(error => {
    console.error('MongoDB connection failed:', error); // 捕获连接错误
    throw error; // 重新抛出错误，防止继续执行后续代码
});

export default clientPromise;
