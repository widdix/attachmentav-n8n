import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeScanAUrl(
    executeFunctions: IExecuteFunctions,
    apiHelper: any,
    itemIndex: number
): Promise<INodeExecutionData> {
    const url = executeFunctions.getNodeParameter('url', itemIndex) as string;

    const response = await apiHelper.makeRequest('POST', '/scan/sync/download', {
        body: {
            download_url: url,
        },
        json: true,
    });

    return {
        json: response,
        pairedItem: { item: itemIndex },
    };
}
