import { Client, Account, Databases } from 'appwrite';

const env = import.meta.env;

const Endpoint = env.VITE_APPWRITE_ENDPOINT;
const ProjectID = env.VITE_APPWRITE_PROJECT_ID;
const DatabaseID = env.VITE_APPWRITE_DATABASE_ID;
const UsersID = env.VITE.APPWRITE_USERS_ID;

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

async function deleteSession () {
  try {
    await account.deleteSession('current');

    return {success: true}
  } catch (error) {

    return {success: false, msg: error.message}
  }
}

async function createSession (email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    const result = await databases.getDocument(DatabaseID, UsersID, session.userId);

    return { success: true, profile: result }
  } catch (error) {
    
    return { success: false, msg: error.message }
  }
}

export {
  ping,
  deleteSession,
  createSession
}