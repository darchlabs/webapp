import {
  HStack,
  VStack,
  Text,
  Input,
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Form, Link, useLoaderData } from "@remix-run/react";
import {
  type ActionArgs,
  redirect,
  json,
  type LoaderFunction,
} from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import react from "react";
import { ethers } from "ethers";
import PolygoSelectIcon from "~/components/icon/polygon-select-icon";

type abiMethod = {
  inputs: [];
  name: string;
  outputs: [[Object]];
  stateMutability: string;
  type: string;
};

export const loader: LoaderFunction = async () => {
  const body = await redis.get("createdJobFormData");
  return json(body as JobsFormData);
};

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  // check if pressed back button
  if (body.get("_action") === "back") {
    return redirect("/admin/jobs/create/cronjob");
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }

  // get provider and network values from form and save in redis
  const checkMethod = body.get("checkMethod");
  const actionMethod = body.get("actionMethod");

  current.checkMethod = checkMethod as string;
  current.actionMethod = actionMethod as string;
  await redis.set("createdJobFormData", current);

  // redirect to confirm page
  return redirect(`/admin/jobs/create/account`);
};

export default function StepMethods() {
  const body = useLoaderData() as JobsFormData;

  // const contractInterface = new ethers.utils.Interface(body.abi);
  // const methods = contractInterface.functions;
  let abi;
  try {
    abi = JSON.parse(body.abi);
  } catch (error) {
    console.log("err parsing abi: ", error);
  }

  const methods = abi.filter(
    (i: { type: string }) => i.type === "function"
  ) as abiMethod[];
  console.log("methods: ", methods);

  const viewMethods = methods.filter(
    (method) => method.stateMutability === "view"
  );
  const actionMethods = methods.filter(
    (method) => method.stateMutability === "nonpayable"
  );

  let [checkMethod, setCheckMethod] = react.useState("");
  let [actionMethod, setActionMethod] = react.useState("");

  // TODO(nb): validate the methods exists on the contract abi
  function onClickCheckMethod(checkMethod: string) {
    setCheckMethod(checkMethod);
  }

  function onClickActionMethod(actionMethod: string) {
    setActionMethod(actionMethod);
  }

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <HStack justifyContent={"left"} w={"full"}>
        <VStack alignItems={"start"}>
          <Form method="post">
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Check method
            </Text>

            <Menu closeOnSelect={true}>
              <MenuButton
                id={"ok"}
                as={Button}
                rightIcon={<PolygoSelectIcon />}
              >
                {checkMethod ? checkMethod : "Select the check method"}
              </MenuButton>
              <MenuList>
                {viewMethods.map((method) => {
                  return (
                    <MenuItem
                      key={method.name}
                      onClick={() => {
                        onClickCheckMethod(method.name);
                      }}
                    >
                      {method.name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            <input name="checkMethod" type="hidden" value={checkMethod} />

            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Action method
            </Text>
            <Menu closeOnSelect={true}>
              <MenuButton
                id={"yes"}
                as={Button}
                rightIcon={<PolygoSelectIcon />}
              >
                {actionMethod ? actionMethod : "Select the action method"}
              </MenuButton>
              <MenuList>
                {actionMethods.map((method) => {
                  return (
                    <MenuItem
                      key={method.name}
                      onClick={() => {
                        onClickActionMethod(method.name);
                      }}
                    >
                      {method.name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            <input name="actionMethod" type="hidden" value={actionMethod} />
            <HStack
              w={"full"}
              justifyContent={"start"}
              pt={"12px"}
              spacing={"10px"}
            >
              <Button
                size={"sm"}
                colorScheme={"pink"}
                name={"_action"}
                value={"submit"}
                type="submit"
                disabled={checkMethod === "" || actionMethod === ""}
              >
                NEXT
              </Button>
              <Link to="/admin/jobs/create/cron">
                <Button size={"sm"} colorScheme={"pink"} variant={"outline"}>
                  BACK
                </Button>
              </Link>
              <Button
                name={"_action"}
                value={"cancel"}
                size={"sm"}
                colorScheme={"pink"}
                variant={"ghost"}
                type="submit"
              >
                Cancel
              </Button>
            </HStack>
          </Form>
        </VStack>
      </HStack>
      <HStack justifyContent={"rigth"} w={"full"} paddingBottom={"40px"}>
        <Text color={"GrayText"} fontSize={"25px"}>
          Put your check method. Put your action method.
        </Text>
      </HStack>
    </HStack>
  );
}
