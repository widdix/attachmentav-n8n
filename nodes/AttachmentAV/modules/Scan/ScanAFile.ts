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

    const fileName = binaryData.fileName || 'file';
    const mimeType = binaryData.mimeType || 'application/octet-stream';
    const boundary = `----n8nFormBoundary${Date.now()}`;
    const preamble =
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
        `Content-Type: ${mimeType}\r\n\r\n`;
    const closing = `\r\n--${boundary}--\r\n`;
    const bodyBuffer = Buffer.concat([
        Buffer.from(preamble, 'utf8'),
        fileBuffer,
        Buffer.from(closing, 'utf8'),
    ]);

    const response = await apiHelper.makeRequest('POST', '/scan/sync/form', {
        body: bodyBuffer,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': bodyBuffer.length.toString(),
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
