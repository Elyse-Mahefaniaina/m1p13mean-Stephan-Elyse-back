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

  return {

    async findAll(req, res) {
      try {
        const { $filter, $top, $skip, $expand, $order } = req.query;
        const filter = parseFilter($filter);

        let query = Model.find(filter);

        if ($expand) {
          const includes = $expand.split(",").filter(k => relations[k]);
          includes.forEach(r => query = query.populate(r));
        }

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

        if (excludeFields.length > 0) {
          const select = excludeFields.map(f => `-${f}`).join(" ");
          query = query.select(select);
        }

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
          const includes = req.query.$expand.split(",").filter(k => relations[k]);
          includes.forEach(r => query = query.populate(r));
        }

        // Exclude fields
        if (excludeFields.length > 0) {
          const select = excludeFields.map(f => `-${f}`).join(" ");
          query = query.select(select);
        }

        const item = await query.exec();
        if (!item) return res.status(404).json({ error: "Not found" });

        return res.json(item);

      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
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