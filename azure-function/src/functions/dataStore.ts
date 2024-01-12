import { CosmosClient } from "@azure/cosmos";

class CosmosDBWrapper {
    private client: CosmosClient;
    private container: string;

    constructor(connectionString?: string, container?: string) {
        const defaultConnectionString = process.env.COSMOSDB_CONNECTION_STRING;
        const defaultContainer = process.env.COSMOSDB_CONTAINER;

        if (!connectionString && !defaultConnectionString || !container && !defaultContainer) {
            throw new Error("Missing environment variables for CosmosDB connection");
        }

        this.client = new CosmosClient(connectionString || defaultConnectionString);
        this.container = container || defaultContainer;
    }

    async saveThreadId(userKey: string, threadId: string): Promise<void> {
        const database = this.client.database("your-database-name");
        const container = database.container(this.container);

        const item = {
            id: userKey,
            threadId: threadId,
        };

        await container.items.upsert(item);
    }

    async getThreadId(userKey: string): Promise<string | undefined> {
        const database = this.client.database("your-database-name");
        const container = database.container(this.container);

        const { resource: item } = await container.item(userKey).read();

        return item?.threadId;
    }
}

export default CosmosDBWrapper;
