import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import FormData = require('form-data');

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

    const form = new FormData();
    form.append('file', fileBuffer, {
        filename: binaryData.fileName || 'file',
        contentType: 'application/octet-stream',
    });

    const response = await apiHelper.makeRequest('POST', '/scan/sync/form', {
        body: form,
        headers: form.getHeaders(),
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
