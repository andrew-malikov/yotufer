import 'package:http/http.dart';

import 'package:googleapis_auth/auth_io.dart';
import 'package:googleapis_auth/auth.dart';

import 'package:youtube_api/src/repositories/token.repository.dart';

typedef ProvidableToken = Future<AccessCredentials> Function(
    Client client, ClientId clientId, List<String> scopes);

class TokenFactory {
  ProvidableToken getFromConsole(void Function(String url) prompt) {
    return (client, clientId, scopes) =>
        obtainAccessCredentialsViaUserConsent(clientId, scopes, client, prompt)
            .then((AccessCredentials credentials) => credentials);
  }

  ProvidableToken getFromFileSystem(TokenRepository repository) {
    return (client, clientId, scopes) => repository.get();
  }
}
