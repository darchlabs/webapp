import { z } from "zod";

export const GetAbiSchema = () => {
  const Input = z.object({
    internalType: z.string(),
    name: z.string(),
    type: z.string(),
  });

  const Output = z.object({
    internalType: z.string(),
    name: z.string(),
    type: z.string(),
  });

  const Event = z.object({
    anonymous: z.boolean(),
    inputs: z.array(Input),
    name: z.string(),
    type: z.string(),
  });

  const Function = z.object({
    inputs: z.array(Input),
    name: z.string(),
    outputs: z.array(Output),
    stateMutability: z.enum(["pure", "view", "nonpayable", "payable"]),
    type: z.string(),
  });

  const Constructor = z.object({
    inputs: z.array(Input),
    stateMutability: z.enum(["nonpayable"]),
    type: z.string(),
  });

  const Fallback = z.object({
    stateMutability: z.enum(["payable"]),
    type: z.string(),
  });

  const Receive = z.object({
    stateMutability: z.enum(["payable"]),
    type: z.string(),
  });

  // define abi schema
  return z.array(z.union([Event, Function, Constructor, Fallback, Receive]));
};

export const GetAbiEventSchema = () => {
  return GetAbiSchema().refine(
    (abi) => {
      return abi.some((element) => element.type === "event");
    },
    {
      message: "The ABI must contain at least one event",
    }
  );
};
