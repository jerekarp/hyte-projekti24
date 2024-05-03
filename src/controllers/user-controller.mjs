import bcrypt from 'bcryptjs';
import {
  insertUser,
  selectUserById,
  updateUserById,
  checkStudentInfo,
  insertStudentInfo,
  updateStudentInfo,
} from '../models/user-model.mjs';
import {customError} from '../middlewares/error-handler.mjs';


const getUserById = async (req, res, next) => {
  const result = await selectUserById(req.params.id);
  if (result.error) {
    return next(customError(result, result.error));
  }
  return res.json(result);
};

const postUser = async (req, res, next) => {
  const {username, password, email} = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await insertUser(
    {
      username,
      email,
      password: hashedPassword,
    },
    next,
  );
  return res.status(201).json(result);
};

const putUser = async (req, res, next) => {
  const userId = req.user.user_id;
  const { username, password, email } = req.body;

  // Admin user can update any user
  // Check if the authenticated user is admin
  if (req.user.user_level === 'admin') {
    // If the authenticated user is admin, proceed with the update
    // Hash password if included in request
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await updateUserById({
      userId,
      username,
      password: hashedPassword,
      email,
    });
    if (result.error) {
      return next(customError(result, result.error));
    }
    return res.status(200).json(result);
  } else {
    // If the authenticated user is not admin, they can only update their own data
    // Check if the user is trying to update their own data
    if (userId !== parseInt(req.user.user_id)) {
      return next(customError('Unauthorized', 401));
    }
    // If the user is updating their own data, proceed with the update
    // Hash password if included in request
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await updateUserById({
      userId,
      username,
      password: hashedPassword,
      email,
    });
    if (result.error) {
      return next(customError(result, result.error));
    }
    return res.status(200).json(result);
  }
};


const getStudentInfo = async (req, res) => {
  const user_id = parseInt(req.params.user_id);
  // console.log("Checking information for user_id:", user_id);

  try {
    const studentInfo = await checkStudentInfo(user_id);
    if (!studentInfo) {
      console.log("No user found with user_id:", user_id);
      // Vaihdetaan 404 tilakoodi johonkin muuhun, esim. 200
      return res.status(200).json({ message: 'No student information found for this user_id', found: false });
    }
    // console.log("User found with user_id:", user_id);
    res.status(200).json({
      message: 'Student information exists for this user_id',
      found: true,
      studentInfo
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const postStudentInfo = async (req, res) => {
  const { user_id, first_name, surname, student_number, weight, height, age, gender } = req.body;
  // console.log("Received data:", req.body);

  try {
    const result = await insertStudentInfo(user_id, first_name, surname, student_number, weight, height, age, gender);
    // console.log("Database operation result:", result);

    if (result.error) {
      console.error("Database error:", result.error);
      return res.status(500).json({ error: result.error });
    }
    res.status(201).json({ message: 'Student information added successfully', student_id: result.student_id });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const putStudentInfo = async (req, res) => {
  const userId = req.params.user_id;
  const { first_name, surname, student_number, weight, height, age, gender } = req.body;
  // console.log("Received data:", req.body);

  try {
    const result = await updateStudentInfo(userId, first_name, surname, student_number, weight, height, age, gender);
    console.log("Database operation result:", result);

    if (result.error) {
      console.error("Database error:", result.error);
      return res.status(500).json({ error: result.error });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No records updated. Check the user ID.' });
    }
    res.status(200).json({ message: 'Student information updated successfully' });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




export {getUserById, postUser, putUser, getStudentInfo, putStudentInfo, postStudentInfo};
