import { IExecuteFunctions, INodeExecutionData, IRequestOptions } from 'n8n-workflow';

export async function executeScanAUrl(
    executeFunctions: IExecuteFunctions,
    _apiHelper: any,
    itemIndex: number
): Promise<INodeExecutionData> {
    const url = executeFunctions.getNodeParameter('url', itemIndex) as string;

    // Get credentials
    const credentials = await executeFunctions.getCredentials('attachmentAVApi');

    // Make the API request
    const options: IRequestOptions = {
        method: 'POST',
        url: 'https://eu.developer.attachmentav.com/v1/scan/sync/download',
        headers: {
            'x-api-key': credentials.apiKey as string,
            'origin': 'n8n/scanAUrl',
        },
        body: {
            download_url: url,
        },
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
