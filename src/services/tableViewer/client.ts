export class ClientService {
  getAllTables = async () => [
    { count: 0, name: 'test' },
    { count: 0, name: 'test2' },
  ];

  getTableDetails = async (tableName: string) => {
    void tableName; // unused parameter
    return [{ name: 'test' }];
  };

  getTableData = async (tableName: string) => {
    void tableName; // unused parameter
    return [{ name: 'test' }];
  };
}
