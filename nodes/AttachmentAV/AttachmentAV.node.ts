import {
    type IExecuteFunctions,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

import { ApiHelper } from './modules/ApiHelper';
import { executeScan } from './modules/Scan/index';

export class AttachmentAV implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'AttachmentAV',
        name: 'attachmentAV',
        icon: 'file:attachmentAV.svg',
        group: ['transform'],
        version: 1,
        description: 'Scan your files and attachments stored in the cloud for viruses, worms, and trojans. attachmentAV detects malware in real-time.',
        defaults: {
            name: 'AttachmentAV',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'attachmentAVApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Scan',
                        value: 'scan',
                    },
                ],
                default: 'scan',
            },
            // Operations for Scan Resource
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['scan'],
                    },
                },
                options: [
                    {
                        name: 'Scan a File',
                        value: 'scanAFile',
                        action: 'Scan a File for Maleware / Viruses',
                    },
                    {
                        name: 'Scan A Url',
                        value: 'scanAUrl',
                        action: 'Scan a Url for Maleware / Viruses',
                    },
                ],
                default: 'scanAFile',
            },
           
            // Binary Property Name for Scan a File
            {
                displayName: 'Input Binary Field',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['scan'],
                        operation: ['scanAFile'],
                    },
                },
                description: 'The name of the binary property containing the file to scan (max 10 MB).',
            },
            // URL Input for Scan a URL
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['scan'],
                        operation: ['scanAUrl'],
                    },
                },
                description: 'URL of the file to download and scan for viruses.',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;
        const apiHelper = new ApiHelper(this);

        for (let i = 0; i < items.length; i++) {
            try {
                let result: INodeExecutionData;
                if (resource === 'scan') {
                    result = await executeScan(this, apiHelper, i, operation);
                } else {
                    throw new Error(`Unknown resource: ${resource}`);
                }
                returnData.push(result);
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
                    continue;
                }
                throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
            }
        }

        return [returnData];
    }
}
