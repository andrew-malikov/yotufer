class Credentials {
  final CredentialsBody installed;

  Credentials(this.installed);

  Credentials.fromJson(Map<String, dynamic> graph)
      : installed = CredentialsBody.fromJson(graph['installed']);

  Map<String, dynamic> toJson() => {'installed': installed.toJson()};
}

class CredentialsBody {
  final String clientId;
  final String projectId;
  final String authUri;
  final String tokenUri;
  final String authProviderX509CertUrl;
  final String clientSecret;
  final List<String> redirectUris;

  CredentialsBody(this.clientId, this.projectId, this.authUri, this.tokenUri,
      this.authProviderX509CertUrl, this.clientSecret, this.redirectUris);

  CredentialsBody.fromJson(Map<String, dynamic> graph)
      : clientId = graph['client_id'],
        projectId = graph['project_id'],
        authUri = graph['auth_uri'],
        tokenUri = graph['token_uri'],
        authProviderX509CertUrl = graph['auth_provider_x509_cert_url'],
        clientSecret = graph['client_secret'],
        redirectUris = graph['redirectUris'];

  Map<String, dynamic> toJson() => {
        'client_id': clientId,
        'project_id': projectId,
        'auth_uri': authUri,
        'token_uri': tokenUri,
        'auth_provider_x509_cert_url': authProviderX509CertUrl,
        'client_secret': clientSecret,
        'redirectUris': redirectUris,
      };
}
