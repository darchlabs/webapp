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
import { Form, Link, useLoaderData } from "@remix-run/react";
import { type ActionArgs, redirect, json } from "@remix-run/node";
import { redis } from "~/pkg/redis/redis.server";
import type { JobsFormData } from "~/pkg/jobs/types";
import react from "react";

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
  console.log("current");

  let cronjob = `${body.get("cron")}`;

  const customCronjob = body.get("customCron");
  if (customCronjob) {
    cronjob = `${customCronjob}`;
  }

  current.cronjob = cronjob as string;
  console.log("actual cron: ", cronjob);

  await redis.set("createdJobFormData", current);

  return redirect("/admin/jobs/create/methods");
};

export const cronMap = {
  "0 * * * *": "Every minute",
  "0 */15 * * *": "Every 15 minutes",
  "0 */30 * * *": "Every 30 minutes",
  "0 0 * * *": "Every hour",
  "0 0 0 * *": "Every day",
  "0 0 0 0 *": "Every month",
  custom: "Custom cron",
};

export default function StepCron() {
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

  // TODO(nb): validate cronjob format is right
  function onCustomCronChange(customCron: string) {
    setCustomCron(customCron);
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
              cron === "" || cron === "custom" ? customCron === "" : false
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

/* <Input
              name="cronjob"
              type="text"
              placeholder="* * * * * *"
              width={"440px"}
              onChange={(event) => {
                onCronChange(event.target.value);
              }}
            /> */
