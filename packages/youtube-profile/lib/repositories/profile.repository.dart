import 'dart:io';

import 'package:dartz/dartz.dart';

import 'package:youtube_profile/models/profile.dart';

abstract class ProfileRepository {
  Future<List<Profile>> getAll();
  Future<Option<Profile>> getByName(String name);
}

class ProfileFileRepository implements ProfileRepository {
  final String _path;

  ProfileFileRepository(this._path);

  @override
  Future<List<Profile>> getAll() {
    return File(_path).readAsString().then((json) => (json as List)
        .map((profileGraph) => Profile.fromJson(profileGraph))
        .toList());
  }

  @override
  Future<Option<Profile>> getByName(String name) {
    return getAll().then((profiles) {
      try {
        return Some(profiles.firstWhere((profile) => profile.name == name));
      } catch (IterableElementError) {
        return None();
      }
    });
  }
}
