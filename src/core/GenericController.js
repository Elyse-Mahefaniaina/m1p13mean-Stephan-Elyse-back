const mongoose = require("mongoose");

function createGenericController(Model, relations = {}, excludeFields = []) {

  function parseFilter(filterString) {
    if (!filterString) return {};
    const where = {};
    const conditions = filterString.split(/ and | AND /i);

    conditions.forEach(condition => {
      const match = condition.match(/(\w+)\s+(eq|ne|gt|lt|like)\s+'([^']+)'/i);
      if (match) {
        const [, field, op, value] = match;
        const mongooseOp = {
          eq: "$eq",
          ne: "$ne",
          gt: "$gt",
          lt: "$lt",
          like: "$regex"
        }[op.toLowerCase()];

        if (mongooseOp === "$regex") {
          where[field] = { [mongooseOp]: value, $options: "i" };
        } else {
          where[field] = { [mongooseOp]: value };
        }
      }
    });

    return where;
  }

  function applyExpand(query, expand) {
    if (!expand) return query;
    const includes = expand.split(",").filter(k => relations[k]);
    includes.forEach(r => query = query.populate(r));
    return query;
  }

  function applyPaginationAndSort(query, req) {
    const { $top, $skip, $order } = req.query;
    if ($skip) query = query.skip(parseInt($skip, 10));
    if ($top) query = query.limit(parseInt($top, 10));

    if ($order) {
      const sort = {};
      $order.split(",").forEach(o => {
        const [field, dir] = o.trim().split(/\s+/);
        sort[field] = dir && dir.toUpperCase() === "DESC" ? -1 : 1;
      });
      query = query.sort(sort);
    }
    return query;
  }

  function applyExclude(query) {
    if (excludeFields.length > 0) {
      const select = excludeFields.map(f => `-${f}`).join(" ");
      query = query.select(select);
    }
    return query;
  }

  function validateObjectIdField(field, value) {
    const schemaPath = Model.schema.path(field);
    if (schemaPath && schemaPath.instance === "ObjectID") {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return `Invalid ${field}`;
      }
    }
    return null;
  }

  return {

    async findAll(req, res) {
      try {
        const { $filter, $expand } = req.query;
        const filter = parseFilter($filter);

        let query = Model.find(filter);

        query = applyExpand(query, $expand);
        query = applyPaginationAndSort(query, req);
        query = applyExclude(query);

        const data = await query.exec();
        return res.json({ count: data.length, data });

      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    async findOne(req, res) {
      try {
        const { id } = req.params;
        let query = Model.findById(id);

        if (req.query.$expand) {
          query = applyExpand(query, req.query.$expand);
        }

        // Exclude fields
        query = applyExclude(query);

        const item = await query.exec();
        if (!item) return res.status(404).json({ error: "Not found" });

        return res.json(item);

      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    findByField(field, paramName = field) {
      return async (req, res) => {
        try {
          const value = req.params[paramName];
          if (!value) {
            return res.status(400).json({ error: `Missing ${paramName}` });
          }

          const invalid = validateObjectIdField(field, value);
          if (invalid) {
            return res.status(400).json({ error: invalid });
          }

          const { $filter, $expand } = req.query;
          const extraFilter = parseFilter($filter);
          const filter = { ...extraFilter, [field]: value };

          let query = Model.find(filter);
          query = applyExpand(query, $expand);
          query = applyPaginationAndSort(query, req);
          query = applyExclude(query);

          const data = await query.exec();
          return res.json({ count: data.length, data });
        } catch (err) {
          return res.status(500).json({ error: err.message });
        }
      };
    },

    async create(req, res) {
      try {
        const body = { ...req.body };

        // Convert string dates en Date
        Object.entries(body).forEach(([key, value]) => {
          if (value && typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
            body[key] = new Date(value);
          }
        });

        const item = await Model.create(body);
        if (excludeFields.length > 0) excludeFields.forEach(f => delete item[f]);
        return res.status(201).json(item);

      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    async update(req, res) {
      try {
        const { id } = req.params;
        const item = await Model.findById(id);
        if (!item) return res.status(404).json({ error: "Not found" });

        Object.assign(item, req.body);
        await item.save();

        if (excludeFields.length > 0) excludeFields.forEach(f => delete item[f]);
        return res.json(item);

      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    async remove(req, res) {
      try {
        const { id } = req.params;

        const deletedItem = await Model.findByIdAndDelete(id);

        if (!deletedItem) {
          return res.status(404).json({ error: "Not found" });
        }

        return res.json({ message: "Deleted successfully" });

      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }

  };
}

module.exports = createGenericController;
