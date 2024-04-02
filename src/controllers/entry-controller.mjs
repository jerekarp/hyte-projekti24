import {customError} from '../middlewares/error-handler.mjs';
import {
    findEntryById,
    addEntry,
    deleteEntryById,
    updateEntryById,
    listAllEntriesByUserId,
  } from '../models/entry-model.mjs';

  const getEntries = async (req, res, next) => {
    try {
      // Varmistetaan, että käyttäjä on todennettu
      if (!req.user) {
        return res.status(401).json({virhe: 'Unauthorized'});
      }

      // Haetaan käyttäjän tunnus tokenista
      const userId = req.user.user_id;

      // Haetaan kirjaukset kirjautuneelle käyttäjälle
      const result = await listAllEntriesByUserId(userId);

      // Jos kyselyssä ei tapahtunut virheitä, lähetetään vastaus kirjauksista
      res.json(result);
    } catch (error) {
      next(new Error(result.error));
    }
  };

  const getEntryById = async (req, res, next) => {
    // Authentication: Check if user is authenticated
    if (!req.user) {
      return res.sendStatus(401); // Unauthorized
    }

    // Retrieve entry by id
    const entry = await findEntryById(req.params.id, req.user.user_id);
    if (entry) {
      res.json(entry);
    } else {
      next(customError('Entry not found', 404));
    }
  };

  const postEntry = async (req, res, next) => {
    const userId = req.user.user_id;
    const result = await addEntry(req.body, userId);
    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      next(new Error(result.error));
    }
  };

  const putEntry = async (req, res, next) => {
    const entryId = req.params.id;
    const userId = req.user.user_id;
    const result = await updateEntryById(entryId, userId, req.body);
    if (result.error) {
      return next(customError(result.message, result.error));
    }
    return res.status(201).json(result);
  };

  const deleteEntry = async (req, res, next) => {
    const result = await deleteEntryById(req.params.id, req.user.user_id);
    if (result.error) {
      return next(customError(result.message, result.error));
    }
    return res.json(result);
  };

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};
