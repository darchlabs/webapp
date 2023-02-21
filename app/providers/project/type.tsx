import { ReactNode } from "react";
import { ArrayDestructuringAssignment } from "typescript";

export type ProjectState = {
  name: string;
  password: string;
  environment: Environment;
  walletProvider?: WalletProvider;
  walletAddress?: string;
  cloudProvider: CloudProvider;
  credentialsK8sConfig?: string;
  credentialsAwsAccessKeyId?: string;
  credentialsAwsSecretAccessKey?: string;
  credentialsAwsRegion?: AWSRegion;
  credentialsDoToken?: string;
  credentialsDoRegion?: DORegion;

  // TODO(ca): check how its the best way to manage internal values
  provisioning: boolean;
  ready: boolean;
  error: Error | undefined;

  url: string;
  ip: string;
  kubeConfig: string;
  privateKey: string;
  publicKey: string;
  sshUser: string;
};

export enum ProjectActionKind {
  SET_NAME = "SET_NAME",
  SET_PASSWORD = "SET_PASSWORD",
  SET_ENVIRONMENT = "SET_ENVIRONMENT",
  SET_WALLET = "SET_WALLET",
  SET_CLOUD_PROVIDER = "SET_CLOUD_PROVIDER",
  SET_CLOUD_CREDENTIALS = "SET_CLOUD_CREDENTIALS",
  SET_CLOUD_K8S = "SET_CLOUD_K8S",
  SET_CLOUD_AWS = "SET_CLOUD_AWS",
  SET_CLOUD_DO = "SET_CLOUD_DO",
  SET_READY = "SET_READY",
  PROVISIONING = "PROVISIONING",
  PROVISIONING_SUCCESS = "PROVISIONING_SUCCESS",
  PROVISIONING_FAILURE = "PROVIISIONING_FAILURE",
  PROVISIONING_CLEAR = "PROVISIONING_CLEAR",
  CLEAR_ERROR = "CLEAR_ERROR",
  CLEAR = "CLEAR",
}

export type Environment = "development" | "production";
export type WalletProvider = "metamask" | "walletconnect";
export type CloudProvider = "kubernetes" | "aws" | "azure" | "do" | "gcp";

export type K8SCredential = {
  config: string;
};

export type AWS = "accessKeyId" | "secretAccessKey" | "region";
export type AWSRegion = "us-east-1" | "us-west-1";
export type AWSCredential = {
  accessKeyId: string;
  secretAccessKey: string;
  region: AWSRegion;
};
export type AWSRegionWithName = {
  name: string;
  slug: AWSRegion;
};

export type DO = "token" | "region";
export type DORegion = "nyc1";
export type DOCredential = {
  token: string;
  region: DORegion;
};
export type DoRegionWithName = {
  name: string;
  slug: DORegion;
};

export type ProjectProviderProps = {
  children: ReactNode;
};

export type ProjectAction =
  | { type: ProjectActionKind.SET_PASSWORD; payload: { password: string } }
  | { type: ProjectActionKind.SET_NAME; payload: { name: string } }
  | { type: ProjectActionKind.SET_ENVIRONMENT; payload: { environment: Environment } }
  | { type: ProjectActionKind.SET_WALLET; payload: { provider: WalletProvider; address: string } }
  | { type: ProjectActionKind.SET_CLOUD_PROVIDER; payload: { cloudProvider: CloudProvider } }
  | { type: ProjectActionKind.SET_CLOUD_K8S; payload: K8SCredential }
  | { type: ProjectActionKind.SET_CLOUD_AWS; payload: AWSCredential }
  | { type: ProjectActionKind.SET_CLOUD_DO; payload: DOCredential }
  | { type: ProjectActionKind.PROVISIONING }
  | {
      type: ProjectActionKind.PROVISIONING_SUCCESS;
      payload: { url: string; ip: string; privateKey: string; publicKey: string; sshUser: string; kubeConfig: string };
    }
  | { type: ProjectActionKind.PROVISIONING_FAILURE; payload: { error: Error } }
  | { type: ProjectActionKind.PROVISIONING_CLEAR }
  | { type: ProjectActionKind.CLEAR_ERROR }
  | { type: ProjectActionKind.SET_READY }
  | { type: ProjectActionKind.CLEAR };

export type ProjectDispatch = React.Dispatch<ProjectAction>;
