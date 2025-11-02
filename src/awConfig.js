import { Client, Account, Databases, Functions, Storage, Query, ID } from 'appwrite';

const env = import.meta.env;

const Endpoint = env.VITE_APPWRITE_ENDPOINT;
const ProjectID = env.VITE_APPWRITE_PROJECT_ID;
const DatabaseID = env.VITE_APPWRITE_DATABASE_ID;
const UsersID = env.VITE_APPWRITE_USERS_ID;
const ClassroomID = env.VITE_APPWRITE_CLASSROOM_ID;
const MeetingsID = env.VITE_APPWRITE_MEETINGS_ID;
const PrefsID = env.VITE_APPWRITE_PREFS_ID;

const createUserFunctionID = env.VITE_CREATE_USER_FUNCTION_ID;
const sendCodeFunctionID = env.VITE_SEND_CODE_FUNCTION_ID;
const updateAccountFunctionID = env.VITE_UPDATE_ACCOUNT_FUNCTION_ID;
const updatePersonalFunctionID = env.VITE_UPDATE_PERSONAL_FUNCTION_ID;
const changeClassroomFunctionID = env.VITE_CHANGE_CLASSROOM_FUNCTION_ID;
const updateJstudentFunctionID = env.VITE_UPDATE_JSTUDENT_FUNCTION_ID;

const profileImagesStorageID = env.VITE_PROFILE_IMAGES_STORAGE_ID;
const classroomImagesStorageID = env.VITE_CLASSROOM_IMAGES_STORAGE_ID;

const client = new Client();

client.
  setEndpoint(Endpoint).
  setProject(ProjectID);

const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);

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

async function sendCode(email) {
  try {
    const result = await functions.createExecution(sendCodeFunctionID,
      JSON.stringify(
        {
          email
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
    const userResult = await getProfile(credentials.$id);

    let result;

    if (userResult.success) {
      const user = userResult.profile;
      result = await databases.getDocument(DatabaseID, ClassroomID, user.classroomId);
    } else {
      result = await databases.getDocument(DatabaseID, ClassroomID, credentials.classroomId);
    }

    const instructorResult = await getProfile(result.instructorId);

    if (instructorResult.success) {
      result.instructorName = instructorResult.profile.name;
    }

    return { success: true, classroom: result }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function lookupClassroom(instructorCode) {
  try {
    const result = await databases.listDocuments(DatabaseID, ClassroomID, [
      Query.equal('instructorCode', instructorCode)
    ]);

    if (!result.total) throw Error('Classroom not found with this ID');

    const classroom = result.documents[0];

    const instructorResult = await getProfile(classroom.instructorId);

    if (instructorResult.success) {
      classroom.instructorName = instructorResult.profile.name;
    }

    return { success: true, classroom }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function changeClassroom(userId, oldClassroomId, newClassroomId) {
  try {
    const result = await functions.createExecution(changeClassroomFunctionID,
      JSON.stringify(
        {
          userId,
          oldClassroomId,
          newClassroomId
        }
      )
    ).then(result => JSON.parse(result.responseBody));

    return { success: true, msg: result.msg }
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

    return { success: true, notificationChanged, newsletterChanged }
  } catch (error) {
    return { success: false, msg: error.message, notificationChanged, newsletterChanged }
  }
}

async function updateAccount(userId, email, password, code) {
  try {
    const result = await functions.createExecution(updateAccountFunctionID,
      JSON.stringify(
        {
          userId,
          email,
          password,
          code
        }
      )
    ).then(result => JSON.parse(result.responseBody));

    return result
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function updatePersonal(userId, name) {
  try {
    const result = await functions.createExecution(updatePersonalFunctionID,
      JSON.stringify(
        {
          userId,
          name
        }
      )
    ).then(result => JSON.parse(result.responseBody));

    return result;
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function getClassroomImage(fileId) {
  try {
    const result = await storage.getFileView(classroomImagesStorageID, fileId);

    const fetchResult = await fetch(result);

    if (fetchResult.status !== 200) throw Error('Failed to load image');

    return { success: true, image: result };
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function getProfileImage(userId) {
  try {
    const result = await storage.getFileView(profileImagesStorageID, userId);

    const fetchResult = await fetch(result);

    if (fetchResult.status !== 200) throw Error('Failed to load image');

    return { success: true, image: result };
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function updateClassroomImage(classroomId, image) {
  try {
    const result = await storage.createFile(classroomImagesStorageID, ID.unique(), image);

    const classroomResult = await databases.updateDocument(DatabaseID, ClassroomID, classroomId, {
      pictureId: result.$id
    });

    return { success: true };
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function updateClassroomName(classroomId, name) {
  try {
    const result = await databases.updateDocument(DatabaseID, ClassroomID, classroomId,
      {
        name
      }
    )

    return { success: true }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function getMeetings(classroomId) {
  try {
    const result = await databases.listDocuments(DatabaseID, MeetingsID, [
      Query.equal('classroomId', classroomId)
    ]);

    return { success: true, meetings: result.documents }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function getPeople(peopleArray) {
  try {
    const result = await databases.listDocuments(DatabaseID, UsersID, [
      Query.equal('$id', ['placeholder', ...peopleArray]),
    ]);

    return { success: true, people: result.documents }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function getInstructors(classroomId) {
  try {
    const result = await databases.listDocuments(DatabaseID, UsersID, [
      Query.equal('student', false),
      Query.equal('classroomId', classroomId)
    ]);

    return { success: true, instructors: result.documents }
  } catch (error) {
    return { success: false, msg: error.message }
  }
}

async function getPrefs(classroomId) {
  try {
    const instructorsResult = await databases.listDocuments(DatabaseID, UsersID, [
      Query.equal('student', false),
      Query.equal('classroomId', classroomId),
      Query.select('$id')
    ]);

    const result = await databases.listDocuments(DatabaseID, PrefsID, [
      Query.equal('$id', ['placeholder', ...instructorsResult.documents.map(instructor => instructor.$id)])
    ]);

    console.log(result);

    return { success: true, prefs: result.documents }
  } catch (error) {
    console.log(error);
    return { success: false, msg: error.message }
  }
}

async function updateJstudent(userId, classroomId) {
  try {
    const result = await functions.createExecution(updateJstudentFunctionID,
      JSON.stringify(
        {
          userId,
          classroomId
        }
      )
    ).then(result => JSON.parse(result.responseBody));

    return result;
  } catch (error) {
    return { success: false, msg: error.message }
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
  updatePrivacy,
  updateAccount,
  updatePersonal,
  getClassroomImage,
  updateClassroomImage,
  updateClassroomName,
  lookupClassroom,
  changeClassroom,
  getMeetings,
  getProfileImage,
  getPeople,
  getPrefs,
  updateJstudent
}