self.Module = {
    onRuntimeInitialized: function () {
        onWasmLoaded();
    }
};

self.importScripts("common.js");
self.importScripts("libffmpeg_264_265.js");

function VideoDecoder() {
    this.logger = new Logger("VideoDecoder");
    this.coreLogLevel = LOG_LEVEL_JS;
    this.accurateSeek = true;
    this.wasmLoaded = false;
    this.tmpReqQue = [];
    this.decoder_type = DECODER_H264;
    this.pts = 0;
    this.cacheBuffer = null;
    this.decodeTimer = null;
    this.videoCallback = null;
    this.audioCallback = null;
    this.requestCallback = null;
    this.videoSize = 0;
}

VideoDecoder.prototype.initDecoder = function (type, chunkSize) {

    this.decoder_type = type;

    this.videoCallback = Module.addFunction(function (addr_y, addr_u, addr_v, stride_y, stride_u, stride_v, width, height, pts) {
        //console.log("[%d]In video callback, size = %d * %d, pts = %d", ++self.decoder.videoSize, width, height, pts)

        let yLength = width * height;
        let uvLength = (width / 2) * (height / 2);
        let size = yLength + uvLength + uvLength;
        let data = new Uint8Array(size);
        let pos = 0;
        for (let i = 0; i < height; i++) {
            let src = addr_y + i * stride_y
            let tmp = HEAPU8.subarray(src, src + width)
            tmp = new Uint8Array(tmp)
            data.set(tmp, pos)
            pos += tmp.length
        }
        for (let i = 0; i < height / 2; i++) {
            let src = addr_u + i * stride_u
            let tmp = HEAPU8.subarray(src, src + width / 2)
            tmp = new Uint8Array(tmp)
            data.set(tmp, pos)
            pos += tmp.length
        }
        for (let i = 0; i < height / 2; i++) {
            let src = addr_v + i * stride_v
            let tmp = HEAPU8.subarray(src, src + width / 2)
            tmp = new Uint8Array(tmp)
            data.set(tmp, pos)
            pos += tmp.length
        }
        /*         var obj = {
                    data: data,
                    width,
                    height
                }
                self.decoder.displayVideoFrame(obj); */
        var objData = {
            t: kVideoFrame,
            s: pts * 9000,
            d: data,
            w: width,
            h: height,
            y: yLength,
            uv: uvLength
        };
        self.postMessage(objData, [objData.d.buffer]);
    });

    var ret = Module._openDecoder(this.decoder_type, this.videoCallback, this.coreLogLevel);
    this.logger.logInfo("initDecoder return " + ret + ".");
    // if (0 == ret) {
    // this.cacheBuffer = Module._malloc(chunkSize);
    // }
    var objData = {
        t: kInitDecoderRsp,
        e: ret
    };
    self.postMessage(objData);
};

VideoDecoder.prototype.uninitDecoder = function () {
    var ret = Module._closeDecoder();
    this.logger.logInfo("Uninit ffmpeg decoder return " + ret + ".");
    if (this.cacheBuffer != null) {
        Module._free(this.cacheBuffer);
        this.cacheBuffer = null;
    }
};

VideoDecoder.prototype.openDecoder = function () {
    var paramCount = 7, paramSize = 4;
    var paramByteBuffer = Module._malloc(paramCount * paramSize);
    var ret = Module._openDecoder(paramByteBuffer, paramCount, this.videoCallback, this.audioCallback, this.requestCallback);
    this.logger.logInfo("openDecoder return " + ret);

    if (ret == 0) {
        var paramIntBuff = paramByteBuffer >> 2;
        var paramArray = Module.HEAP32.subarray(paramIntBuff, paramIntBuff + paramCount);
        var duration = paramArray[0];
        var videoPixFmt = paramArray[1];
        var videoWidth = paramArray[2];
        var videoHeight = paramArray[3];
        var audioSampleFmt = paramArray[4];
        var audioChannels = paramArray[5];
        var audioSampleRate = paramArray[6];

        var objData = {
            t: kOpenDecoderRsp,
            e: ret,
            v: {
                d: duration,
                p: videoPixFmt,
                w: videoWidth,
                h: videoHeight
            },
            a: {
                f: audioSampleFmt,
                c: audioChannels,
                r: audioSampleRate
            }
        };
        self.postMessage(objData);
    } else {
        var objData = {
            t: kOpenDecoderRsp,
            e: ret
        };
        self.postMessage(objData);
    }
    Module._free(paramByteBuffer);
};

VideoDecoder.prototype.flushDecoder = function () {
    this.logger.logInfo("flushDecoder.");

    var ret = Module._flushDecoder();
    this.logger.logInfo("flush ffmpeg decoder return " + ret + ".");

    //var objData = {
    //    t: kCloseDecoderRsp,
    //    e: 0
    //};
    //self.postMessage(objData);
};

VideoDecoder.prototype.closeDecoder = function () {
    this.logger.logInfo("closeDecoder.");
    if (this.decodeTimer) {
        clearInterval(this.decodeTimer);
        this.decodeTimer = null;
        this.logger.logInfo("Decode timer stopped.");
    }

    var ret = Module._closeDecoder();
    this.logger.logInfo("Close ffmpeg decoder return " + ret + ".");

    var objData = {
        t: kCloseDecoderRsp,
        e: 0
    };
    self.postMessage(objData);
};

VideoDecoder.prototype.startDecoding = function (interval) {
    //this.logger.logInfo("Start decoding.");
    if (this.decodeTimer) {
        clearInterval(this.decodeTimer);
    }
    this.decodeTimer = setInterval(this.decode, interval);
};

VideoDecoder.prototype.pauseDecoding = function () {
    //this.logger.logInfo("Pause decoding.");
    if (this.decodeTimer) {
        clearInterval(this.decodeTimer);
        this.decodeTimer = null;
    }
};

VideoDecoder.prototype.decode = function () {
    var ret = Module._decodeOnePacket();
    if (ret == 7) {
        self.decoder.logger.logInfo("Decoder finished.");
        self.decoder.pauseDecoding();
        var objData = {
            t: kDecodeFinishedEvt,
        };
        self.postMessage(objData);
    }

    while (ret == 9) {
        //self.decoder.logger.logInfo("One old frame");
        ret = Module._decodeOnePacket();
    }
};

VideoDecoder.prototype.sendData = function (data) {
    var typedArray = new Uint8Array(data);
    this.cacheBuffer = Module._malloc(typedArray.length);
    Module.HEAPU8.set(typedArray, this.cacheBuffer);
    //Module._sendData(this.cacheBuffer, typedArray.length);
    Module._decodeData(this.cacheBuffer, typedArray.length, this.pts++);
    Module._free(this.cacheBuffer);
};

VideoDecoder.prototype.seekTo = function (ms) {
    var accurateSeek = this.accurateSeek ? 1 : 0;
    var ret = Module._seekTo(ms, accurateSeek);
    var objData = {
        t: kSeekToRsp,
        r: ret
    };
    self.postMessage(objData);
};

VideoDecoder.prototype.processReq = function (req) {
    //this.logger.logInfo("processReq " + req.t + ".");
    switch (req.t) {
        case kInitDecoderReq:
            this.initDecoder(req.s, req.c);
            break;
        case kUninitDecoderReq:
            this.uninitDecoder();
            break;
        case kOpenDecoderReq:
            this.openDecoder();
            break;
        case kCloseDecoderReq:
            this.clearReq();
            this.closeDecoder();
            break;
        case kStartDecodingReq:
            //this.startDecoding(req.i);
            break;
        case kPauseDecodingReq:
            //this.pauseDecoding();
            this.flushDecoder();
            break;
        case kFeedDataReq:
            this.sendData(req.d);
            break;
        case kSeekToReq:
            this.clearReq();
            //this.seekTo(req.ms);
            break;
        default:
            this.logger.logError("Unsupport messsage " + req.t);
    }
};

VideoDecoder.prototype.cacheReq = function (req) {
    if (req) {
        this.tmpReqQue.push(req);
    }
};

VideoDecoder.prototype.clearReq = function () {
    this.tmpReqQue = [];
};

VideoDecoder.prototype.onWasmLoaded = function () {
    this.logger.logInfo("Wasm loaded.");
    this.wasmLoaded = true;

    this.videoCallback = Module.addFunction(function (buff, size, timestamp) {
        var outArray = Module.HEAPU8.subarray(buff, buff + size);
        var data = new Uint8Array(outArray);
        var objData = {
            t: kVideoFrame,
            s: timestamp,
            d: data
        };
        self.postMessage(objData, [objData.d.buffer]);
    });

    this.audioCallback = Module.addFunction(function (buff, size, timestamp) {
        var outArray = Module.HEAPU8.subarray(buff, buff + size);
        var data = new Uint8Array(outArray);
        var objData = {
            t: kAudioFrame,
            s: timestamp,
            d: data
        };
        self.postMessage(objData, [objData.d.buffer]);
    });

    this.requestCallback = Module.addFunction(function (offset) {
        var objData = {
            t: kRequestDataEvt,
            o: offset
        };
        self.postMessage(objData);
    });

    while (this.tmpReqQue.length > 0) {
        var req = this.tmpReqQue.shift();
        this.processReq(req);
    }
};

self.decoder = new VideoDecoder;

self.onmessage = function (evt) {
    if (!self.decoder) {
        console.log("[ER] Decoder not initialized!");
        return;
    }

    var req = evt.data;
    if (!self.decoder.wasmLoaded) {
        self.decoder.cacheReq(req);
        self.decoder.logger.logInfo("Temp cache req " + req.t + ".");
        return;
    }

    self.decoder.processReq(req);
};

function onWasmLoaded() {
    if (self.decoder) {
        self.decoder.onWasmLoaded();
    } else {
        console.log("[ER] No decoder!");
    }
}
