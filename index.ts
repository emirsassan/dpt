import { parseArgs } from "util";

type CommandFunction = (args: string[]) => void;

export const commands: Record<string, CommandFunction> = {};

/**
 * Defines a new command.
 *
 * @param commandName The name of the command to define. This is what the user will
 *   type on the command line to execute the command.
 * @param commandFunction The function to execute when the command is called.
 *   This function will be called with an array of strings representing the
 *   arguments the user provided.
 */
export function defineCommand(commandName: string, commandFunction: CommandFunction): void {
    // Add the command to the dictionary of available commands.
    commands[commandName] = commandFunction;
}

defineCommand("hw", (args: string[]) => {
    console.log("Hello world");
})

/**
 * Parse the command and arguments from the command line.
 *
 * The command line is parsed using the `util.parseArgs` function from the
 * `util` module. The `strict` option is set to `true` which means that the
 * function will throw an error if there are any unknown options or positional
 * arguments. We also set the `allowPositionals` option to `true` which means
 * that the function will allow the user to pass in any number of positional
 * arguments after the command.
 *
 * The parsed arguments are returned as a new object with two properties:
 *
 * - `command`: The name of the command that was provided by the user.
 * - `args`: An array of strings representing any positional arguments that
 *   were provided by the user.
 *
 * @param args The array of strings representing the command line arguments.
 * @returns An object with two properties: `command` and `args`.
 */
function parseCommand(args: string[]): Command {
    // Parse the command line arguments using the `util.parseArgs` function.
    const { positionals } = parseArgs({
        args,
        options: {}, // No options are allowed.
        strict: true, // Throw an error if there are any unknown options or positional arguments.
        allowPositionals: true, // Allow any number of positional arguments after the command.
    });

    // The first argument is the command, and the rest are the positional arguments.
    const [command, ...argsWithoutCommand] = positionals;

    // Return the command and positional arguments as a new object.
    return {
        command,
        args: argsWithoutCommand,
    };
}


/**
 * Execute the command that the user has requested.
 *
 * First, we look up the function that corresponds to the command that the user
 * provided. If there is no such function, then we print a list of all the
 * available commands.
 *
 * If the command is valid, we call the corresponding function with the
 * arguments provided by the user.
 *
 * @param command The name of the command that the user requested.
 * @param args An array of strings representing the arguments that the user
 *   provided.
 */
function runCommand(command: string, args: string[]): void {
    // Look up the function that corresponds to the command that the user
    // requested. If there is no such function, then we print a list of all
    // the available commands.
    const commandFunction = commands[command];
    if (commandFunction === undefined) {
        console.log("Available commands:");
        for (const command of Object.keys(commands)) {
            console.log(`- ${command}`);
        }
    } else {
        // If the command is valid, we call the corresponding function with the
        // arguments provided by the user.
        commandFunction(args);
    }
}


const command = parseCommand(Bun.argv);
if (command.args.length === 0) {
    commands.help([]);
} else {
    runCommand(command.args[1], command.args);
}

type Command = {
    command: string;
    args: string[];
};