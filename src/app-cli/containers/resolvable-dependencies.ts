import { Container } from "inversify";

export type PopulateDependenciesByArgs<A> = (
  container: Container,
  args: A
) => void;

export type PopulateDependenciesByArgsAsync<A> = (
  container: Container,
  args: A
) => Promise<void>;

export type PopulateDependencies = (container: Container) => void;

export class ResolvableDependencies {
  constructor(private container: Container) {}

  public resolve<D>(resolveBy: (container: Container) => D): D {
    return resolveBy(this.container);
  }

  public populateByArgs<A>(
    populateBy: PopulateDependenciesByArgs<A>,
    args: A
  ): ResolvableDependencies {
    populateBy(this.container, args);

    return this;
  }

  public async populateByArgsAsync<A>(
    populateByAsync: PopulateDependenciesByArgsAsync<A>,
    args: A
  ): Promise<ResolvableDependencies> {
    await populateByAsync(this.container, args);

    return this;
  }

  public populate(populateBy: PopulateDependencies): ResolvableDependencies {
    populateBy(this.container);

    return this;
  }
}
