import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

export class ApiHelper {
    constructor(private executeFunctions: IExecuteFunctions) { }

    async makeRequest(
        origin: string,
        body: IDataObject,
        returnBinary: boolean = false,
        itemIndex: number = 0
    ): Promise<any> {
        const credentials = await this.executeFunctions.getCredentials('attachmentAV');

        const options: any = {
            url: `https://eu.developer.attachmentav.com/v1/scan`,
            method: 'POST',
            headers: {
                'origin': origin,
                'x-api-key': credentials.apiKey,
            },
            body: {
                ...body,
                returnBinary: returnBinary ? 'true' : 'false',
            },
            json: true,
        };

        if (returnBinary) {
            options.encoding = 'arraybuffer';
        }

        return this.executeFunctions.helpers.httpRequestWithAuthentication.call(
            this.executeFunctions,
            'attachmentAV',
            options
        );
    }
}
