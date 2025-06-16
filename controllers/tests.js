import connection from "../Database/index.js";

export const addTest = async (req, res) => {
  try {
    const { teacherId, testName, subjectId } = req.body;
    const [results] = await connection
      .promise()
      .query(
        `INSERT INTO tests (test_name, teacher_id, subject_id) VALUES ('${testName}', ${teacherId}, ${subjectId});`
      );

    res.json({ id: results.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTeacherTests = async (req, res) => {
  try {
    const teacher_id = req.params.teacher_id;
    const [results] = await connection
      .promise()
      .query(
        `SELECT tests.id as id, test_name as name, subject_id as subjectID, subjects.name as subjectName FROM ((tests INNER JOIN teachers on tests.teacher_id = teachers.id) INNER JOIN subjects on subjects.id = tests.subject_id ) WHERE teachers.id = ${teacher_id}`
      );
    console.log(results);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTeacherTest = async (req, res) => {
  try {
    const testId = req.params.test_id;
    await connection.promise().query(`DELETE FROM tests WHERE id = ${testId}`);

    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const { text, type, answers, rightAnswer, testId, order, weight } =
      req.body;
    if (answers) {
      const [results] = await connection
        .promise()
        .query(
          `INSERT INTO questions (question_text, test_id, question_type, weight, answers, right_answer, order_in_test) VALUES ('${text}', ${testId}, '${type}', ${weight}, '${answers}','${rightAnswer}', ${order});`
        );

      res.json({ id: results.insertId });
    } else {
      const [results] = await connection
        .promise()
        .query(
          `INSERT INTO questions (question_text, test_id, question_type, weight,  right_answer, order_in_test) VALUES ('${text}', ${testId}, '${type}', ${weight}, '${rightAnswer}', ${order});`
        );

      res.json({ id: results.insertId });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const loadTestQuestions = async (req, res) => {
  try {
    const testId = req.params.test_id;
    console.log(testId);
    let [results] = await connection
      .promise()
      .query(
        `SELECT questions.id, questions.question_type as type, question_text as text, right_answer as rightAnswer, answers, weight, order_in_test as orderInTest, tests.test_name FROM questions INNER JOIN tests on questions.test_id = tests.id WHERE tests.id = ${testId}`
      );

    const testName = results[0]?.test_name || "нет вопросово";

    results = results.map((q) => {
      delete q["test_name"];
      return q;
    });
    console.log("res", results);

    res.json({ questions: results, testName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateQuestionOrder = async (req, res) => {
  try {
    const questionId = req.params.question_id;
    const { newOrder } = req.body;
    await connection
      .promise()
      .query(
        `UPDATE questions SET order_in_test = ${newOrder} WHERE id = ${questionId}`
      );

    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.question_id;
    await connection
      .promise()
      .query(`DELETE FROM  questions WHERE id = ${questionId}`);

    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateTestName = async (req, res) => {
  try {
    const testId = req.params.test_id;
    const { testName } = req.body;
    await connection
      .promise()
      .query(
        `UPDATE tests SET  test_name = '${testName}' WHERE id = ${testId}`
      );

    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const addTestResult = async (req, res) => {
  try {
    const { testId, studentName, studentMark, maxMark } = req.body;
    await connection
      .promise()
      .query(
        `INSERT INTO results (student_name, student_mark, test_id, max_mark) VALUES ('${studentName}', ${studentMark}, ${testId}, ${maxMark})`
      );

    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getTestResults = async (req, res) => {
  try {
    const testId = req.params.test_id;
    console.log(testId);
    let [results] = await connection
      .promise()
      .query(
        `SELECT id, student_name as studentName, student_mark as studentMark, max_mark as maxMark  FROM results WHERE test_id =${testId}`
      );
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.question_id;
    const { answers, rightAnswer, weight, text } = req.body;
    console.log("HOW");
    if (answers) {
      await connection
        .promise()
        .query(
          `UPDATE questions SET  answers = '${answers}', right_answer = '${rightAnswer}', weight = ${weight}, question_text = '${text}'  WHERE id = ${questionId}`
        );
    } else {
      await connection
        .promise()
        .query(
          `UPDATE questions SET  right_answer = '${rightAnswer}', weight = ${weight}, question_text = '${text}'  WHERE id = ${questionId}`
        );
    }

    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
