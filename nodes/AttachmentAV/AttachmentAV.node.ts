import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    NodeConnectionType,
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
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
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
                        value: 'executeScan',
                    },
                ],
                default: 'scan',
            },
            // Operations for Convert Resource
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
           
            {
                displayName: 'Input Type',
                name: 'inputType',
                type: 'options',
                options: [
                    {
                        name: 'Binary',
                        value: 'binary',
                    },
                    {
                        name: 'URL',
                        value: 'url',
                    },
                ],
                default: 'binary',
                displayOptions: {
                    show: {
                        resource: ['convert', 'pdf'],
                        operation: ['pdfToPng', 'pdfToText', 'compress', 'merge', 'extractPages', 'getFormFields', 'fillForm'],
                    },
                },
            },
            // Binary Property Name
            {
                displayName: 'Input Binary Field',
                name: 'binaryPropertyName',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: {
                    show: {
                        inputType: ['binary'],
                        resource: ['convert', 'pdf'],
                        operation: ['pdfToPng', 'pdfToText', 'compress', 'merge', 'extractPages', 'getFormFields', 'fillForm'],
                    },
                },
                description: 'The name of the binary property containing the data.',
            },
            // URL Input
            {
                displayName: 'URL',
                name: 'url',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        inputType: ['url'],
                        resource: ['convert', 'pdf'],
                        operation: ['pdfToPng', 'pdfToText', 'compress', 'extractPages'],
                    },
                },
                description: 'URL of the file to process.',
            },
            // URL Input for Merge (Array)
            {
                displayName: 'URLs',
                name: 'urls',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        inputType: ['url'],
                        resource: ['pdf'],
                        operation: ['merge'],
                    },
                },
                description: 'Comma-separated URLs of the files to process.',
            },
            {
                displayName: 'Output Filename',
                name: 'outputFilenamePdf',
                type: 'string',
                default: 'output.pdf',
                required: false,
                displayOptions: {
                    show: {
                        resource: ['convert', 'pdf'],
                        operation: ['htmlToPdf', 'compress', 'merge', 'extractPages', 'fillForm', 'generateInvoice'],
                    },
                },
                description: 'Name of the output file (including extension).',
            },
            // Output Filename (PNG)
            {
                displayName: 'Output Filename',
                name: 'outputFilenamePng',
                type: 'string',
                default: 'output.png',
                required: false,
                displayOptions: {
                    show: {
                        resource: ['convert', 'web'],
                        operation: ['pdfToPng', 'screenshot'],
                    },
                },
                description: 'Name of the output file (including extension).',
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
