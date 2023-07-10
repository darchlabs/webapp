import { useEffect, useState } from "react";
import { type SmartContract } from "darchlabs";
import { useFetcher } from "@remix-run/react";
import { useInterval } from "usehooks-ts";
import {
  type HistoricalMetric,
  type OverviewHistoricalMetricActionData,
} from "@routes/overview.historical-metric.action";
import { format } from "date-fns";
import { Intervals, type Interval } from "@utils/intervals";
import { BsChevronDown } from "react-icons/bs";
import {
  CircularProgress,
  HStack,
  VStack,
  Text,
  useToast,
  GridItem,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { FormatNumber } from "@utils/format-number";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export const MetricChart = ({
  text,
  metric,
  contract,
  customInterval,
  type,
}: {
  text: string;
  metric: HistoricalMetric;
  contract: SmartContract;
  customInterval: Interval;
  type: "line" | "bar";
}) => {
  // define hooks
  const fetcher = useFetcher();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [labels, setLabels] = useState([] as string[]);
  const [points, setPoints] = useState([] as number[]);
  // TODO(ca): see what is the best approach for the UI in old and new contracts
  const [interval, setInterval] = useState(customInterval as Interval);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return FormatNumber(value, 1);
          },
        },
      },
      x: {
        ticks: {
          callback: function (index: number) {
            return format(new Date(Number(labels[index]) * 1000), Intervals[interval].pattern);
          },
        },
      },
    },
  };

  // define data for using in the chart
  const data = {
    labels,
    datasets: [
      {
        label: text,
        labels: labels,
        data: points,
        borderColor: "#ED64A6",
        backgroundColor: "#ED64A6",
      },
    ],
  };

  let chart;
  if (type === "line") {
    chart = <Line options={options as any} data={data} />;
  } else if (type === "bar") {
    chart = <Bar options={options as any} data={data} />;
  } else {
    throw new Error(`invalid type_chart=${type}`);
  }

  // fetch for getting status at the first time
  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      const now = new Date();
      const ts = Math.floor(now.getTime() / 1000);

      setIsLoading(true);
      fetcher.submit(
        {
          startTime: (ts - Intervals[interval].diff).toString(),
          endTime: ts.toString(),
          interval: Intervals[interval].interval.toString(),
          metric: "historical-gas-used",
          address: contract.address,
        },
        {
          method: "post",
          action: "/overview/historical-metric/action",
        }
      );
    }
  }, [fetcher, contract.address, interval]);

  // check if fetched is resolved and has data
  useEffect(() => {
    if (fetcher.state === "loading") {
      const actionData = fetcher.data as OverviewHistoricalMetricActionData;
      if (actionData && actionData.metric === metric) {
        setIsLoading(false);

        // check if action data has error
        if (actionData.error) {
          toast({
            title: "Metric Error",
            description: actionData.error,
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
          });
        } else {
          setPoints(actionData.points);
          setLabels(actionData.labels);
        }
      }
    }
  }, [fetcher.state, fetcher.data, metric, toast]);

  // define interval for getting status every 10 seconds
  useInterval(() => {
    const now = new Date();
    const ts = Math.floor(now.getTime() / 1000);

    fetcher.submit(
      {
        startTime: (ts - Intervals[interval].diff).toString(),
        endTime: ts.toString(),
        interval: Intervals[interval].interval.toString(),
        metric: "historical-gas-used",
        address: contract.address,
      },
      {
        method: "post",
        action: "/overview/historical-metric/action",
      }
    );
  }, 10000);

  // define handlers
  function handleOnClick(newInterval: Interval) {
    if (interval !== newInterval) {
      setInterval(newInterval);
    }
  }

  return (
    <GridItem
      w="100%"
      bg="white"
      colSpan={[4, 4, 3]}
      borderWidth={"1px"}
      borderStyle={"solid"}
      borderColor={"blackAlpha.200"}
      borderRadius={"8px"}
      p={5}
    >
      <VStack w="full">
        <HStack w="full" justifyContent={"space-between"} pb={5}>
          <Text color="blackAlpha.800" fontWeight={"bold"}>
            {text}
          </Text>
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              color="blackAlpha.500"
              fontWeight={"normal"}
              rightIcon={<BsChevronDown />}
            >
              {Intervals[interval].title}
            </MenuButton>
            <MenuList w={40} minW={40}>
              {Object.values(Intervals).map((data, index) => (
                <MenuItem key={index} onClick={() => handleOnClick(data.key)}>
                  {data.title}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </HStack>
      </VStack>

      {isLoading ? (
        <HStack justifyContent={"center"} alignItems={"center"}>
          <CircularProgress isIndeterminate color="pink.400" size={"25px"} />
        </HStack>
      ) : (
        chart
      )}
    </GridItem>
  );
};
