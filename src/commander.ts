
export interface IArgument {
  key: string;
  value: string;
}

export interface ICommandData {
  runner: string;
  script: string;
  name: string;
  arguments: IArgument[];
}

export function parseArgumentStr(parameterStr: string):  IArgument {
  const parts = parameterStr.split("=");
  const argument = {
    key: parts[0].substr(2),
    value: parts[1] === undefined ? true : parts[1]
  } as IArgument;

  return argument;
}

export function parseARGV(_argv: string[]): ICommandData {
  const argv = [..._argv];
  if (!argv || argv.length === 0) {
    throw new Error("No data for procession.");
  }
  const commandData = {
    runner: argv[0],
    script: argv[1],
    name: argv.pop(),
    arguments: [] as IArgument[]
  } as ICommandData;
  for (const parameterStr of argv.splice(2)) {
    const argument = parseArgumentStr(parameterStr);
    commandData.arguments.push(argument);
  }

  return commandData;
}
