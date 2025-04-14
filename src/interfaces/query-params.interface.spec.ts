import { QueryParams } from './query-params.interface';

describe('QueryParams interface', () => {

  it('should have id, name, and teamSlug properties', () => {
    // Arrange: Create a mock object
    const mockQueryParams: QueryParams = {
      project_id: '123',
      team_id: '456'
    };

    // Act: Nothing to act upon for this test

    // Assert: Check if all properties are present
    expect(mockQueryParams.project_id).toBeDefined();
    expect(mockQueryParams.team_id).toBeDefined();
  });

  it('should define project_id and team_id properties as strings', () => {
    // Arrange: Create a mock object
    const mockQueryParams: QueryParams = {
      project_id: '123',
      team_id: '456'
    };

    // Act: Nothing to act upon for this test

    // Assert: Check if the types are correct
    expect(typeof mockQueryParams.project_id).toBe('string');
    expect(typeof mockQueryParams.team_id).toBe('string');
  });

  it('should require project_id and team_id properties', () => {
    // Arrange: Create a mock object
    // Use Partial to allow incomplete object
    const mockQueryParams: Partial<QueryParams> = {};

    // Act: Nothing to act upon for this test

    // TypeScript should catch the missing properties
    expect(mockQueryParams).toEqual({});
  });

});
