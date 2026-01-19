import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export async function executeScanAFile(
    executeFunctions: IExecuteFunctions,
    apiHelper: any,
    itemIndex: number
): Promise<INodeExecutionData> {
    const item = executeFunctions.getInputData()[itemIndex];
    const binaryPropertyName = executeFunctions.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;

    const binaryData = item.binary?.[binaryPropertyName];
    if (!binaryData) {
        throw new Error(`Binary property "${binaryPropertyName}" not found in input data`);
    }

    const fileBuffer = await executeFunctions.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

    const response = await apiHelper.makeRequest('POST', '/scan/sync/binary', {
        body: fileBuffer,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': `${fileBuffer.length}`
        },
        json: false,
    });

    return {
        json: {
            status: response.status,
            size: response.size,
            realfiletype: response.realfiletype,
            finding: response.finding,
        },
        pairedItem: { item: itemIndex },
    };
}
