import { IExecuteFunctions, INodeExecutionData, IRequestOptions } from 'n8n-workflow';

export async function executeScanAFile(
    executeFunctions: IExecuteFunctions,
    _apiHelper: any,
    itemIndex: number
): Promise<INodeExecutionData> {
    const item = executeFunctions.getInputData()[itemIndex];
    const binaryPropertyName = executeFunctions.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string;
    
    // Get binary data from the input
    const binaryData = item.binary?.[binaryPropertyName];
    if (!binaryData) {
        throw new Error(`Binary property "${binaryPropertyName}" not found in input data`);
    }

    // Get credentials
    const credentials = await executeFunctions.getCredentials('attachmentAVApi');

    // Convert binary data to buffer
    const fileBuffer = Buffer.from(binaryData.data, 'base64');

    // Prepare multipart/form-data request
    const formData: any = {
        file: {
            value: fileBuffer,
            options: {
                filename: binaryData.fileName || 'file',
                contentType: binaryData.mimeType || 'application/octet-stream',
            },
        },
    };

    // Make the API request
    const options: IRequestOptions = {
        method: 'POST',
        url: 'https://eu.developer.attachmentav.com/v1/scan/sync/form',
        headers: {
            'x-api-key': credentials.apiKey as string,
            'origin': 'n8n/scanAFile',
        },
        formData,
        json: true,
    };

    const response = await executeFunctions.helpers.request(options);

    // Return the response with the expected output fields
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
