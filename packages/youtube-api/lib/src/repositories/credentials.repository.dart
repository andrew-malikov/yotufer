import 'dart:io';
import 'dart:convert';

import 'package:youtube_api/src/models/credentials.dart';

abstract class CredentialsRepository {
  Future<Credentials> get();
}

class CredentialsFileRepository implements CredentialsRepository {
  final String _path;

  CredentialsFileRepository(this._path);

  @override
  Future<Credentials> get() {
    return File(_path).readAsString().then((serialized) {
      return Credentials.fromJson(jsonDecode(serialized));
    });
  }
}
