// Note: db functions are async and must be called with await from the controller
import promisePool from '../utils/database.mjs';

const listAllEntries = async () => {
  try {
    const sql = 'SELECT * FROM diaryentries';
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (error) {
    console.error('listAllEntries', error);
    return { error: 500, message: 'Database error' };
  }
};

const listAllEntriesByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM diaryentries WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    // console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findEntryById = async (id, userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM diaryentries WHERE entry_id = ? AND user_id = ?',
      [id, userId],
    );
    // console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const updateEntryById = async (entryId, userId, entryData) => {
  try {
    const allowedFields = {
      entry_date: entryData.entry_date,
      mood: entryData.mood,
      weight: entryData.weight,
      sleep_hours: entryData.sleep_hours,
      notes: entryData.notes,
    };

    const sql = promisePool.format(
      `UPDATE diaryentries SET ?
       WHERE entry_id=? AND user_id=?`,
      [allowedFields, entryId, userId]
    );

    const [result] = await promisePool.query(sql);

    if (result.affectedRows === 0) {
      return { error: 404, message: 'Entry not found' };
    }

    return { message: 'Entry data updated', entry_id: entryId };
  } catch (error) {
    console.error('updateEntryById', error);
    return { error: 500, message: 'db error' };
  }
};


const deleteEntryById = async (id, userId) => {
  try {
    const sql = 'DELETE FROM diaryentries WHERE entry_id=? AND user_id=?';
    const params = [id, userId];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'Entry not found'};
    }
    return {message: 'Entry deleted', entry_id: id};
  } catch (error) {
    console.error('deleteEntryById', error);
    return {error: 500, message: 'db error'};
  }
};

const addEntry = async (entry, userId) => {
  const sql = `INSERT INTO diaryentries
               (user_id, entry_date, mood, weight, sleep_hours, notes)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    userId,
    entry.entry_date,
    entry.mood,
    entry.weight,
    entry.sleep_hours,
    entry.notes,
  ];
  try {
    const rows = await promisePool.query(sql, params);
    // console.log('rows', rows);
    return {entry_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {
  listAllEntries,
  listAllEntriesByUserId,
  findEntryById,
  addEntry,
  updateEntryById,
  deleteEntryById,
};
