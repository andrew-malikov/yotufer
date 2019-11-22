import { Container, interfaces } from "inversify";

export type DependencyIdentifier<T> = interfaces.ServiceIdentifier<T>;

export type CommandAction<A> = (args: A) => void;

export type ContextualCommandAction<R, D, A> = (
  getDependecies: (requirements: R) => D
) => CommandAction<A>;

export class CommandActionFactory {
  constructor(private container: Container) {}

  public getCommandAction<D, A>(
    action: ContextualCommandAction<A & { container: Container }, D, A>,
    getDependecies: (requirements: A & { container: Container }) => D
  ): CommandAction<A> {
    return action((args: A) =>
      getDependecies({ ...args, container: this.container })
    );
  }
}
