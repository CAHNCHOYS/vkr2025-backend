import { Router } from "express";
import * as AuthController from "../controllers/auth.js";
import * as SubjectController from "../controllers/subjects.js";
import * as TestController from "../controllers/tests.js";

const router = Router();

router.get("/api/v", (req, res) => {
  res.json({ id: 1 });
});

router.post("/api/auth/register", AuthController.register);
router.post("/api/auth/login", AuthController.login);
router.post("/api/tests", TestController.addTest);

router.post("/api/subjects", SubjectController.addSubject);
router.post("/api/questions", TestController.addQuestion);

router.post("/api/tests/results", TestController.addTestResult);

router.get("/api/auth/verify", AuthController.verifyToken);
router.get("/api/subjects/:teacher_id", SubjectController.loadTeacherSubjects);
router.get("/api/tests/:teacher_id", TestController.getTeacherTests);
router.get("/api/student_tests/:test_id", TestController.loadTestQuestions);
router.get("/api/results/:test_id", TestController.getTestResults);

router.delete(
  "/api/subjects/:subject_id",
  SubjectController.deleteTeacherSubject
);
router.delete("/api/tests/:test_id", TestController.deleteTeacherTest);
router.delete("/api/questions/:question_id", TestController.deleteQuestion);

router.patch(
  "/api/questions/order/:question_id",
  TestController.updateQuestionOrder
);
router.patch("/api/tests/:test_id", TestController.updateTestName);
router.patch("/api/questions/edit/:question_id", TestController.updateQuestion);


export default router;
