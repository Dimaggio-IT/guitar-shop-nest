import { CommandParser } from './command-parser';
import { ICommand } from './commands';

export class CLIApplication {
  private commands: Record<string, ICommand> = {};
  private readonly defaultCommand: string = '--help';

  public registerCommands(commandList: ICommand[]): void {
    commandList.forEach((command) => {
      if (this.commands[command.name]) {
        throw new Error(`Command ${command.name} is already registered`);
      }
      this.commands[command.name] = command;
    });
  }

  public getCommand(commandName: string): ICommand {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): ICommand | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
