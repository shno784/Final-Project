import { processData } from '@/utils/ProcessData';
import * as FileSystem from 'expo-file-system';
import * as GoogleVision from '@/service/GoogleVision';
import * as UsdaService from '@/service/Usda';
import { useFoodDatabase } from '@/utils/FoodDatabase';

// Mock all external dependencies to resolve immediately
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
  EncodingType: { Base64: 'base64' },
}));
jest.mock('@/service/GoogleVision', () => ({
  identifyFood: jest.fn(),
}));
jest.mock('@/service/Usda', () => ({
  fetchFoodData: jest.fn(),
}));
jest.mock('@/utils/FoodDatabase', () => ({
  useFoodDatabase: () => ({
    createTable: jest.fn(),
    insertFoodItem: jest.fn().mockResolvedValue(undefined),
    getAllFoodItems: jest.fn(),
    getFoodItemById: jest.fn(),
    updateFoodItem: jest.fn(),
    deleteFoodItem: jest.fn(),
  }),
}));

describe('Performance: image-to-nutrition timing', () => {
  // Increase timeout for performance test if needed
  jest.setTimeout(10000);

  it('completes processData within 5 seconds', async () => {
    // Arrange: stub implementations
    (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue('base64');
    (GoogleVision.identifyFood as jest.Mock).mockResolvedValue('Banana');
    (UsdaService.fetchFoodData as jest.Mock).mockResolvedValue({
      name: 'Banana',
      imageUri: 'uri',
      nutrients: '[]',
    });

    const start = Date.now();
    await processData('file://image.jpg');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000);
  });
});