// This file ensures n8n can find and load your nodes and credentials
const { GoogleLookerStudio } = require('./dist/nodes/GoogleLookerStudio/GoogleLookerStudio.node.js');

module.exports = {
	nodeTypes: {
		GoogleLookerStudio: GoogleLookerStudio,
	},
	credentialTypes: {
		GoogleLookerStudioApi: require('./dist/credentials/GoogleLookerStudioApi.credentials.js').GoogleLookerStudioApi,
	},
};
