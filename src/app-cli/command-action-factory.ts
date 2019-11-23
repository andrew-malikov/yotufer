import { Container } from "inversify";

export type CommandAction<D, A> = (args: A & D) => void;

export type ContextualCommandAction<R, D, A> = (
  getDependencies: (requirements: R) => D
) => CommandAction<D, A>;

export class CommandActionFactory {
  constructor(private container: Container) {}

  public getCommandAction<D, A>(
    action: ContextualCommandAction<A & { container: Container }, D, A>,
    getDependencies: (requirements: A & { container: Container }) => D
  ): CommandAction<D, A> {
    return action((args: A) =>
      getDependencies({ ...args, container: this.container })
    );
  }
}
