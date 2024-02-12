const sinon = require('sinon');
const express = require('express');
const router = express.Router();
const User = require('../server/models/UserModel');
const Network = require('../server/models/NetworkModel');
const Node = require('../server/models/NodeModel');
const Link = require('../server/models/LinkModel');

describe('Express Router Tests', function () {
  describe('GET /network', function () {
    it('should return nodes and links when a valid user is authenticated', async function () {
      const req = { user: new User({ _id: 'user_id' }) };
      const res = { render: sinon.spy() };
      const userNetwork = new Network({
        /* mock network data */
      });
      sinon.stub(Network, 'findOne').resolves(userNetwork);
      sinon.stub(Node, 'find').resolves([]);
      sinon.stub(Link, 'find').resolves([]);

      await router['GET /network'](req, res);

      assert(res.render.calledOnce);
      assert(Array.isArray(res.render.args[0][1].nodes));
      assert(Array.isArray(res.render.args[0][1].links));
    });

    it('should return a 500 status code and an error message when an error occurs', async function () {
      const req = { user: new User({ _id: 'user_id' }) };
      const res = { status: sinon.stub().returnsThis(), send: sinon.spy() };
      sinon.stub(Network, 'findOne').rejects(new Error('Test error'));

      await router['GET /network'](req, res);

      assert(res.status.calledWith(500));
      assert(res.send.calledWith('Internal Server Error'));
    });
  });

  describe('POST /upload', function () {
    it('should handle file upload and create network objects', async function () {
      const req = {
        user: new User({ _id: 'user_id' }),
        file: {
          originalname: 'test.json',
          buffer: Buffer.from(
            JSON.stringify({
              
            })
          ),
        },
      };
      const res = { redirect: sinon.spy() };
      sinon.stub(Network.prototype, 'save').resolves();
      sinon.stub(Node.prototype, 'save').resolves();
      sinon.stub(Link.prototype, 'save').resolves();

      await router['POST /upload'](req, res);

      assert(res.redirect.calledWith('/network'));
    });

    it('should return a 500 status code and an error message when an error occurs', async function () {
      const req = {
        user: new User({ _id: 'user_id' }),
        file: {
          originalname: 'test.json',
          buffer: Buffer.from('invalid content'),
        },
      };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      sinon.stub(Network.prototype, 'save').rejects(new Error('Test error'));

      await router['POST /upload'](req, res);

      assert(res.status.calledWith(500));
      assert(res.json.calledWith({ error: 'Internal Server Error.' }));
    });
  });
});
