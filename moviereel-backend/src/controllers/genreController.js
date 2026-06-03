import Genre from "../models/Genre.js";

export const listGenres = async (req, res, next) => {
  try { res.json(await Genre.find().sort("name")); }
  catch (err) { next(err); }
};

export const createGenre = async (req, res, next) => {
  try { res.status(201).json(await Genre.create(req.body)); }
  catch (err) { next(err); }
};
