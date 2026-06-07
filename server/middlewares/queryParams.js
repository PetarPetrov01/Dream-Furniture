module.exports = () => (req, res, next) => {
  const query = { ...req.query };

  if (typeof query.sort === "string" && query.sort !== "") {
    const [sortKey, order] = query.sort.split(":");
    query.sort = { [sortKey]: order === "asc" ? 1 : -1 };
  }

  if (typeof query.priceRange === "string" && query.priceRange !== "") {
    const [lower, upper] = query.priceRange.split(":");
    query.priceRange = { lower, upper };
  }

  res.locals.query = query;
  next();
};
