import {
  HStack,
  VStack,
  Text,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Form, Link, useActionData } from "@remix-run/react";
import { type ActionArgs, redirect, json } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import react from "react";
import * as cronValidator from "node-cron";
import { cronMap } from "../utils/cron-utils";

type actionData =
  | {
      customCronjob: string;
      message: string;
    }
  | undefined;

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  if (body.get("_action") === "cancel") {
    await redis.del("createdJobFormData");
    return redirect("/admin/jobs");
  }

  if (body.get("_action") === "back") {
    return redirect("/admin/jobs/create/address");
  }

  let current = (await redis.get("createdJobFormData")) as JobsFormData;
  if (!current) {
    return redirect("/admin/jobs/create/provider");
  }

  let cronjob = `${body.get("cron")}`;

  let customCronjob = `${body.get("customCron")}`;
  if (customCronjob !== "null") {
    // Check that the cronjob has max 5 '*' fields
    const fields = customCronjob
      .split(" ")
      .reduce((count, c) => count + (c === "*" ? 1 : 0), 0);
    if (fields > 5) {
      return json<actionData>({
        customCronjob,
        message: "Only 5 '*' fields are accepted",
      });
    }

    // Validate the cron format inserted is correct
    const isValid = cronValidator.validate(customCronjob);
    console.log("isValid: ", isValid);

    // const isValid = true;
    if (!isValid) {
      return json<actionData>({ customCronjob, message: "" });
    }

    cronjob = customCronjob;
  }

  current.cronjob = cronjob as string;
  await redis.set("createdJobFormData", current);

  return redirect("/admin/jobs/create/methods");
};

export default function StepCronjob() {
  const cronMapObject = Object.entries(cronMap);
  console.log("cronMapObject: ", cronMapObject);

  let [cron, setCron] = react.useState("");
  let [customCron, setCustomCron] = react.useState("");
  let [title, setTitle] = react.useState("Cron");

  function onCronChange(cron: string) {
    setCron(cron);
    if (cron === "custom") {
      setTitle("Custom cron");
    }
  }

  function onCustomCronChange(customCron: string) {
    setCustomCron(customCron);
  }

  let isDisabled = false;

  const error = useActionData() as actionData;
  if (error?.customCronjob === customCron) {
    isDisabled = true;
  }

  return (
    <HStack justifyContent={"center"} w={"full"} pt={"5px"}>
      <Form method="post">
        <HStack justifyContent={"left"} w={"full"}>
          <VStack alignItems={"start"}>
            <Text fontSize={"20px"} color={"ActiveBorder"}>
              {title}
            </Text>
          </VStack>
        </HStack>

        {cron === "custom" ? (
          <Input
            type="text"
            name="customCron"
            placeholder="* * * * *"
            value={customCron}
            onInput={() => {}}
            onChange={(event) => {
              onCustomCronChange(event.target.value);
            }}
          />
        ) : (
          <Menu>
            <MenuButton id={"ok"} as={Button}>
              {cronMap[cron] ? cronMap[cron] : "Select or insert a cron"}
            </MenuButton>
            <MenuList>
              {cronMapObject.map((item) => {
                return (
                  <MenuItem
                    key={item[0]}
                    onClick={() => {
                      onCronChange(item[0]);
                    }}
                  >
                    {item[1]}
                  </MenuItem>
                );
              })}
              <input name="cron" type="hidden" value={cron} />
            </MenuList>
          </Menu>
        )}

        <Text color={"red.400"}>
          {error ? "The cron format inserted is wrong." : null}
        </Text>

        <Text color={"red.400"}>
          {error?.message !== "" ? error?.message : null}
        </Text>

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
            disabled={
              cron === "" ||
              (cron === "custom" ? customCron === "" : false) ||
              isDisabled
            }
          >
            NEXT
          </Button>
          <Link to="/admin/jobs/create/contract">
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
      <HStack>
        <Text color={"GrayText"} fontSize={"25px"}>
          Put your Cronjob.
        </Text>
      </HStack>
    </HStack>
  );
}
