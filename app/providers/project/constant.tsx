import { AWSRegionWithName, CloudProvider, DoRegionWithName, Environment, ProjectState } from "./type";

// define initial state
export const initialState: ProjectState = {
  name: "",
  password: "",
  environment: "" as Environment,
  walletProvider: undefined,
  walletAddress: undefined,
  cloudProvider: "" as CloudProvider,
  credentialsK8sConfig: undefined,
  credentialsAwsAccessKeyId: undefined,
  credentialsAwsSecretAccessKey: undefined,
  credentialsAwsRegion: undefined,
  credentialsDoToken: undefined,
  credentialsDoRegion: undefined,
  provisioning: false,
  ready: false,
  error: undefined,
  url: "",
  ip: "",
  privateKey: "",
  publicKey: "",
  sshUser: "",
  kubeConfig: "",
};

export const AWSRegions: AWSRegionWithName[] = [
  {
    name: "US East (N. Virginia)",
    slug: "us-east-1",
  },
  {
    name: "US West (N. California)",
    slug: "us-west-1",
  },
];

export const DORegions: DoRegionWithName[] = [
  {
    name: "New York 1",
    slug: "nyc1",
  },
];
