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
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, ActionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import react from "react";
import * as cronValidator from "node-cron";
import { cronMap } from "../utils/cron-utils";

type loaderData = {
  currentJob: JobsFormData;
};

export const loader: LoaderFunction = async () => {
  const currentJob = (await redis.get("createdJobFormData")) as JobsFormData;
  return json<loaderData>({ currentJob });
};

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
    if (fields > 6) {
      return json<actionData>({
        customCronjob,
        message: "Only 6 '*' fields are accepted",
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

  return redirect("/admin/jobs/create/account");
};

export default function StepCronjob() {
  const { currentJob } = useLoaderData() as loaderData;
  let currentCron = currentJob.cronjob ? currentJob.cronjob : "";
  let currentCustomCron = "";
  console.log("currenCron: ", currentCron);
  console.log("cronMap.has(currentCron): ", cronMap.has(currentCron));

  if (currentCron !== "" && !cronMap.has(currentCron)) {
    currentCustomCron = currentCron;
    currentCron = "custom";
  }

  const currentTitle = currentCustomCron !== "" ? "Custom cron" : "Cron";

  let [cron, setCron] = react.useState(currentCron);
  let [customCron, setCustomCron] = react.useState(currentCustomCron);
  let [title, setTitle] = react.useState(currentTitle);

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

  const cronMapArr = Array.from(cronMap);
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
            placeholder="* * * * * *"
            value={customCron}
            defaultValue={customCron}
            onInput={() => {}}
            onChange={(event) => {
              onCustomCronChange(event.target.value);
            }}
          />
        ) : (
          <Menu>
            <MenuButton id={"ok"} as={Button}>
              {cronMap.get(cron)
                ? cronMap.get(cron)
                : "Select or insert a cron"}
            </MenuButton>
            <MenuList>
              {cronMapArr.map(([key, value]) => {
                return (
                  <MenuItem
                    key={key}
                    onClick={() => {
                      onCronChange(key);
                    }}
                  >
                    {value}
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
          <Link to="/admin/jobs/create/methods">
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
