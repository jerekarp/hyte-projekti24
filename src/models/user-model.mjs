import promisePool from '../utils/database.mjs';

const listAllUsers = async () => {
  try {
    const sql = 'SELECT user_id, username, user_level FROM Users';
    const [rows] = await promisePool.query(sql);
    //console.log(rows);
    return rows;
  } catch (error) {
    console.error('listAllUsers', error);
    return {error: 500, message: 'db error'};
  }
};

const selectUserById = async (id) => {
  try {
    const sql = 'SELECT * FROM Users WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    //console.log(rows);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    // Remove password property from result
    delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error('selectUserById', error);
    return {error: 500, message: 'db error'};
  }
};

const insertUser = async (user, next) => {
  try {
    const sql =
      'INSERT INTO Users (username, password, email) VALUES (?, ?, ?)';
    const params = [user.username, user.password, user.email];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    return {message: 'new user created', user_id: result.insertId};
  } catch (error) {
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('insertUser', error);
    // Error handler can be used directly from model, if next function is passed
    return next(new Error(error));
  }
};

const updateUserById = async (user) => {
  try {
    const sql =
      'UPDATE Users SET username=?, password=?, email=? WHERE user_id=?';
    const params = [user.username, user.password, user.email, user.userId];
    await promisePool.query(sql, params);
    const [result] = await promisePool.query(sql, params);
    return {message: 'user data updated', user_id: user.userId};
  } catch (error) {
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('updateUserById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteUserById = async (id) => {
  try {
    // Poista viiteavaimet liittyvistä tauluista
    await updateRelatedTables(id);

    // Poista käyttäjä
    const sql = 'DELETE FROM Users WHERE user_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);

    if (result.affectedRows === 0) {
      return {error: 404, message: 'user not found'};
    }
    return {message: 'user deleted', user_id: id};
  } catch (error) {
    console.error('deleteUserById', error);
    return {error: 500, message: 'db error'};
  }
};


const updateRelatedTables = async (userId) => {
  try {
    // Päivitä diaryentries-taulu
    const sqlDiaryEntries = 'UPDATE diaryentries SET user_id = NULL WHERE user_id = ?';
    const paramsDiaryEntries = [userId];
    await promisePool.query(sqlDiaryEntries, paramsDiaryEntries);

    // Päivitä measurements-taulu
    const sqlMeasurements = 'UPDATE measurements SET user_id = NULL WHERE user_id = ?';
    const paramsMeasurements = [userId];
    await promisePool.query(sqlMeasurements, paramsMeasurements);

    // Päivitä activities-taulu
    const sqlActivities = 'UPDATE activities SET user_id = NULL WHERE user_id = ?';
    const paramsActivities = [userId];
    await promisePool.query(sqlActivities, paramsActivities);
  } catch (error) {
    console.error('updateRelatedTables', error);
    throw error;
  }
};



// Used for login
const selectUserByUsername = async (username) => {
  try {
    const sql = 'SELECT * FROM Users WHERE username=?';
    const params = [username];
    const [rows] = await promisePool.query(sql, params);
    // console.log(rows);
    // if nothing is found with the username, login attempt has failed
    if (rows.length === 0) {
      return {error: 401, message: 'invalid username or password'};
    }
    return rows[0];
  } catch (error) {
    console.error('selectUserByNameAndPassword', error);
    return {error: 500, message: 'db error'};
  }
};

const selectUserByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM Users WHERE email=?';
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    // console.log(rows);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    // Remove password property from result
    delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};

const checkStudentInfo = async (userId) => {
  const sql = `
    SELECT EXISTS (
      SELECT 1
      FROM student_info
      WHERE user_id = ?
    ) AS exists_flag
  `;
  const params = [userId];
  try {
    const [rows] = await promisePool.query(sql, params);
    return rows[0].exists_flag;  // Palauttaa boolean arvon, joka kertoo onko tietueita vai ei
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
}




const insertStudentInfo = async (userId, first_name, surname, student_number, weight, height, age, gender) => {
  const sql = `INSERT INTO student_info
              (user_id, first_name, surname, student_number, weight, height, age, gender)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    userId,
    first_name,
    surname,
    student_number,
    weight,
    height,
    age,
    gender,
  ];
  try {
    const result = await promisePool.query(sql, params);
    const insertedId = result[0].insertId;
    return { student_id: insertedId };
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};


const updateStudentInfo = async (userId, first_name, surname, student_number, weight, height, age, gender) => {
  const sql = `UPDATE student_info
              SET first_name = ?, surname = ?, student_number = ?, weight = ?, height = ?, age = ?, gender = ?
              WHERE user_id = ?`;
  const params = [
    first_name,
    surname,
    student_number,
    weight,
    height,
    age,
    gender,
    userId 
  ];

  try {
    const result = await promisePool.query(sql, params);
    const affectedRows = result[0].affectedRows;
    return { affectedRows };
  } catch (e) {
    console.error('error', e.message);
    return { error: e.message };
  }
};


export {
  listAllUsers,
  selectUserById,
  insertUser,
  updateUserById,
  deleteUserById,
  selectUserByUsername,
  selectUserByEmail,
  checkStudentInfo,
  insertStudentInfo,
  updateStudentInfo
};
