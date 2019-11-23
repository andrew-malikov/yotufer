import { Container } from "inversify";

export type CommandAction<D, A> = (args: A & D) => Promise<void>;

export type ContextualCommandAction<R, D, A> = (
  getDependencies: (requirements: R) => D
) => CommandAction<D, A>;

export class CommandActionFactory {
  constructor(private container: Container) {}

  public getAction<D, A>(
    action: CommandAction<D, A>,
    getDependencies: (requirements: A & { container: Container }) => Promise<D>
  ): (args: A) => Promise<void> {
    return async (args: A) =>
      await action({
        ...args,
        ...(await getDependencies({ ...args, container: this.container }))
      });
  }
}
