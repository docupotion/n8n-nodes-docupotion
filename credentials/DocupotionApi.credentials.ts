import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DocupotionApi implements ICredentialType {
	name = 'docupotionApi';

	displayName = 'DocuPotion API';

	documentationUrl = 'https://docupotion.com/api-docs';

	icon = {
		light: 'file:../nodes/Docupotion/docupotion.svg',
		dark: 'file:../nodes/Docupotion/docupotion.dark.svg',
	} as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.docupotion.com',
			url: '/v1/account',
			method: 'GET',
		},
	};
}
