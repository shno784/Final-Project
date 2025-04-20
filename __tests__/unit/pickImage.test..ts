import pickImage from '@/utils/pickImage';
import * as ImagePicker from 'expo-image-picker';
import { processData } from '@/utils/processData';

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}));
jest.mock('@/utils/ProcessData', () => ({
  __esModule: true,
  processData: jest.fn<Promise<unknown>, [string]>(),
}));

describe('pickImage utility', () => {
  const launchMock = ImagePicker.launchImageLibraryAsync as jest.MockedFunction<
    typeof ImagePicker.launchImageLibraryAsync
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not call processData when the user cancels image picking', async () => {
    // Cancel result must include assets array
    launchMock.mockResolvedValue({ canceled: true, assets: null });

    await pickImage();

    expect(processData).not.toHaveBeenCalled();
  });

  it('calls processData with the selected image URI when picking succeeds', async () => {
    const fakeUri = 'file://fakepath.jpg';
    // Success result must include assets with width and height
    launchMock.mockResolvedValue({
      canceled: false,
      assets: [{ uri: fakeUri, width: 1, height: 1 }],
    });

    await pickImage();

    expect(processData).toHaveBeenCalledTimes(1);
    expect(processData).toHaveBeenCalledWith(fakeUri);
  });

  it('handles errors thrown by ImagePicker gracefully', async () => {
    launchMock.mockRejectedValue(new Error('Picker failure'));

    await expect(pickImage()).resolves.toBeUndefined();

    expect(processData).not.toHaveBeenCalled();
  });
});