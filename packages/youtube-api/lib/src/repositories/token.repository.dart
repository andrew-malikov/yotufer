import 'dart:io';
import 'dart:convert';

import 'package:googleapis_auth/auth.dart';

abstract class TokenRepository {
  Future<AccessCredentials> get();
  Future<AccessCredentials> save(AccessCredentials token);
}

class TokenFileRepository implements TokenRepository {
  final String _path;

  TokenFileRepository(this._path);

  @override
  Future<AccessCredentials> get() {
    return File(_path)
        .readAsString()
        .then((data) => fromJson(jsonDecode(data)));
  }

  @override
  Future<AccessCredentials> save(AccessCredentials token) {
    return File(_path)
        .writeAsString(jsonEncode(toJson(token)))
        .then((_) => token);
  }
}

Map<String, dynamic> toJson(AccessCredentials token) {
  return {
    'accessToken': token.accessToken,
    'refreshToken': token.refreshToken,
    'scopes': token.scopes,
    'idToken': token.idToken
  };
}

AccessCredentials fromJson(Map<String, dynamic> graph) {
  return AccessCredentials(
      graph['accessToken'], graph['refreshToken'], graph['scopes'],
      idToken: graph['idToken']);
}
