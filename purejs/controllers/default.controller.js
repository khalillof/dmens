"use strict";
const { dbStore } = require('../common/customTypes/types.config');

class DefaultController {

  constructor(name) {
    this.db = dbStore[name];
  }

  static async createInstance(svcName) {
    return await Promise.resolve(new DefaultController(svcName));
  }
  ToList(self) {
    return (req, res, next) => {
      self.db.Tolist(20, 0)
        .then((items) => self.sendJson(items, 200, res), (err) => next(err))
        .catch((err) => next(err));
    }
  }
  create(self) {
    return (req, res, next) => {
      self.db.create(req.body).then((item) => {
        console.log('document Created :', item);
        self.sendJson({ id: item.id }, 201, res)
      }, (err) => next(err))
        .catch((err) => next(err));
    }
  }


  getById(self) {
    return (req, res, next) => {
      self.db.getById(req.params.id)
        .then((item) => self.sendJson(item, 200, res), (err) => next(err))
        .catch((err) => next(err));
    }
  }

  patch(self) {
    return (req, res, next) => {
      self.db.patchById(req.body)
        .then(() => self.sendJson({ "status": "OK" }, 204, res), (err) => next(err))
        .catch((err) => next(err));

    }
  }

  put(self) {
    return (req, res, next) => {
      self.putById({ _id: req.params.Id, ...req.body })
        .then(() => self.sendJson({ "status": "OK" }, 204, res), (err) => next(err))
        .catch((err) => next(err));
    }
  }

  remove(self) {
    return (req, res, next) => {
      self.db.deleteById(req.params.id)
        .then(() => self.sendJson({ "status": "OK" }, 204, res), (err) => next(err))
        .catch((err) => next(err));
    }
  }

  ////// helpers
  extractId(req, res, next) {
    req.body.id = req.params.id;
    next();
  }
  sendJson(obj, status, res) {
    res.setHeader('Content-Type', 'application/json');
    res.status(status).json(obj);
  }

  First(obj, self) {
    return self.db.findOne(obj);
  }

}

exports.DefaultController = DefaultController;
