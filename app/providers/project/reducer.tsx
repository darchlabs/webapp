import { initialState } from "./constant";
import { ProjectAction, ProjectState, ProjectActionKind, CloudProvider } from "./type";

export function onboardingReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case ProjectActionKind.SET_PASSWORD: {
      return {
        ...state,
        password: action.payload.password,
      };
    }
    case ProjectActionKind.SET_NAME: {
      return {
        ...state,
        name: action.payload.name,
      };
    }
    case ProjectActionKind.SET_ENVIRONMENT: {
      return {
        ...state,
        environment: action.payload.environment,
      };
    }
    case ProjectActionKind.SET_WALLET: {
      return {
        ...state,
        walletProvider: action.payload.provider,
        walletAddress: action.payload.address,
      };
    }
    case ProjectActionKind.SET_CLOUD_PROVIDER: {
      return {
        ...state,
        cloudProvider: action.payload.cloudProvider,
      };
    }
    case ProjectActionKind.SET_CLOUD_K8S: {
      return {
        ...state,
        credentialsK8sConfig: action.payload.config,
      };
    }
    case ProjectActionKind.SET_CLOUD_AWS: {
      return {
        ...state,
        credentialsAwsAccessKeyId: action.payload.accessKeyId,
        credentialsAwsSecretAccessKey: action.payload.secretAccessKey,
        credentialsAwsRegion: action.payload.region,
      };
    }
    case ProjectActionKind.SET_CLOUD_DO: {
      return {
        ...state,
        credentialsDoToken: action.payload.token,
        credentialsDoRegion: action.payload.region,
      };
    }
    case ProjectActionKind.SET_READY: {
      return {
        ...state,
        provisioning: false,
        ready: true,
      };
    }
    case ProjectActionKind.PROVISIONING: {
      return {
        ...state,
        provisioning: true,
        ready: false,
        error: undefined,
      };
    }
    case ProjectActionKind.PROVISIONING_SUCCESS: {
      return {
        ...state,
        provisioning: false,
        ready: true,
        error: undefined,
        url: action.payload.url,
        ip: action.payload.ip,
        privateKey: action.payload.privateKey,
        publicKey: action.payload.publicKey,
        sshUser: action.payload.sshUser,
        kubeConfig: action.payload.kubeConfig,
      };
    }
    case ProjectActionKind.PROVISIONING_FAILURE: {
      return {
        ...state,
        provisioning: false,
        ready: false,
        error: action.payload.error,
      };
    }
    case ProjectActionKind.CLEAR: {
      return initialState;
    }
    case ProjectActionKind.PROVISIONING_CLEAR: {
      return {
        ...state,
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
      };
    }
    case ProjectActionKind.CLEAR_ERROR: {
      return {
        ...state,
        provisioning: false,
        ready: false,
        error: undefined,
      };
    }
    default:
      return state;
  }
}
