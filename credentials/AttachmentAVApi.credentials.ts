import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from "n8n-workflow";

export class AttachmentAVApi implements ICredentialType {
  name = "attachmentAVApi";
  displayName = "attachmentAV API";
  documentationUrl = "https://attachmentav.com/";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: { password: true },
      default: "",
      description: "You can get API Key for attachmentAV from https://attachmentav.com/",
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        "x-api-key": "={{$credentials.apiKey}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: "https://eu.developer.attachmentav.com",
      url: "/v1/test",
      method: "GET",
      headers: {
        "origin": "n8n/credential-test"
      },
    },
  };
}
