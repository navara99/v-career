const getData = ({ rows }) => rows;
const getFirstRecord = (result) => getData(result)[0];

const queryGenerator = (db) => {
  const createNewUser = async (userInfo) => {
    const { email, password, username, firstName, lastName } = userInfo;
    const values = [email, password, username, firstName, lastName];
    const queryString = `
      INSERT INTO users (email, password, username, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    try {
      const result = await db.query(queryString, values);
      const newUserInfo = getFirstRecord(result);

      return newUserInfo;
    } catch (err) {
      console.log(err);
    }
  };

  const getUserByValue = async (columnName, value) => {
    const values = [value];
    const queryString = `SELECT * FROM users WHERE ${columnName} = $1;`;

    try {
      const result = await db.query(queryString, values);
      const userInfo = getFirstRecord(result);

      return userInfo;
    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async (newUserInfo) => {
    const {
      firstName,
      lastName,
      username,
      email,
      bio,
      profilePicture,
      userId,
    } = newUserInfo;
    const value1 = [userId];
    let filePath = newUserInfo.filePath;
    if (!filePath) {
      const resultResume = await db.query(
        `SELECT users.resume FROM users WHERE id = $1`,
        value1
      );
      filePath = getFirstRecord(resultResume)["resume"];
    }
    const values = [
      firstName,
      lastName,
      username,
      email,
      bio,
      profilePicture,
      filePath,
      userId,
    ];

    const queryString = `
        UPDATE users
        SET first_name = $1,
        last_name = $2,
        username = $3,
        email = $4,
        bio = $5,
        profile_picture= $6,
        resume = $7
        WHERE id = $8
        RETURNING *;
    `;

    try {
      const result = await db.query(queryString, values);
      const userInfo = getFirstRecord(result);
      return userInfo;
    } catch (err) {
      console.log(err);
    }
  };

  const updatePasswordById = async (id, password) => {
    const values = [id, password];
    const queryString = `
      UPDATE users SET password = $2 WHERE id = $1
      RETURNING *;
      `;

    try {
      const result = await db.query(queryString, values);
      const userInfo = getFirstRecord(result);

      return userInfo;
    } catch (err) {
      console.log(err);
    }
  };

  const getAllFairs = async () => {
    const queryString = `SELECT * FROM fairs;`;

    try {
      const result = await db.query(queryString);
      const data = getData(result);

      return data;
    } catch (err) {
      console.log(err);
    }
  };

  // Individual Fair
  const getFair = async (fair_id) => {
    const values = [fair_id];
    const queryString = `
    SELECT 
    fairs.id as Fair_Id, 
    fairs.description as Fair_Desc, 
    fairs.name as Fair_Name, 
    fairs.poster as POSTER, 
    (SELECT organizations.name FROM organizations WHERE host_id = organizations.id)as Host_Name, 
    organizations.id as Organizations_Id, 
    organizations.name as Organizations_Name, 
    organizations.description as Organizations_Desc 
    FROM fairs
    JOIN fairs_organizations ON (fairs.id = fairs_organizations.fair_id) 
    JOIN organizations ON (organizations.id = fairs_organizations.organization_id)
    WHERE fairs.id = $1
    `;

    try {
      const result = await db.query(queryString, values);
      return getData(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const createNewOrganization = async ({
    name,
    description,
    email,
    industry,
    website,
    logo,
  }) => {
    const values = [name, description, email, industry, website, logo];
    const queryString = `
      INSERT INTO organizations (name, description, email, industry, website, logo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    try {
      const result = await db.query(queryString, values);
      const newOrganizationInfo = getFirstRecord(result);
      return newOrganizationInfo;
    } catch (err) {
      console.log(err);
    }
  };

  const addUserToOrganization = async (user_id, organization_id, admin) => {
    const values = [user_id, organization_id, admin];
    const queryString = `
      INSERT INTO users_organizations (user_id, organization_id, admin)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    try {
      await db.query(queryString, values);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getOrganizationsByUser = async (user_id) => {
    const values = [user_id];
    const queryString = `
    SELECT organizations.*
    FROM users_organizations
    JOIN users ON users.id = users_organizations.user_id
    JOIN organizations ON organizations.id = users_organizations.organization_id
    GROUP BY organizations.id, users_organizations.user_id, users_organizations.admin
    HAVING users_organizations.user_id = $1;`;

    try {
      const result = await db.query(queryString, values);
      const { rows } = result;
      return rows;
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAllOtherUsers = async (user_id) => {
    const values = [user_id];
    const queryString = `
    SELECT * FROM users
    WHERE users.id <> $1;
    `;

    try {
      const result = await db.query(queryString, values);
      const { rows } = result;
      return rows;
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAllApplicationsByJobId = async (job_id) => {
    const values = [job_id];
    const queryString = `
    SELECT 
    applications.id, 
    applications.resume, 
    applications.user_id, 
    applications.job_id, 
    applications.message,
    applications.created_at, 
    users.first_name, 
    users.last_name, 
    users.email, 
    users.profile_picture, 
    users.username,users.bio, 
    organizations.name AS organization_name FROM applications
    JOIN jobs ON jobs.id = applications.job_id
    JOIN users ON applications.user_id = users.id
    JOIN organizations ON jobs.organization_id = organizations.id
    WHERE jobs.id = $1;
    `;

    try {
      const result = await db.query(queryString, values);
      return result.rows;
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAllJobsByOrganizationId = async (
    organization_id,
    applicationsNotIncluded
  ) => {
    const values = [organization_id];
    const queryString = `
    SELECT jobs.* ,
    organizations.logo as organizationLogo,
    organizations.name as organizationName
    FROM jobs
    JOIN organizations ON jobs.organization_id = organizations.id
    WHERE organizations.id = $1
    ORDER BY jobs.created_at DESC;
    `;

    try {
      const result = await db.query(queryString, values);
      if (applicationsNotIncluded) return getData(result);
      const jobs = await Promise.all(
        result.rows.map(async (job) => {
          const jobWithApplicationArr = await getAllApplicationsByJobId(job.id);
          return { ...job, applications: jobWithApplicationArr };
        })
      );
      return jobs;
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAllMembersByOrganizationId = async (organization_id) => {
    const values = [organization_id];
    const queryString = `
    SELECT users.*, users_organizations.admin FROM users
    JOIN users_organizations ON users.id = users_organizations.user_id
    WHERE users_organizations.organization_id = $1
    ORDER BY users.first_name;
    `;

    try {
      const result = await db.query(queryString, values);
      return result.rows;
    } catch (err) {
      console.log(err.message);
    }
  };

  const checkIfIAmMember = async (organization_id, user_id) => {
    const values = [organization_id, user_id];
    const queryString = `
    SELECT COUNT(*)
    FROM users_organizations
    WHERE organization_id = $1 AND user_id = $2;
    `;

    try {
      const result = await db.query(queryString, values);
      const { count } = getFirstRecord(result);
      return Number(count) ? true : false;
    } catch (err) {
      console.log(err.message);
    }
  };

  const getOrganizationDetails = async (organization_id) => {
    const values = [organization_id];
    const queryString = `
    SELECT organizations.*
    FROM organizations
    WHERE organizations.id = $1;
    `;

    try {
      const result = await db.query(queryString, values);
      return getFirstRecord(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getAllFairsByOrganizationId = async (organization_id) => {
    const values = [organization_id];
    const queryString = `
    SELECT fairs.* FROM fairs
    JOIN fairs_organizations ON fairs.host_id = fairs_organizations.fair_id
    WHERE fairs_organizations.organization_id = $1 AND fairs.start_time > NOW()
    ORDER BY fairs.start_time DESC;
    `;

    try {
      const result = await db.query(queryString, values);
      return result.rows;
    } catch (err) {
      console.log(err.message);
    }
  };

  const addJobToOrganization = async (
    organization_id,
    { title, description, experience, location, salary }
  ) => {
    const values = [
      organization_id,
      title,
      description,
      experience,
      location,
      salary,
    ];
    const queryString = `
      INSERT INTO jobs (organization_id, title, description, experience, location, salary)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    try {
      const result = await db.query(queryString, values);
      const newJob = getFirstRecord(result);
      return newJob;
    } catch (err) {
      console.log(err.message);
    }
  };

  const createNewFair = async (
    name,
    description,
    startTime,
    endTime,
    hostId,
    poster
  ) => {
    const values = [name, description, startTime, endTime, hostId, poster];
    const queryString = `
      INSERT INTO fairs (name, description, start_time, end_time, host_id, poster)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    try {
      const result = await db.query(queryString, values);
      const newFair = getFirstRecord(result);

      const values2 = [hostId, newFair.id];
      const queryString2 = `
        INSERT INTO fairs_organizations (organization_id, fair_id)
        VALUES ($1, $2)
        RETURNING *;
      `;
      await db.query(queryString2, values2);
      return newFair;
    } catch (err) {
      console.log(err.message);
    }
  };

  //Messages queryhelper functions

  // Get All messages
  const getMessagesByUserId = async (user_id) => {
    const values = [user_id];
    const queryString = `
      SELECT *
      FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      ORDER BY created_at
    `;
    try {
      const data = await db.query(queryString, values);

      const messages = getData(data);

      const reversedMsg = [...messages].reverse();
      //getting other users
      const senders = [];

      for (const message of reversedMsg) {
        if (
          message.sender_id !== user_id &&
          !senders.find((sender) => sender.id === message.sender_id)
        ) {
          const userInfo = await getUserByValue("id", message.sender_id);
          delete userInfo.password;
          const numOfMsg = messages.filter(
            (message2) => message2.sender_id === message.sender_id && !message2.is_read
          ).length;

          senders.push({
            ...userInfo,
            numOfMsg,
            lastMsg: message.message,
            createdDate: message.created_at,
            lastUserId: message.sender_id,
            msgId: message.id,
          });
        }
        if (
          message.receiver_id !== user_id &&
          !senders.find((sender) => sender.id === message.receiver_id)
        ) {
          const userInfo = await getUserByValue("id", message.receiver_id);
          delete userInfo.password;
          const numOfMsg = messages.filter(
            (message2) => message2.sender_id === message.receiver_id && !message2.is_read
          ).length;

          senders.push({
            ...userInfo,
            numOfMsg,
            lastMsg: message.message,
            createdDate: message.created_at,
            lastUserId: message.sender_id,
            msgId: message.id,
          });
        }
      }

      return { messages, senders };
    } catch (error) {
      console.log(error);
    }
  };

  // create NewMessage

  const createNewMessage = async ({ sender_id, receiver_id, message, created_at }) => {
    try {
      const values = [sender_id, receiver_id, message, created_at];
      const queryString = `
        INSERT INTO  messages (sender_id , receiver_id, message, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const result = await db.query(queryString, values);
      const userInfo = await getUserByValue("id", receiver_id);
      const userWithoutPassword = Object.assign({}, userInfo);
      delete userWithoutPassword.password;
      const newMessage = {
        messageObj: getFirstRecord(result),
        receiver: userWithoutPassword,
      };
      return newMessage;
      // return getFirstRecord(result);
    } catch (error) {
      console.log(error);
    }
  };

  const readMessages = async (senderId, receiverId) => {
    const values = [senderId, receiverId];
    const queryString = `
      UPDATE messages
      SET is_read = true
      WHERE sender_id = $1
      AND receiver_id = $2
      RETURNING *;`;

    try {
      const result = await db.query(queryString, values);
      return getData(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Get jobs by search

  const getJobsBySearch = async (searchTerm, user_id) => {
    const values = searchTerm ? [user_id, "%" + searchTerm + "%"] : [user_id];
    const queryString = searchTerm
      ? `
    SELECT 
    jobs.*,
    (SELECT EXISTS(SELECT 1 from favourites WHERE user_id = $1 AND jobs.id = favourites.job_id)) as liked,
    (SELECT EXISTS(SELECT 1 from applications WHERE user_id = $1 AND jobs.id = applications.job_id)) as applied,
    organizations.logo as organizationLogo,
    organizations.name as organizationName,
    organizations.website FROM jobs
    JOIN organizations ON jobs.organization_id = organizations.id
    WHERE jobs.title ILIKE $2 OR jobs.description ILIKE $2 OR jobs.location ILIKE $2
    ORDER BY created_at DESC;
    `
      : `
      SELECT 
      jobs.*, 
      (SELECT EXISTS(SELECT 1 from favourites WHERE user_id = $1 AND jobs.id = favourites.job_id)) as liked,
      (SELECT EXISTS(SELECT 1 from applications WHERE user_id = $1 AND jobs.id = applications.job_id)) as applied,
      organizations.logo as organizationLogo, 
      organizations.name as organizationName, 
      organizations.website FROM jobs
      JOIN organizations ON jobs.organization_id = organizations.id
      ORDER BY created_at DESC;`;

    try {
      const result = await db.query(queryString, values);
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  };

  const getUserOrganizations = async (fairId, userId) => {
    const values = [fairId, userId];
    const queryString = `
      SELECT organizations.name,
      organizations.id,
      (SELECT count(*) FROM fairs_organizations WHERE fair_id = $1 AND organizations.id = organization_id) > 0 AS added
      FROM organizations
      JOIN users_organizations ON organizations.id = users_organizations.organization_id
      WHERE user_id = $2;
    `;

    try {
      const result = await db.query(queryString, values);
      return getData(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const addFairToOrganizationSchedule = async (fair_id, organization_id) => {
    const values = [fair_id, organization_id];
    const queryString = `
      INSERT INTO fairs_organizations (fair_id, organization_id)
      VALUES ($1, $2)
      RETURNING *;
    `;

    try {
      const result = await db.query(queryString, values);
      return getData(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const addFairToSchedule = async (fairId, userId) => {
    const values = [fairId, userId];
    const queryString = `
      INSERT INTO fairs_users (fair_id, user_id)
      VALUES ($1, $2)
      RETURNING *;
    `;

    try {
      const result = await db.query(queryString, values);
      return getData(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getFairDetails = async (fairId, userId) => {
    const values = [fairId];
    const values2 = [fairId, userId];

    const fairDetailsString = `
      SELECT fairs.*,
        organizations.name AS host_name,
        organizations.description AS host_description,
        start_time AS start,
        end_time AS end,
        organizations.description AS host_description,
        fairs.poster
        FROM fairs
        JOIN organizations ON (organizations.id = fairs.host_id)
        WHERE fairs.id = $1
    `;
    const stallsString = `
      SELECT organizations.id, 
        organizations.name, 
        organizations.description,
        industry,
        website,
        logo
        FROM fairs
        JOIN fairs_organizations ON (fairs.id = fairs_organizations.fair_id) 
        JOIN organizations ON (organizations.id = fairs_organizations.organization_id)
        WHERE fairs.id = $1
    `;

    const userAddedString = `
      SELECT id
        FROM fairs_users
        WHERE fair_id = $1
        AND user_id = $2
        ;
    `;

    try {
      const fairResult = await db.query(fairDetailsString, values);
      const stallResult = await db.query(stallsString, values);
      const userAddedResult = await db.query(userAddedString, values2);

      const fair = getData(fairResult).map((fair) => {
        const { host_name, host_id, host_description, end, start } = fair;
        return {
          ...fair,
          hostName: host_name,
          hostId: host_id,
          hostDescription: host_description,
          live: end > Date.now() && start < Date.now(),
          upcoming: start > Date.now(),
        };
      })[0];

      const stalls = getData(stallResult);
      const added = getData(userAddedResult);

      return { fair, stalls, added: added.length > 0 };
    } catch (err) {
      console.log(err.message);
    }
  };

  // Job Applications

  const applyForJob = async (userId, message, jobId, filePath) => {
    try {
      const values = [userId, message, jobId, filePath];
      const queryString = `
        INSERT INTO  applications (user_id, message, job_id, resume)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      await db.query(queryString, values);
    } catch (error) {
      console.log(error);
    }
  };

  const getJobById = async (id) => {
    const values = [id];
    const queryString = "SELECT * FROM jobs WHERE id = $1";

    try {
      const result = await db.query(queryString, values);
      return getFirstRecord(result);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrganizationById = async (id) => {
    const values = [id];
    const queryString = `DELETE FROM organizations WHERE id = $1`;

    try {
      await db.query(queryString, values);
    } catch (error) {
      console.log(error);
    }
  };

  const updateOrganizationInfo = async (
    id,
    name,
    description,
    email,
    industry,
    website,
    logo
  ) => {
    const values = [name, description, email, industry, website, logo, id];
    const queryString = `
    UPDATE organizations
    SET name = $1,
      description = $2,
      email = $3,
      industry = $4,
      website = $5,
      logo = $6
    WHERE id = $7;
    `;

    try {
      await db.query(queryString, values);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleLikes = async (user_id, jobId) => {
    const values = [user_id, jobId];

    const queryStringExists = `
    SELECT EXISTS(SELECT 1 from favourites WHERE user_id = $1 AND job_id = $2)
    `;

    const queryStringAdd = `
    INSERT into favourites (user_id, job_id)
    VALUES ($1, $2);
    `;

    const queryStringRemove = `
    DELETE from favourites WHERE user_id = $1 and job_id = $2;
    `;

    try {
      const result = await db.query(queryStringExists, values);
      const { exists } = result.rows[0];
      exists
        ? await db.query(queryStringRemove, values)
        : await db.query(queryStringAdd, values);
      console.log(exists);
    } catch (error) {
      console.log(error);
    }
  };

  const getFavoriteJobsByUser = async (user_id) => {
    const values = [user_id];
    const queryString = `
    SELECT 
    jobs.*, 
    (SELECT EXISTS(SELECT 1 from favourites WHERE user_id = $1 AND jobs.id = favourites.job_id)) as liked,
    (SELECT EXISTS(SELECT 1 from applications WHERE user_id = $1 AND jobs.id = applications.job_id)) as applied,
    organizations.logo as organizationLogo, 
    organizations.name as organizationName, 
    organizations.website FROM jobs
    JOIN organizations ON jobs.organization_id = organizations.id
    JOIN favourites ON favourites.job_id = jobs.id
    WHERE favourites.user_id = $1
    ORDER BY created_at DESC;`;

    try {
      const result = await db.query(queryString, values);
      return result.rows;
    } catch (error) {
      console.log(error);
    }
  };

  const getAppliedJobsByUser = async (user_id) => {
    const values = [user_id];
    const queryString = `
    SELECT 
    jobs.*, 
    (SELECT EXISTS(SELECT 1 from favourites WHERE user_id = $1 AND jobs.id = favourites.job_id)) as liked,
    organizations.logo as organizationLogo, 
    organizations.name as organizationName, 
    organizations.website FROM jobs
    JOIN organizations ON jobs.organization_id = organizations.id
    JOIN applications ON applications.job_id = jobs.id
    WHERE applications.user_id = $1
    ORDER BY created_at DESC;`;

    try {
      const result = await db.query(queryString, values);
      return result.rows.map((job) => ({ ...job, applied: true }));
    } catch (error) {
      console.log(error);
    }
  };

  const removeUserFromOrganization = async (user_id, organizationId) => {
    const values = [user_id, organizationId];
    const queryString = `DELETE from users_organizations WHERE user_id = $1 AND organization_id = $2`;

    try {
      await db.query(queryString, values);
    } catch (error) {
      console.log(error);
    }

  };

  return {
    removeUserFromOrganization,
    getAppliedJobsByUser,
    getFavoriteJobsByUser,
    updateOrganizationInfo,
    toggleLikes,
    deleteOrganizationById,
    getJobById,
    applyForJob,
    getFairDetails,
    addFairToSchedule,
    addFairToOrganizationSchedule,
    getUserOrganizations,
    createNewUser,
    getUserByValue,
    createNewOrganization,
    addUserToOrganization,
    getOrganizationsByUser,
    getAllOtherUsers,
    getAllFairs,
    getFair,
    getAllJobsByOrganizationId,
    getAllMembersByOrganizationId,
    getAllFairsByOrganizationId,
    getAllApplicationsByJobId,
    getOrganizationDetails,
    checkIfIAmMember,
    addJobToOrganization,
    createNewFair,
    getMessagesByUserId,
    createNewMessage,
    addJobToOrganization,
    getJobsBySearch,
    updateUser,
    updatePasswordById,
    readMessages,
  };
};

module.exports = queryGenerator;
