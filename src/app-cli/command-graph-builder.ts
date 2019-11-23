import { Command } from "commander";

export class CommandGraphBuilder {
  constructor(private root: Command) {}

  public build(): Command {
    return this.root;
  }

  public populate(populateBy: (root: Command) => void): CommandGraphBuilder {
    populateBy(this.root);

    return this;
  }
}
