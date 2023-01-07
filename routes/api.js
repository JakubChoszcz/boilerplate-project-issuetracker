"use strict";

// const issues = {apitest: [{"_id":"1673097268792","issue_title":"abc","issue_text":"abc","created_by":"abc","assigned_to":"abc","status_text":"abc","open":false,"created_on":"2023-01-07T13:14:28.792Z","updated_on":"2023-01-07T13:14:28.792Z"},{"_id":"1673097280371","issue_title":"qwerty","issue_text":"qwerty","created_by":"qwerty","assigned_to":"qwerty","status_text":"qwerty","open":false,"created_on":"2023-01-07T13:14:40.371Z","updated_on":"2023-01-07T13:14:40.371Z"}]};
const issues = {};

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let { project } = req.params;

      if (issues[project] === undefined) {
        res.json([]);
      } else {
        res.json(issues[project]);
      }
    })

    .post(function (req, res) {
      let { project } = req.params;
      let { body } = req;

      const id = Date.now().toString();
      const date = new Date();
      const time = date.toISOString();

      body = {
        _id: id,
        ...body,
        open: false,
        created_on: time,
        updated_on: time,
      };

      if (issues[project] === undefined) {
        issues[project] = [body];
      } else {
        issues[project].push(body);
      }

      res.json(body);
    })

    .put(function (req, res) {
      let { project } = req.params;
      const { body } = req;

      // check if project exists
      if (issues[project] === undefined) {
        res.json({ result: "could not update", _id: body._id });
      } else {
        const issueIndex = issues[project].findIndex((e) => e._id === body._id);

        // check if issue with id exists
        if (issueIndex === -1) {
          res.json({ result: "could not update", _id: body._id });
        } else {
          const date = new Date();
          const time = date.toISOString();

          issues[project][issueIndex] = {
            ...issues[project][issueIndex],
            issue_title:
              body.issue_title === ""
                ? issues[project][issueIndex].issue_title
                : body.issue_title,
            issue_text:
              body.issue_text === ""
                ? issues[project][issueIndex].issue_text
                : body.issue_text,
            created_by:
              body.created_by === ""
                ? issues[project][issueIndex].created_by
                : body.created_by,
            assigned_to:
              body.assigned_to === ""
                ? issues[project][issueIndex].assigned_to
                : body.assigned_to,
            status_text:
              body.status_text === ""
                ? issues[project][issueIndex].status_text
                : body.status_text,
            open: body.open === undefined ? true : false,
            updated_on: time,
          };

          res.json(issues[project][issueIndex]);
        }
      }
    })

    .delete(function (req, res) {
      let { project } = req.params;
      const { body } = req;

      // check if project exists
      if (issues[project] === undefined) {
        res.json({ result: "could not update", _id: body._id });
      } else {
        const issueIndex = issues[project].findIndex((e) => e._id === body._id);

        // check if issue with id exists
        if (issueIndex === -1) {
          res.json({ result: "could not update", _id: body._id });
        } else {
          issues[project].splice(issueIndex, 1);

          res.json({ result: "successfully deleted", _id: body._id });
        }
      }
    });
};
