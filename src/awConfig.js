import { Client, Account, Databases, Functions } from 'appwrite';

const env = import.meta.env;

const Endpoint = env.VITE_APPWRITE_ENDPOINT;
const ProjectID = env.VITE_APPWRITE_PROJECT_ID;
const DatabaseID = env.VITE_APPWRITE_DATABASE_ID;
const UsersID = env.VITE_APPWRITE_USERS_ID;

const createUserFunctionID = env.VITE_CREATE_USER_FUNCTION_ID;
const sendCodeFunctionID = env.VITE_SEND_CODE_FUNCTION_ID;

const client = new Client();

client.
  setEndpoint(Endpoint).
  setProject(ProjectID);

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);

async function ping() {
  try {
    await client.ping();

    return { success: true }
  } catch (error) {

    return { success: false, msg: error.message }
  }
}

async function deleteSession() {
  try {
    await account.deleteSession('current');

    return { success: true }
  } catch (error) {

    return { success: false, msg: error.message }
  }
}

async function createSession(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return { success: true, profile: { logged: true, id: session.userId } }
  } catch (error) {

    return { success: false, msg: error.message }
  }
}

async function createUser(credentials) {
  try {
    const result = await functions.createExecution(createUserFunctionID,
      JSON.stringify(
        {
          credentials
        }
      )
    ).then(result => JSON.parse(result.responseBody));

    console.log(result);

    return { success: result.success, msg: result.msg }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function getProfile(userId) {
  try {
    const result = await databases.getDocument(DatabaseID, UsersID, userId);

    return { success: true, profile: result }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function sendCode(credentials) {
  try {
    const result = await functions.createExecution(sendCodeFunctionID,
      JSON.stringify(
        {
          email: credentials.email
        }
      )
    ).then(result => JSON.parse(result.responseBody));

    console.log(result);

    return { success: result.success, msg: result.msg }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

export {
  ping,
  deleteSession,
  createSession,
  getProfile,
  createUser,
  sendCode
}