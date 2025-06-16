import connection from "../Database/index.js";

export const addSubject = async (req, res) => {
  try {
    const { teacherId, subjectName } = req.body;

    const [results] = await connection
      .promise()
      .query(
        `INSERT INTO subjects (name, teacher_id) VALUES ('${subjectName}', ${teacherId});`
      );

    console.log(results, "sdasdas");

    res.json({ id: results.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const loadTeacherSubjects = async (req, res) => {
  try {
    const teacher_id = req.params.teacher_id;
    console.log(teacher_id, "teacher");
    const [results] = await connection
      .promise()
      .query(`SELECT id, name from subjects WHERE teacher_id = ${teacher_id}`);

    res.json({ subjects: results });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTeacherSubject = async (req, res) => {
  try {
    const subject_id = req.params.subject_id;
    await connection
      .promise()
      .query(`DELETE FROM subjects WHERE id = ${subject_id}`);

    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
