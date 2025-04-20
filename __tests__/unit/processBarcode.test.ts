// tests/unit/ProccessBarcode.test.ts
import ProcessBarcode from '@/utils/proccessBarcode';
import * as OpenFoodFacts from '@/service/OpenFoodFacts';
import type { FoodItem } from '@/types/FoodTypes';

describe('ProcessBarcode', () => {
  let barcodeScanSpy: jest.SpyInstance<Promise<FoodItem>, [string]>;
  let insertFoodItemMock: jest.Mock<Promise<void>, [FoodItem]>;

  beforeEach(() => {
    // Spy on the actual BarcodeScan function
    barcodeScanSpy = jest.spyOn(OpenFoodFacts, 'BarcodeScan');
    // Create a mock for insertFoodItem(food: FoodItem): Promise<void>
    insertFoodItemMock = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls insertFoodItem with scanned data and returns null on success', async () => {
    const fakeBarcode = '123456789';
    // Must include imageUri to satisfy the inferred return type of BarcodeScan
    const fakeData: FoodItem = {
      name: 'Test Food',
      imageUri: 'https://example.com/food.jpg',
      nutrients: '[]',
    };

    barcodeScanSpy.mockResolvedValueOnce(fakeData);

    const result = await ProcessBarcode(fakeBarcode, insertFoodItemMock);

    expect(barcodeScanSpy).toHaveBeenCalledWith(fakeBarcode);
    expect(insertFoodItemMock).toHaveBeenCalledWith(fakeData);
    expect(result).toBeNull();
  });

  it('returns error string when BarcodeScan throws', async () => {
    const fakeBarcode = '000000';
    barcodeScanSpy.mockRejectedValueOnce(new Error('Network error'));

    const result = await ProcessBarcode(fakeBarcode, insertFoodItemMock);

    expect(insertFoodItemMock).not.toHaveBeenCalled();
    expect(result).toBe('Error processing barcode');
  });
});
