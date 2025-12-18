import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ApiHelper } from '../ApiHelper';
import { executeScanAFile } from './ScanAFile';
import { executeScanAUrl } from './ScanAUrl';


export async function executeScan(
    executeFunctions: IExecuteFunctions,
    apiHelper: ApiHelper,
    itemIndex: number,
    operation: string
): Promise<INodeExecutionData> {
    switch (operation) {
        case 'scanAFile':
            return executeScanAFile(executeFunctions, apiHelper, itemIndex);
        case 'scanAUrl':
            return executeScanAUrl(executeFunctions, apiHelper, itemIndex);
        default:
            throw new Error(`Unknown operation: ${operation}`);
    }
}
