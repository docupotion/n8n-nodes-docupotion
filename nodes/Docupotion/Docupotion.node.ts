import {
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	type IExecuteFunctions,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type JsonObject,
} from 'n8n-workflow';

export class Docupotion implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocuPotion',
		name: 'docupotion',
		icon: { light: 'file:docupotion.svg', dark: 'file:docupotion.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: 'Create Document',
		description: 'Generate PDFs from templates using DocuPotion',
		defaults: {
			name: 'DocuPotion',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'docupotionApi', required: true }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Document',
						value: 'createDocument',
						description: 'Create a document from a template',
						action: 'Create a document',
					},
				],
				default: 'createDocument',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the DocuPotion template to use',
				displayOptions: {
					show: {
						operation: ['createDocument'],
					},
				},
			},
			{
				displayName: 'Output',
				name: 'output',
				type: 'options',
				options: [
					{
						name: 'File',
						value: 'file',
						description:
							'Returns the document as binary data for use in subsequent workflow steps',
					},
					{ name: 'URL', value: 'url' },
					{ name: 'Base64', value: 'base64' },
				],
				default: 'file',
				description: 'How to return the generated document',
				displayOptions: {
					show: {
						operation: ['createDocument'],
					},
				},
			},
			{
				displayName: 'File Name',
				name: 'outputFile',
				type: 'string',
				default: 'document.pdf',
				description: 'Name of the output file',
				displayOptions: {
					show: {
						operation: ['createDocument'],
						output: ['file'],
					},
				},
			},
			{
				displayName: 'URL Expiration (Minutes)',
				name: 'expiration',
				type: 'number',
				default: 60,
				description: 'How long the URL remains valid (1-10080 minutes)',
				typeOptions: {
					minValue: 1,
					maxValue: 10080,
				},
				displayOptions: {
					show: {
						operation: ['createDocument'],
						output: ['url'],
					},
				},
			},
			{
				displayName: 'Template Data',
				name: 'data',
				type: 'json',
				default: '{}',
				description:
					'JSON object with dynamic variables matching your template fields',
				displayOptions: {
					show: {
						operation: ['createDocument'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const templateId = this.getNodeParameter('templateId', i) as string;
				const output = this.getNodeParameter('output', i) as string;
				const dataParam = this.getNodeParameter('data', i);

				// Parse and validate template data JSON
				let data: object;
				if (typeof dataParam === 'string') {
					try {
						data = JSON.parse(dataParam) as object;
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'The "Template Data" field contains invalid JSON',
							{ itemIndex: i },
						);
					}
				} else {
					data = dataParam as object;
				}

				// When user selects "file", request base64 from the API and convert to binary
				const apiOutput = output === 'file' ? 'base64' : output;

				// Build request body
				const body: Record<string, unknown> = {
					templateId,
					output: apiOutput,
					format: 'pdf',
					data,
				};

				if (output === 'url') {
					body.expiration = this.getNodeParameter('expiration', i) as number;
				}

				// Make API call
				const options: IHttpRequestOptions = {
					method: 'POST',
					url: 'https://api.docupotion.com/v1/create',
					body,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					json: true,
				};

				const responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'docupotionApi',
					options,
				);

				if (output === 'file') {
					// Convert base64 response to binary data
					const outputFile = this.getNodeParameter('outputFile', i) as string;
					const buffer = Buffer.from(
						(responseData as { base64: string }).base64,
						'base64',
					);
					const binaryData = await this.helpers.prepareBinaryData(
						buffer,
						outputFile,
						'application/pdf',
					);

					returnData.push({
						json: { success: true, format: 'pdf' },
						binary: { data: binaryData },
						pairedItem: { item: i },
					});
				} else {
					returnData.push({
						json: responseData as INodeExecutionData['json'],
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}

				if (error instanceof NodeOperationError) {
					throw error;
				}

				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
