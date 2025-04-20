// tests/unit/processData.test.ts
import { processData } from '@/utils/processData';
import * as FileSystem from 'expo-file-system';
import * as GoogleVision from '@/service/GoogleVision';
import * as Usda from '@/service/USDA';
import { useFoodDatabase } from '@/utils/foodDatabase';
import type { FoodItem } from '@/types/FoodTypes';

jest.mock('@/utils/FoodDatabase', () => ({
  useFoodDatabase: () => ({
    insertFoodItem: jest.fn().mockResolvedValue(undefined),
    // ...other methods stubbed if needed
  }),
}));

describe('processData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('processes an image URI', async () => {
    const uri = 'file://image.jpg';
    ;(FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('base64');
    ;(GoogleVision.identifyFood as jest.Mock).mockResolvedValue('Banana');
    ;(Usda.fetchFoodData as jest.Mock).mockResolvedValue({ name: 'Banana', nutrients: '[]' });

    const result = await processData(uri);

    expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    expect(GoogleVision.identifyFood).toHaveBeenCalledWith('base64');
    expect(Usda.fetchFoodData).toHaveBeenCalledWith('Banana');
    expect(result).toEqual({ name: 'Banana', nutrients: '[]' });
  });
});
