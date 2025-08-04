import { 
  ICredentialType, 
  INodeProperties, 
  Icon 
} from 'n8n-workflow';

const scopes = [
  'https://www.googleapis.com/auth/datastudio',
  'https://www.googleapis.com/auth/datastudio.readonly'
];

export class GoogleLookerStudioApi implements ICredentialType {
  name = 'googleLookerStudioOAuth2Api';
  extends = ['googleOAuth2Api'];
  displayName = 'Google Looker Studio OAuth2 API';
  documentationUrl = 'https://docs.n8n.io/integrations/builtin/credentials/google/oauth-single-service/';
  icon: Icon = 'file:icons/googlelookerstudio.svg';
  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://accounts.google.com/o/oauth2/v2/auth',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://oauth2.googleapis.com/token',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: 'access_type=offline&prompt=consent',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'header',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: scopes.join(' '),
    }
  ];
}
