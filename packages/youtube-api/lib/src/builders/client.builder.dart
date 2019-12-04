import 'package:http/http.dart';

import 'package:googleapis_auth/auth.dart';
import 'package:googleapis_auth/auth_io.dart';

import 'package:youtube_api/src/factories/token.factory.dart';
import 'package:youtube_api/src/models/credentials.dart';

class ClientBuilder {
  final ProvidableToken _getToken;

  Client _client;
  ClientId _clientId;

  ClientBuilder(this._client, Credentials credentials, this._getToken) {
    _clientId = ClientId(
        credentials.installed.clientId, credentials.installed.clientSecret);
  }

  Client build() => _client;

  Future<ClientBuilder> authenticate(List<String> scopes) async {
    return _getToken(_client, _clientId, scopes).then((token) {
      _client = authenticatedClient(_client, token);

      return this;
    });
  }
}
