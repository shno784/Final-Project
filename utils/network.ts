import NetInfo from "@react-native-community/netinfo";

// Check if the device is online
export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}