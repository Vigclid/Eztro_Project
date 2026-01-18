interface Environments {
  SERVER_URI: string | undefined;
}

const environments: Environments = {
  SERVER_URI: process.env.EXPO_PUBLIC_SERVER_URI as string,
};

export default environments;
