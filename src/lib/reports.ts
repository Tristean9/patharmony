import {ReportData, SubmitReportData} from '@/types';
import {ObjectId} from 'mongodb';
import clientPromise from './mongodb';

export async function getReportData(fromDate: string, endDate: string, processed?: boolean): Promise<ReportData[]> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<ReportData>('reports');

        const query: any = {
            date: {$gte: fromDate, $lte: endDate},
        };

        if (processed !== undefined) {
            query.processed = processed;
        }

        const reportData = await collection.find(query).toArray();
        return reportData;
    }
    catch (error) {
        console.error('Error fetching report data from MongoDB', error);
        throw new Error('Failed to fetch report data');
    }
}

export async function addReportData(newReport: SubmitReportData) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<SubmitReportData>('reports');

        const result = await collection.insertOne(newReport);
        return result;
    }
    catch (error) {
        console.error('Error adding report data to MongoDB: ', error);
        throw new Error('Failed to add report data');
    }
}

export async function updateReportData(updatedReport: ReportData) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<ReportData>('reports');

        const {reportId, guardRemark, ...reportUpdates} = updatedReport;
        const _id = new ObjectId(reportId);

        const updateOperations: any = {$set: reportUpdates};

        if (guardRemark && guardRemark.length > 0) {
            updateOperations.$push = {guardRemark: {$each: guardRemark}};
        }

        const result = await collection.updateOne(
            {_id}, // 查找report ID
            updateOperations, // 更新现有字段并追加 guardRemark
            {upsert: false} // 如果report ID 不存在，则不插入新报告
        );
        return result;
    }
    catch (error) {
        console.error('Error updating report data in MongoDB: ', error);
        throw new Error('Failed to update report data');
    }
}

export async function deleteReportData(reportId: string) {
    try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection<ReportData>('reports');
        const _id = new ObjectId(reportId);

        const result = await collection.deleteOne({_id});
        return result;
    }
    catch (error) {
        console.error('Error deleting report data from MongoDB:', error);
        throw new Error('Failed to delete report data');
    }
}
