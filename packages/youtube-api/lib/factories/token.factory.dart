import 'package:http/http.dart';

import 'package:googleapis_auth/auth.dart';

typedef ProvidableToken = Future<AccessCredentials> Function(
    Client client, ClientId clientId, List<String> scopes);

class TokenFactory {
  ProvidableToken getFromConsole() {
    throw UnimplementedError();
  }

  ProvidableToken getFromFileSystem() {
    throw UnimplementedError();
  }
}
