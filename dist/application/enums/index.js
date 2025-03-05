"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPlatform = exports.EAnswerStatus = exports.EApplicationStatus = void 0;
var EApplicationStatus;
(function (EApplicationStatus) {
    EApplicationStatus["APPROVED"] = "APPROVED";
    EApplicationStatus["DENIED"] = "DENIED";
    EApplicationStatus["FIRST_STAGE_PASSED"] = "FIRST_STAGE_PASSED";
    EApplicationStatus["PENDING"] = "PENDING";
    EApplicationStatus["SUBMITTED"] = "SUBMITTED";
})(EApplicationStatus = exports.EApplicationStatus || (exports.EApplicationStatus = {}));
var EAnswerStatus;
(function (EAnswerStatus) {
    EAnswerStatus["ACCEPTED"] = "ACCEPTED";
    EAnswerStatus["REJECTED"] = "REJECTED";
    EAnswerStatus["FURTHER_INFO_REQUIRED"] = "FURTHER_INFO_REQUIRED";
    EAnswerStatus["NONE"] = "NONE";
})(EAnswerStatus = exports.EAnswerStatus || (exports.EAnswerStatus = {}));
var EPlatform;
(function (EPlatform) {
    EPlatform["WEBSITE"] = "WEBSITE";
    EPlatform["WHATSAPP"] = "WHATSAPP";
    EPlatform["INSTAGRAM"] = "INSTAGRAM";
})(EPlatform = exports.EPlatform || (exports.EPlatform = {}));
//# sourceMappingURL=index.js.map