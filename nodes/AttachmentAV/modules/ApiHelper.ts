import { IExecuteFunctions, IDataObject } from 'n8n-workflow';

export class ApiHelper {
    constructor(private executeFunctions: IExecuteFunctions) { }

    async makeRequest(
        method: string,
        endpoint: string,
        options: any = {},
    ): Promise<any> {
        const credentials = await this.executeFunctions.getCredentials('attachmentAVApi');

        const requestOptions: any = {
            method,
            url: `https://eu.developer.attachmentav.com/v1${endpoint}`,
            headers: {
                'x-api-key': credentials.apiKey,
            },
            ...options,
        };

        if (options.headers) {
            requestOptions.headers = {
                ...requestOptions.headers,
                ...options.headers,
            };
        }

        return this.executeFunctions.helpers.httpRequestWithAuthentication.call(
            this.executeFunctions,
            'attachmentAVApi',
            requestOptions
        );
    }
}
