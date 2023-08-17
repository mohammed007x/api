const pool = require("../db.js");
const asyncHandler = require("express-async-handler");

function copyObjectWithoutKeys(obj, keysToRemove) {
  const newObj = { ...obj };
  keysToRemove.forEach((key) => delete newObj[key]);
  return newObj;
}

function generateSqlFilter(obj) {
  const conditions = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      if (typeof value === "object") {
        const operators = Object.keys(value);
        for (const operator of operators) {
          const operatorValue = value[operator];
          let sqlOperator = "";

          switch (operator) {
            case "gt":
              sqlOperator = ">";
              break;
            case "lt":
              sqlOperator = "<";
              break;
            case "gte":
              sqlOperator = ">=";
              break;
            case "lte":
              sqlOperator = "<=";
              break;
            default:
              sqlOperator = "=";
          }

          conditions.push(
            `${key} ${sqlOperator} ${
              isNaN(operatorValue) ? `'${operatorValue}'` : operatorValue
            }`
          );
        }
      } else if (Array.isArray(value)) {
        conditions.push(
          value
            .map((item) => `${key} = ${isNaN(item) ? `'${item}'` : item}`)
            .join(" OR ")
        );
      } else {
        conditions.push(`${key} = ${isNaN(value) ? `'${value}'` : value}`);
      }
    }
  }

  if (conditions.length > 0) {
    return "WHERE " + conditions.join(" AND ");
  } else {
    return "";
  }
}

function generateSqlOrderBy(sortKeys) {
  if (typeof sortKeys === "string") {
    const columnName = sortKeys.replace(/^-/, ""); // Remove '-' prefix
    const sortOrder = sortKeys.startsWith("-") ? "DESC" : "ASC";
    return `ORDER BY ${columnName} ${sortOrder}`;
  } else if (Array.isArray(sortKeys) && sortKeys.length > 0) {
    const orderByClauses = sortKeys.map((key) => {
      const columnName = key.replace(/^-/, ""); // Remove '-' prefix
      const sortOrder = key.startsWith("-") ? "DESC" : "ASC";
      return `${columnName} ${sortOrder}`;
    });
    return `ORDER BY ${orderByClauses.join(", ")}`;
  } else {
    return "";
  }
}

function generateSqlSearchQueries(searchQueries) {
  if (typeof searchQueries === "string") {
    const [fieldsString, keyword] = searchQueries.slice(1, -1).split("]");
    const fields = fieldsString.split(",");
    const fieldConditions = fields.map(
      (field) => `${field} LIKE '${keyword}%'`
    );
    return fieldConditions.join(" OR ");
  } else if (Array.isArray(searchQueries)) {
    const sqlQueries = searchQueries.map((query) => {
      const [fieldsString, keyword] = query.slice(1, -1).split("]");
      const fields = fieldsString.split(",");
      const fieldConditions = fields.map(
        (field) => `${field} LIKE '${keyword}%'`
      );
      return fieldConditions.join(" OR ");
    });

    return sqlQueries.join(" AND ");
  } else {
    return ""; // No search
  }
}

function generateCombinedSqlFilterAndSearch(filter, searchQueries) {
  const filterClause = generateSqlFilter(filter);
  const searchClause = generateSqlSearchQueries(searchQueries);

  if (filterClause && searchClause) {
    return `${filterClause} AND ${searchClause}`;
  } else if (filterClause) {
    return filterClause;
  } else if (searchClause) {
    return `WHERE ${searchClause}`;
  } else {
    return "";
  }
}

exports.get = asyncHandler(
  async (
    req,
    tableName,
    query = `select * from ${tableName} p`,
    countQuery = `SELECT COUNT(*) FROM ${tableName} p`
  ) => {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const filter = copyObjectWithoutKeys(req.query, [
      "sort",
      "search",
      "limit",
      "page",
    ]);
    const sort = req.query.sort;
    const search = req.query.search;

    const documentCount = await pool.query(`${countQuery}
      ${generateCombinedSqlFilterAndSearch(filter, search, "p")}
       `);

    const pagesCount = Math.ceil(parseInt(documentCount.rows[0].count) / limit);

    const nextPage = page < pagesCount ? page + 1 : undefined;
    const prevPage = page > 1 ? page - 1 : undefined;

    const rows = await pool.query(`
        ${query}
        ${generateCombinedSqlFilterAndSearch(filter, search, "p")}
        ${generateSqlOrderBy(sort)}
        LIMIT ${limit} OFFSET ${skip};
      `);

    return {
      pagination: {
        currentPage: page,
        pages: pagesCount,
        next: nextPage,
        previous: prevPage,
        count: rows.rows.length,
      },
      rows: rows.rows,
    };
  }
);

exports.create = asyncHandler(async (req, tableName, body = req.body) => {
  const columns = Object.keys(body).join(", ");
  const values = Object.values(body)
    .map((value) => (typeof value === "string" ? `'${value}'` : value))
    .join(", ");
  await pool.query(`INSERT INTO ${tableName} (${columns}) VALUES (${values});`);
  return true;
});

exports.deleteOne = asyncHandler(async (req, tableName) => {
  const data = await pool.query(
    `DELETE FROM ${tableName} WHERE id = ${req.params.id};`
  );
  return true;
});

exports.update = asyncHandler(async (req, tableName, body = req.body) => {
  const id = req.params.id;
  const updateFields = Object.entries(body)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(", ");
  const data = await pool.query(
    `UPDATE ${tableName} SET ${updateFields} WHERE id = ${id};`
  );
  return true;
});

exports.getOne = asyncHandler(async (req, tableName, id = req.params.id) => {
  const data = await pool.query(`select * from ${tableName} WHERE id = ${id};`);
  return data.rows;
});
