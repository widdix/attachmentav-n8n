import { IExecuteFunctions } from 'n8n-workflow';

export class ApiHelper {
    constructor(private executeFunctions: IExecuteFunctions) { }

    async makeRequest(
        method: string,
        endpoint: string,
        options: any = {},
    ): Promise<any> {
        const requestOptions: any = {
            method,
            url: `https://eu.developer.attachmentav.com/v1${endpoint}`,
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
