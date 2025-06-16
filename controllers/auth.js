import connection from "../Database/index.js";
import jwt, { decode } from "jsonwebtoken";

const JWT_KEY = "VKR2025";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await connection
      .promise()
      .query(
        `SELECT id, category,  email, password, first_name as firstName, second_name as secondName, third_name as thirdName FROM teachers where email = '${email}'`
      );

    if (results.length == 0) {
      res.status(400).json({ error: "Пользователь с такой почтой не найден!" });
      return;
    }

    console.log("Код выполняется");
    const teacher = results[0];
    console.log(teacher, "Учитель");

    if (teacher.password != password) {
      res.status(400).json({ error: "Неверный пароль! Повторите попытку!" });
      return;
    }
    const token = jwt.sign({ id: teacher.id }, JWT_KEY, { expiresIn: "1h" });
    res.json({ teacher, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { firstName, secondName, thirdName, email, category, password } =
      req.body;

    const [results] = await connection
      .promise()
      .query(`SELECT email from teachers where email = '${email}'`);

    if (results.length) {
      res
        .status(400)
        .json({ error: "Пользователь с таким email уже зарегистрирован!" });
      return;
    }

    await connection.promise().query(
      `INSERT INTO teachers (first_name, second_name, third_name, email, category, password) 
        VALUES ( '${firstName}', '${secondName}', '${thirdName}', '${email}', '${category}', ${password});`
    );
    res.json({ isSuccess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    console.log(token, "this is token");
    jwt.verify(token, JWT_KEY, async function (err, decoded) {
      if (err) {
        console.log("Ошибка", err);

        res.status(401).json({ error: err });
      } else {
        console.log(decoded);

        const [results] = await connection
          .promise()
          .query(
            `SELECT id, category,  email, password, first_name as firstName, second_name as secondName, third_name as thirdName FROM teachers where id = ${decoded.id}`
          );
        const teacher = results[0];
        console.log(teacher, "Учитель");
        res.status(200).json({ teacher });
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ isSuccess: false });
  }
};
