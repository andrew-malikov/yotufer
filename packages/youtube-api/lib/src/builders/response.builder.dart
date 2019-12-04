import 'package:youtube_api/src/models/response.dart';

class ResponseBuilder<S, F> {
  List<S> _successful;
  List<F> _failed;

  ResponseBuilder() {
    reset();
  }

  Response<S, F> build() {
    final response = Response(_successful, _failed);

    reset();

    return response;
  }

  void reset() {
    _successful = List();
    _failed = List();
  }

  void addSuccessfulCase(S successfulCase) {
    _successful.add(successfulCase);
  }

  void addFailedCase(F failedCase) {
    _failed.add(failedCase);
  }
}
