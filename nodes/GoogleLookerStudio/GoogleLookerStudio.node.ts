import {
  ApplicationError,
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeApiError,
  NodeConnectionType
} from 'n8n-workflow';

export class GoogleLookerStudio implements INodeType {
  description:INodeTypeDescription = {
    name: 'googleLookerStudio',
	  displayName: 'Google Looker Studio',
    group: ['transform'],
    version: 1,
    description: 'Use the Google Looker Studio API',
    defaults:{ name: 'Google Looker Studio' },
    icon: 'file:googlelookerstudio.svg',
    // @ts-ignore - node-class-description-inputs-wrong
    inputs: [{ type: NodeConnectionType.Main }],
    // @ts-ignore - node-class-description-outputs-wrong
    outputs: [{ type: NodeConnectionType.Main }],
		usableAsTool: true,
    credentials:[{ name: 'googleLookerStudioOAuth2Api', required:true }],
    requestDefaults:{
      baseURL: 'https://datastudio.googleapis.com/v1',
      headers:{ 'Content-Type': 'application/json' }
    },
    properties:[
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Asset', value: 'assets', description: 'Manages assets' },
          { name: 'Permission', value: 'permissions', description: 'Manages permissions' }
        ],
        default: 'assets',
        required: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['assets'] } },
        options: [
          { name: 'Search Asset', value: 'assetsSearch', action:'Searches asset', description: 'Searches an user Looker Studio asset' }
        ],
        default: 'assetsSearch',
        required: true,
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['permissions'] } },
        options: [
          { name: 'Add Members', value: 'permissionsAddMembersPost', action:'Adds members', description: 'Adds members to a Looker Studio asset' },
          { name: 'Get Permission', value: 'permissionsGet', action:'Gets the permissions', description: 'Gets the permissions for a Looker Studio asset' },
          { name: 'Revoke All Permissions', value: 'permissionsRevokePost', action:'Removes members', description: 'Removes members from a Looker Studio asset' },
          { name: 'Update Permission', value: 'permissionsPatch', action:'Updates permissions', description: 'Updates permissions for a Looker Studio asset' }
        ],
        default: 'permissionsAddMembersPost',
        required: true,
      },
			{
				displayName: 'Asset Name',
				name: 'assetName',
				type: 'string',
				default: '',
        description: 'The name (ID) of the asset',
        displayOptions:{ show:{ operation:['permissionsAddMembersPost', 'permissionsGet', 'permissionsRevokePost', 'permissionsPatch'] } }
			},
      {
        displayName: 'Query Parameters',
        name: 'queryParameters',
        type: 'collection',
        placeholder: 'Add Parameter',
        default:{},
        options:[
          {
            displayName: 'Asset Types',
            name: 'assetTypes',
            description: 'The asset type to search (exactly one asset type must be specified)',
            type: 'string',
            default: ''
          },
          {
            displayName: 'Include Trashed',
            name: 'includeTrashed',
            description: 'Whether to include only assets from the trash',
            type: 'boolean',
            default: false
          },
          {
            displayName: 'Order By',
            name: 'orderBy',
            description: 'The order of the results',
            type: 'options',
            options: [
              {
                name: 'Create Time',
                value: 'create_time',
              },
              {
                name: 'ID',
                value: 'id',
              },
              {
                name: 'Last Accessed Time',
                value: 'last_accessed_time',
              },
              {
                name: 'Last Viewed By Me',
                value: 'last_viewed_by_me',
              },
              {
                name: 'Title',
                value: 'title',
              }
            ],
            default: 'id'
          },
          {
            displayName: 'Owner',
            name: 'owner',
            description: 'The asset owner email',
            type: 'string',
            default: ''
          },
          {
            displayName: 'Page Size',
            name: 'pageSize',
            description: 'The number of results to include per page',
            type: 'number',
            default: 1000,
          },
          {
            displayName: 'Page Token',
            name: 'pageToken',
            description: 'A token identifying a page of results to return',
            type: 'string',
            default: '',
            typeOptions: {
              password: true
            }
          },
          {
            displayName: 'Title',
            name: 'title',
            description: 'The search string (by default, the string is checked against the title and description of the asset)',
            type: 'string',
            default: ''
          }
        ],
      },
      {
        displayName: 'Request Body',
        name: 'requestBody',
        type: 'json',
	      default: '{}',
        displayOptions:{ show:{ operation:['permissionsAddMembersPost', 'permissionsPatch', 'permissionsRevokePost'] } }
      }
    ]
  };

  async execute(this:IExecuteFunctions) {
    const items = this.getInputData();
    const returnData = [];
    const credentials = await this.getCredentials('googleLookerStudioOAuth2Api');
    if (!credentials) { throw new ApplicationError('Missing Google Looker Studio API Credentials'); }

    for (let i = 0; i < items.length; i++) {
      try {

        const operation = this.getNodeParameter('operation', i, '') as string;
        const resource = this.getNodeParameter('resource', i, '') as string;
        const assetName = this.getNodeParameter('assetName', i, '') as string;
        const queryParameters = this.getNodeParameter('queryParameters', i, {}) as Record<string, any>;
        const requestBody = this.getNodeParameter('requestBody', i, '') as string;

        let url = 'https://datastudio.googleapis.com/v1';

        const queryParams = new URLSearchParams();
        Object.entries(queryParameters).forEach(([key, value]) => {
          if (value) queryParams.append(key, String(value));
        });
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

        switch (resource) {
          case 'assets':
            switch (operation) {
              case 'assetsSearch':
                url += `/assets:search${queryString}`;
                break;
            }
            break;
          case 'permissions':
            switch (operation) {
              case 'permissionsAddMembersPost':
                if (!assetName) { throw new ApplicationError('Asset Name is required'); }
                url += `/assets/${assetName}/permissions:addMembers${queryString}`;
                break;
              case 'permissionsGet':
              case 'permissionsPatch':
                if (!assetName) { throw new ApplicationError('Asset Name is required'); }
                url += `/assets/${assetName}/permissions${queryString}`;
                break;
              case 'permissionsRevokePost':
                if (!assetName) { throw new ApplicationError('Asset Name is required'); }
                url += `/assets/${assetName}/permissions:revokeAllPermissions${queryString}`;
                break;
            }
            break;          
        }

        const httpMethod: 'GET' | 'PATCH' | 'POST'  = operation.endsWith('Patch') ? 'PATCH' :
                                                      operation.endsWith('Post') ? 'POST' : 'GET';        

        const requestConf = {
          method: httpMethod,
          url,
          headers: { 'Content-Type': 'application/json' },
          ...(['PATCH', 'POST'].includes(httpMethod) ? { body: JSON.parse(requestBody) } : {})
        };

        const responseData = await this.helpers.requestOAuth2.call(this, 'googleLookerStudioOAuth2Api', requestConf);

        returnData.push(JSON.parse(responseData));
      } catch (error) {
        throw new NodeApiError(this.getNode(), {
          message: `Error calling Google Looker Studio API: ${error.message}`,
          description: error.stack || 'No stack trace available'
        });
      }
    }
    return [this.helpers.returnJsonArray(returnData)];
  }
}