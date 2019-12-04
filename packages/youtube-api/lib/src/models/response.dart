class Response<S, F> {
  final List<S> successful;
  final List<F> failed;

  Response(this.successful, this.failed);
}
