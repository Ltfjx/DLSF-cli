"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookie = void 0;
exports.api = api;
const axios_1 = __importDefault(require("axios"));
const _1 = require(".");
let cancelTokens = {};
exports.cookie = {
    JSESSIONID: "",
    array: ""
};
function api(target, params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cancelTokens[target + JSON.stringify(params)]) {
            cancelTokens[target + JSON.stringify(params)]();
        }
        let source = axios_1.default.CancelToken.source();
        cancelTokens[target + JSON.stringify(params)] = source.cancel;
        if (params) {
            params = Object.assign(Object.assign({}, params), { j: exports.cookie.JSESSIONID, a: exports.cookie.array });
        }
        else {
            params = { j: exports.cookie.JSESSIONID, a: exports.cookie.array };
        }
        let queryString = params ? Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&') : '';
        const baseURL = "http://127.0.0.1:3000/api";
        const methodMap = {
            "/studentui/initstudinfo": "GET",
            "/dlsf/loginGetToken": "GET",
            "/selectcourse/initACC": "GET",
            "/selectcourse/scSubmit": "POST",
            "/common/semesterSS": "GET",
            "/StudentCourseTable/getData": "GET",
            "/dlsf/version": "GET",
            "/PublicQuery/getSelectCourseTermList": "GET",
            "/selectcourse/initSelCourses": "GET"
        };
        let config = {
            method: methodMap[target],
            url: baseURL + target + "?" + queryString,
            cancelToken: source.token
        };
        return new Promise((resolve, reject) => {
            (0, axios_1.default)(config)
                .then(function (response) {
                _1.logger.info("API OK " + target + "?" + queryString);
                resolve(response.data);
            })
                .catch(function (error) {
                if (axios_1.default.isCancel(error)) {
                    _1.logger.error("API CANCEL " + target + "?" + queryString);
                    reject("API CANCEL");
                }
                else {
                    _1.logger.errorRaw("API ERROR " + target + "?" + queryString, error);
                    reject("API ERROR");
                }
            });
        });
    });
}
