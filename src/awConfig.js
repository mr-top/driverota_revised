import { Client, Account, Databases, Functions } from 'appwrite';

const env = import.meta.env;

const Endpoint = env.VITE_APPWRITE_ENDPOINT;
const ProjectID = env.VITE_APPWRITE_PROJECT_ID;
const DatabaseID = env.VITE_APPWRITE_DATABASE_ID;
const UsersID = env.VITE_APPWRITE_USERS_ID;
const ClassroomID = env.VITE_APPWRITE_CLASSROOM_ID;

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

async function getSession() {
  try {
    const result = await account.getSession('current');

    return { success: true, session: result }
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

async function getClassroom(credentials) {
  try {
    const result = await databases.getDocument(DatabaseID, ClassroomID, credentials.classroomId);

    if (result) {
      if (!result.students.includes(credentials.$id) && result.instructorId !== credentials.$id) {
        throw Error("You're not found in this classroom");
      };
    }

    return { success: true, classroom: result }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function updatePrivacy(userId, notification, newsletter) {
  let notificationChanged = false;
  let newsletterChanged = false;

  try {
    if (notification.changed) {
      const result = await databases.updateDocument(DatabaseID, UsersID, userId, {
        notificationPreference: notification.level
      });
      notificationChanged = true;
    }

    if (newsletter.changed) {
      const result = await databases.updateDocument(DatabaseID, UsersID, userId, {
        newsletterPreference: newsletter.level
      });
      newsletterChanged = true;
    }

    return {success: true, notificationChanged, newsletterChanged}
  } catch (error) {
    return {success: true, msg: error.message, notificationChanged, newsletterChanged}
  }
}

export {
  ping,
  deleteSession,
  getSession,
  createSession,
  getProfile,
  createUser,
  sendCode,
  getClassroom,
  updatePrivacy
}