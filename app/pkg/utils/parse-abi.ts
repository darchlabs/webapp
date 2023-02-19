import type { Abi, AbiInput } from "../synchronizer/types";

export default function parseAbi(inputString: string): Abi {
  const abiObject = JSON.parse(inputString) as any;
  if (
    typeof abiObject.anonymous !== "boolean" ||
    !Array.isArray(abiObject.inputs) ||
    typeof abiObject.name !== "string" ||
    typeof abiObject.type !== "string"
  ) {
    throw new Error("Invalid ABI object");
  }
  const abiInputs = abiObject.inputs.map((inputObject: any) => {
    if (
      typeof inputObject.indexed !== "boolean" ||
      typeof inputObject.internalType !== "string" ||
      typeof inputObject.name !== "string" ||
      typeof inputObject.type !== "string"
    ) {
      throw new Error("Invalid input object");
    }
    return inputObject as AbiInput;
  });
  return { ...abiObject, inputs: abiInputs } as Abi;
}
