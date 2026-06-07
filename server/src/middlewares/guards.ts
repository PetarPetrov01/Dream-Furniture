import { RequestHandler } from "express";

export function isUser(): RequestHandler {
  return (req, res, next) => {
    if (req.user) next();
    else res.status(403).json({ message: "You must be logged in!" });
  };
}

export function isGuest(): RequestHandler {
  return (req, res, next) => {
    if (req.user) res.status(403).json({ message: "You are already logged in!" });
    else next();
  };
}

export function isOwner(): RequestHandler {
  return (req, res, next) => {
    const ownerId = res.locals.product?._ownerId?._id;
    const userId = req.user?._id;
    if (ownerId && userId && String(ownerId) === String(userId)) next();
    else res.status(403).json({ message: "You are not the owner of this post" });
  };
}
