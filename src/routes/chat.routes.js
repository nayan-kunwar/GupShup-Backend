import { Router } from "express";
import {
  addNewParticipantInGroupChat,
  createAGroupChat,
  createOrGetAOneOnOneChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  leaveGroupChat,
  removeParticipantFromGroupChat,
  renameGroupChat,
  searchAvailableUsers,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { mongoIdPathVariableValidator } from "../common/mongodb.validators.js";
import { validate } from "../validators/validate.js";
import {
  createAGroupChatValidator,
  updateGroupChatNameValidator,
} from "../validators/chat.validators.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllChats);

router.route("/users").get(searchAvailableUsers); // search users to create chat with

router.route("/c/:receiverId").post(
  mongoIdPathVariableValidator("receiverId"),
  validate,
  createOrGetAOneOnOneChat // crate chat with user
);

router
  .route("/group")
  .post(createAGroupChatValidator(), validate, createAGroupChat);

router
  .route("/group/:chatId")
  .get(mongoIdPathVariableValidator("chatId"), validate, getGroupChatDetails)
  .patch(
    mongoIdPathVariableValidator("chatId"),
    updateGroupChatNameValidator(),
    validate,
    renameGroupChat
  )
  .delete(mongoIdPathVariableValidator("chatId"), validate, deleteGroupChat);

router
  .route("/group/:chatId/:participantId")
  .post(
    mongoIdPathVariableValidator("chatId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    addNewParticipantInGroupChat
  )
  .delete(
    mongoIdPathVariableValidator("chatId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    removeParticipantFromGroupChat
  );

router
  .route("/leave/group/:chatId") // do not do this mistake: /group/leave/:chatId -> this will not be catch wrong params the above route will be called instead
  .delete(mongoIdPathVariableValidator("chatId"), validate, leaveGroupChat);

router
  .route("/remove/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"), validate, deleteOneOnOneChat); // delete one on one chat

export default router;
