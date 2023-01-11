<<<<<<< HEAD
import {
  HStack,
  VStack,
  Text,
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
import PolygoSelectIcon from "~/components/icon/polygon-select-icon";

export type abiMethod = {
  inputs: [];
  name: string;
  outputs: [[Object]];
  stateMutability: string;
  type: string;
};

type loaderData = {
  currentJob: JobsFormData;
};

export const loader: LoaderFunction = async () => {
  const currentJob = (await redis.get("createdJobFormData")) as JobsFormData;
  return json<loaderData>({ currentJob });
};
=======
import { HStack, VStack, Text, Input, Button } from "@chakra-ui/react";
import { Form, Link } from "@remix-run/react";
import { type ActionArgs, redirect } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  // check if pressed cancel button
  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  // check if pressed back button
  if (body.get("_action") === "back") {
<<<<<<< HEAD
    return redirect("/admin/jobs/create/contract");
=======
    return redirect("/admin/jobs/create/cronjob");
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
  }

  // get current created form data from redis, create if not exists
  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }
<<<<<<< HEAD
=======
  console.log("current: ", current);
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)

  // get provider and network values from form and save in redis
  const checkMethod = body.get("checkMethod");
  const actionMethod = body.get("actionMethod");

<<<<<<< HEAD
=======
  console.log("checkMethod: ", checkMethod);
  console.log("actionMethod: ", actionMethod);

>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
  current.checkMethod = checkMethod as string;
  current.actionMethod = actionMethod as string;
  await redis.set("createdJobFormData", current);

<<<<<<< HEAD
  // redirect to confirm page
  return redirect(`/admin/jobs/create/cron`);
};

export default function StepMethods() {
  const { currentJob } = useLoaderData() as loaderData;

  let currentCheckMethod = currentJob.checkMethod ? currentJob.checkMethod : "";
  let currentActionMethod = currentJob.actionMethod
    ? currentJob.actionMethod
    : "";

  let [checkMethod, setCheckMethod] = react.useState(currentCheckMethod);
  let [actionMethod, setActionMethod] = react.useState(currentActionMethod);

  function onClickCheckMethod(checkMethod: string) {
    setCheckMethod(checkMethod);
  }

  function onClickActionMethod(actionMethod: string) {
    setActionMethod(actionMethod);
  }

  // Get the view and perform methods
  let abi;
  try {
    abi = JSON.parse(currentJob.abi);
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

=======
  console.log("setted");
  // redirect to confirm page
  return redirect(`/admin/jobs/create/privateKey`);
};

export default function StepAddress() {
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <HStack justifyContent={"left"} w={"full"}>
        <VStack alignItems={"start"}>
          <Form method="post">
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Check method
            </Text>
<<<<<<< HEAD

            <Menu closeOnSelect={true}>
              <MenuButton
                id={"ok"}
                as={Button}
                rightIcon={<PolygoSelectIcon />}
              >
                {checkMethod ? checkMethod + "()" : "Select the check method"}
              </MenuButton>
              <MenuList>
                {viewMethods.map((method) => {
                  return (
                    <MenuItem
                      key={method.name}
                      defaultValue={checkMethod}
                      onClick={() => {
                        onClickCheckMethod(method.name);
                      }}
                    >
                      {method.name + "()"}
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
                {actionMethod
                  ? actionMethod + "()"
                  : "Select the action method"}
              </MenuButton>
              <MenuList>
                {actionMethods.map((method) => {
                  return (
                    <MenuItem
                      key={method.name}
                      defaultValue={actionMethod}
                      onClick={() => {
                        onClickActionMethod(method.name);
                      }}
                    >
                      {method.name + "()"}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            <input name="actionMethod" type="hidden" value={actionMethod} />
=======
            <Input
              name="checkMethod"
              type="text"
              placeholder="0x..."
              width={"440px"}
            />
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              Action method
            </Text>
            <Input
              name="actionMethod"
              type="text"
              placeholder="0x..."
              width={"440px"}
            />
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
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
<<<<<<< HEAD
                disabled={checkMethod === "" || actionMethod === ""}
              >
                NEXT
              </Button>
              <Link to="/admin/jobs/create/contract">
=======
              >
                NEXT
              </Button>
              <Link to="/admin/jobs/cronjob">
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
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
<<<<<<< HEAD
        <VStack alignItems={"start"}>
          <Text fontSize={"20px"}>
            Third, select the methods to call in the contract.
          </Text>
          <Text
            as="span"
            fontWeight={"bold"}
            borderBottom={"1px dotted #9FA2B4"}
          >
            Check method:
          </Text>
          <Text color={"GrayText"} fontSize={"18px"}>
            It's a method responsible of checking if the contract needs a call
            to the action method.
          </Text>
          <Text
            as="span"
            fontWeight={"bold"}
            borderBottom={"1px dotted #9FA2B4"}
          >
            Action method:
          </Text>
          <Text color={"GrayText"} fontSize={"18px"}>
            It's a method responsible of doing the action inside the contract.
            Performing this method will spend gas because the execution will
            change the state of the it.
          </Text>
        </VStack>
=======
        <Text color={"GrayText"} fontSize={"25px"}>
          Put your check method. Put your action method.
        </Text>
>>>>>>> c9e50c0 (feat(jobs): created jobs route and child routes in the admin route and connected the webapp with the jobs api.)
      </HStack>
    </HStack>
  );
}
