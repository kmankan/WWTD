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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path = require("path");
var fs = require("fs");
var elevenlabs_1 = require("elevenlabs");
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });
var ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
if (!ELEVEN_LABS_API_KEY) {
    throw new Error("ELEVEN_LABS_API_KEY is not set in environment variables.");
}
var elevenlabs = new elevenlabs_1.ElevenLabsClient({
    apiKey: ELEVEN_LABS_API_KEY,
});
var TEST_TEXT = "Hello, this is a test of the Eleven Labs text-to-speech functionality.";
var TEST_VOICE_ID = "apPaCOkljdxKYIV8LQlV"; // Replace with your valid Eleven Labs voice ID
function readableToBuffer(readable) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, chunk, e_1_1;
        var _a, readable_1, readable_1_1;
        var _b, e_1, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    chunks = [];
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, 7, 12]);
                    _a = true, readable_1 = __asyncValues(readable);
                    _e.label = 2;
                case 2: return [4 /*yield*/, readable_1.next()];
                case 3:
                    if (!(readable_1_1 = _e.sent(), _b = readable_1_1.done, !_b)) return [3 /*break*/, 5];
                    _d = readable_1_1.value;
                    _a = false;
                    chunk = _d;
                    chunks.push(Buffer.from(chunk));
                    _e.label = 4;
                case 4:
                    _a = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _e.trys.push([7, , 10, 11]);
                    if (!(!_a && !_b && (_c = readable_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _c.call(readable_1)];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, Buffer.concat(chunks)];
            }
        });
    });
}
function testElevenLabsDirect() {
    return __awaiter(this, void 0, void 0, function () {
        var audioStream, audioBuffer, outputPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("Sending text-to-speech request to Eleven Labs API...");
                    return [4 /*yield*/, elevenlabs.textToSpeech.convert(TEST_VOICE_ID, {
                            model_id: "eleven_multilingual_v2",
                            text: TEST_TEXT,
                        })];
                case 1:
                    audioStream = _a.sent();
                    console.log("Received audio stream. Converting to buffer...");
                    return [4 /*yield*/, readableToBuffer(audioStream)];
                case 2:
                    audioBuffer = _a.sent();
                    console.log("Audio buffer size:", audioBuffer.length);
                    // Check MP3 header
                    console.log("First 20 bytes of audio buffer:", audioBuffer.slice(0, 20));
                    outputPath = "output_audio.mp3";
                    fs.writeFileSync(outputPath, audioBuffer, { encoding: "binary" });
                    console.log("Audio saved as '".concat(outputPath, "'. Play the file to verify."));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error testing Eleven Labs API:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
testElevenLabsDirect();
