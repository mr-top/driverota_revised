import { Client, Account, Databases } from 'appwrite';

const env = import.meta.env;

const Endpoint = env.VITE_APPWRITE_ENDPOINT;
const ProjectID = env.VITE_APPWRITE_PROJECT_ID;

const client = new Client();

client.
  setEndpoint(Endpoint).
  setProject(ProjectID);

const account = new Account(client);
const databases = new Databases(client);

async function ping () {
  try {
    await client.ping();

    return {success: true}
  } catch (error) {
    
    return {success: false, msg: error.message}
  }

}

export {
  ping
}