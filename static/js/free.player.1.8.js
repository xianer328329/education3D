(function () {
    'use strict';

    var infoHandler = null;
    // ERROR=0, WARN=1, LOG=2, DEBUG=3
    const LogLevel = {
        Error: 0,
        Warn: 1,
        Log: 2,
        Debug: 3
    };

    let DEFAULT_LOG_LEVEL = LogLevel.Debug;

    function setDefaultLogLevel(level) {
        DEFAULT_LOG_LEVEL = level;
    }
    class Logger {
        constructor(level,tag) {
            this.tag = tag;
            this.setLevel(level||DEFAULT_LOG_LEVEL);
        }

        setLevel(level) {
            this.level = level;
        }

        static get level_map() {
            return {
                [LogLevel.Debug]: 'log',
                [LogLevel.Log]: 'log',
                [LogLevel.Warn]: 'warn',
                [LogLevel.Error]: 'error'
            }
        };

        _log(lvl, args) {
            args = Array.prototype.slice.call(args);
            if (this.tag) {
                args.unshift(`[${this.tag}]`);
            }
            if (this.level >= lvl) console[Logger.level_map[lvl]].apply(console, args);
        }
        log() {
            //          this._log(LogLevel.Log, arguments);
        }
        debug() {
            //          this._log(LogLevel.Debug, arguments);
        }
        error() {
            //          this._log(LogLevel.Error, arguments);
            if (infoHandler) {
                infoHandler(arguments);
            }
        }
        warn() {
            //          this._log(LogLevel.Warn, arguments);
        }
    }

    const taggedLoggers = new Map();
    function getTagged(tag) {
        if (!taggedLoggers.has(tag)) {
            taggedLoggers.set(tag, new Logger(DEFAULT_LOG_LEVEL, tag));
        }
        return taggedLoggers.get(tag);
    }
    const Log = new Logger();

    const listener = Symbol("event_listener");
    const listeners = Symbol("event_listeners");

    class DestructibleEventListener {
        constructor(eventListener) {
            this[listener] = eventListener;
            this[listeners] = new Map();
        }

        clear() {
            if (this[listeners]) {
                for (let entry of this[listeners]) {
                    for (let fn of entry[1]) {
                        this[listener].removeEventListener(entry[0], fn);
                    }
                }
            }
            this[listeners].clear();
        }

        destroy() {
            this.clear();
            this[listeners] = null;
        }

        on(event, selector, fn) {
            if (fn == undefined) {
                fn = selector;
                selector = null;
            }
            if (selector) {
                return this.addEventListener(event, (e) => {
                    if (e.target.matches(selector)) {
                        fn(e);
                    }
                });
            } else {
                return this.addEventListener(event, fn);
            }
        }

        addEventListener(event, fn) {
            if (!this[listeners].has(event)) {
                this[listeners].set(event, new Set());
            }
            this[listeners].get(event).add(fn);
            this[listener].addEventListener(event, fn, false);
            return fn;
        }

        removeEventListener(event, fn) {
            this[listener].removeEventListener(event, fn, false);
            if (this[listeners].has(event)) {
                //this[listeners].set(event, new Set());
                let ev = this[listeners].get(event);
                ev.delete(fn);
                if (!ev.size) {
                    this[listeners].delete(event);
                }
            }
        }

        dispatchEvent(event) {
            if (this[listener]) {
                this[listener].dispatchEvent(event);
            }
        }
    }

    class EventEmitter {
        constructor(element = null) {
            this[listener] = new DestructibleEventListener(element || document.createElement('div'));
        }

        clear() {
            if (this[listener]) {
                this[listener].clear();
            }
        }

        destroy() {
            if (this[listener]) {
                this[listener].destroy();
                this[listener] = null;
            }
        }

        on(event, selector, fn) {
            if (this[listener]) {
                return this[listener].on(event, selector, fn);
            }
            return null;
        }

        addEventListener(event, fn) {
            if (this[listener]) {
                return this[listener].addEventListener(event, fn, false);
            }
            return null;
        }

        removeEventListener(event, fn) {
            if (this[listener]) {
                this[listener].removeEventListener(event, fn, false);
            }
        }

        dispatchEvent(event, data) {
            if (this[listener]) {
                this[listener].dispatchEvent(new CustomEvent(event, { detail: data }));
            }
        }
    }

    class EventSourceWrapper {
        constructor(eventSource) {
            this.eventSource = eventSource;
            this[listeners] = new Map();
        }

        on(event, selector, fn) {
            if (!this[listeners].has(event)) {
                this[listeners].set(event, new Set());
            }
            let listener = this.eventSource.on(event, selector, fn);
            if (listener) {
                this[listeners].get(event).add(listener);
            }
        }

        off(event, fn) {
            this.eventSource.removeEventListener(event, fn);
        }

        clear() {
            this.eventSource.clear();
            this[listeners].clear();
        }

        destroy() {
            this.eventSource.clear();
            this[listeners] = null;
            this.eventSource = null;
        }
    }

    /**
     * Generate MP4 Box
     * got from: https://github.com/dailymotion/hls.js
     */
    class MP4 {
        static init() {
            MP4.types = {
                avc1: [], // codingname
                avcC: [],
                btrt: [],
                dinf: [],
                dref: [],
                esds: [],
                ftyp: [],
                hdlr: [],
                mdat: [],
                mdhd: [],
                mdia: [],
                mfhd: [],
                minf: [],
                moof: [],
                moov: [],
                mp4a: [],
                mvex: [],
                mvhd: [],
                sdtp: [],
                stbl: [],
                stco: [],
                stsc: [],
                stsd: [],
                stsz: [],
                stts: [],
                tfdt: [],
                tfhd: [],
                traf: [],
                trak: [],
                trun: [],
                trex: [],
                tkhd: [],
                vmhd: [],
                smhd: []
            };

            var i;
            for (i in MP4.types) {
                if (MP4.types.hasOwnProperty(i)) {
                    MP4.types[i] = [
                        i.charCodeAt(0),
                        i.charCodeAt(1),
                        i.charCodeAt(2),
                        i.charCodeAt(3)
                    ];
                }
            }

            var videoHdlr = new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x00, // pre_defined
                0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00, // reserved
                0x56, 0x69, 0x64, 0x65,
                0x6f, 0x48, 0x61, 0x6e,
                0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
            ]);

            var audioHdlr = new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x00, // pre_defined
                0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00, // reserved
                0x53, 0x6f, 0x75, 0x6e,
                0x64, 0x48, 0x61, 0x6e,
                0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
            ]);

            MP4.HDLR_TYPES = {
                'video': videoHdlr,
                'audio': audioHdlr
            };

            var dref = new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x01, // entry_count
                0x00, 0x00, 0x00, 0x0c, // entry_size
                0x75, 0x72, 0x6c, 0x20, // 'url' type
                0x00, // version 0
                0x00, 0x00, 0x01 // entry_flags
            ]);

            var stco = new Uint8Array([
                0x00, // version
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x00 // entry_count
            ]);

            MP4.STTS = MP4.STSC = MP4.STCO = stco;

            MP4.STSZ = new Uint8Array([
                0x00, // version
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x00, // sample_size
                0x00, 0x00, 0x00, 0x00, // sample_count
            ]);
            MP4.VMHD = new Uint8Array([
                0x00, // version
                0x00, 0x00, 0x01, // flags
                0x00, 0x00, // graphicsmode
                0x00, 0x00,
                0x00, 0x00,
                0x00, 0x00 // opcolor
            ]);
            MP4.SMHD = new Uint8Array([
                0x00, // version
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, // balance
                0x00, 0x00 // reserved
            ]);

            MP4.STSD = new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x01
            ]); // entry_count

            var majorBrand = new Uint8Array([105, 115, 111, 109]); // isom
            var avc1Brand = new Uint8Array([97, 118, 99, 49]); // avc1
            var minorVersion = new Uint8Array([0, 0, 0, 1]);

            MP4.FTYP = MP4.box(MP4.types.ftyp, majorBrand, minorVersion, majorBrand, avc1Brand);
            MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, dref));
        }

        static box(type, ...payload) {
            var size = 8,
                i = payload.length,
                len = i,
                result;
            // calculate the total size we need to allocate
            while (i--) {
                size += payload[i].byteLength;
            }
            result = new Uint8Array(size);
            result[0] = (size >> 24) & 0xff;
            result[1] = (size >> 16) & 0xff;
            result[2] = (size >> 8) & 0xff;
            result[3] = size & 0xff;
            result.set(type, 4);
            // copy the payload into the result
            for (i = 0, size = 8; i < len; ++i) {
                // copy payload[i] array @ offset size
                result.set(payload[i], size);
                size += payload[i].byteLength;
            }
            return result;
        }

        static hdlr(type) {
            return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
        }

        static mdat(data) {
            return MP4.box(MP4.types.mdat, data);
        }

        static mdhd(timescale, duration) {
            return MP4.box(MP4.types.mdhd, new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags
                0x00, 0x00, 0x00, 0x02, // creation_time
                0x00, 0x00, 0x00, 0x03, // modification_time
                (timescale >> 24) & 0xFF,
                (timescale >> 16) & 0xFF,
                (timescale >> 8) & 0xFF,
                timescale & 0xFF, // timescale
                (duration >> 24),
                (duration >> 16) & 0xFF,
                (duration >> 8) & 0xFF,
                duration & 0xFF, // duration
                0x55, 0xc4, // 'und' language (undetermined)
                0x00, 0x00
            ]));
        }

        static mdia(track) {
            return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale, track.duration), MP4.hdlr(track.type), MP4.minf(track));
            //return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale, 0), MP4.hdlr(track.type), MP4.minf(track));
        }

        static mfhd(sequenceNumber) {
            return MP4.box(MP4.types.mfhd, new Uint8Array([
                0x00,
                0x00, 0x00, 0x00, // flags
                (sequenceNumber >> 24),
                (sequenceNumber >> 16) & 0xFF,
                (sequenceNumber >> 8) & 0xFF,
                sequenceNumber & 0xFF, // sequence_number
            ]));
        }

        static minf(track) {
            if (track.type === 'audio') {
                return MP4.box(MP4.types.minf, MP4.box(MP4.types.smhd, MP4.SMHD), MP4.DINF, MP4.stbl(track));
            } else {
                return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.VMHD), MP4.DINF, MP4.stbl(track));
            }
        }

        static moof(sn, baseMediaDecodeTime, track) {
            return MP4.box(MP4.types.moof, MP4.mfhd(sn), MP4.traf(track, baseMediaDecodeTime));
        }
        /**
         * @param tracks... (optional) {array} the tracks associated with this movie
         */
        static moov(tracks, duration, timescale) {
            var
                i = tracks.length,
                boxes = [];

            while (i--) {
                boxes[i] = MP4.trak(tracks[i]);
            }

            return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(timescale, duration)].concat(boxes).concat(MP4.mvex(tracks)));
            //return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(timescale, 0)].concat(boxes).concat(MP4.mvex(tracks)));
        }

        static mvex(tracks) {
            var
                i = tracks.length,
                boxes = [];

            while (i--) {
                boxes[i] = MP4.trex(tracks[i]);
            }
            return MP4.box.apply(null, [MP4.types.mvex].concat(boxes));
        }

        static mvhd(timescale, duration) {
            duration = 0;

            var
                bytes = new Uint8Array([
                    0x00, // version 0
                    0x00, 0x00, 0x00, // flags
                    0x00, 0x00, 0x00, 0x01, // creation_time
                    0x00, 0x00, 0x00, 0x02, // modification_time
                    (timescale >> 24) & 0xFF,
                    (timescale >> 16) & 0xFF,
                    (timescale >> 8) & 0xFF,
                    timescale & 0xFF, // timescale
                    (duration >> 24) & 0xFF,
                    (duration >> 16) & 0xFF,
                    (duration >> 8) & 0xFF,
                    duration & 0xFF, // duration
                    0x00, 0x01, 0x00, 0x00, // 1.0 rate
                    0x01, 0x00, // 1.0 volume
                    0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x00, 0x00, 0x00, // reserved
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, // pre_defined
                    0xff, 0xff, 0xff, 0xff // next_track_ID
                ]);
            return MP4.box(MP4.types.mvhd, bytes);
        }

        static sdtp(track) {
            var
                samples = track.samples || [],
                bytes = new Uint8Array(4 + samples.length),
                flags,
                i;
            // leave the full box header (4 bytes) all zero
            // write the sample table
            for (i = 0; i < samples.length; i++) {
                flags = samples[i].flags;
                bytes[i + 4] = (flags.dependsOn << 4) |
                    (flags.isDependedOn << 2) |
                    (flags.hasRedundancy);
            }

            return MP4.box(MP4.types.sdtp, bytes);
        }

        static stbl(track) {
            return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.box(MP4.types.stts, MP4.STTS), MP4.box(MP4.types.stsc, MP4.STSC), MP4.box(MP4.types.stsz, MP4.STSZ), MP4.box(MP4.types.stco, MP4.STCO));
        }

        static avc1(track) {
            var sps = [],
                pps = [],
                i, data, len;
            // assemble the SPSs

            for (i = 0; i < track.sps.length; i++) {
                data = track.sps[i];
                len = data.byteLength;
                sps.push((len >>> 8) & 0xFF);
                sps.push((len & 0xFF));
                sps = sps.concat(Array.prototype.slice.call(data)); // SPS
            }

            // assemble the PPSs
            for (i = 0; i < track.pps.length; i++) {
                data = track.pps[i];
                len = data.byteLength;
                pps.push((len >>> 8) & 0xFF);
                pps.push((len & 0xFF));
                pps = pps.concat(Array.prototype.slice.call(data));
            }

            var avcc = MP4.box(MP4.types.avcC, new Uint8Array([
                0x01,   // version
                sps[3], // profile
                sps[4], // profile compat
                sps[5], // level
                0xfc | 3, // lengthSizeMinusOne, hard-coded to 4 bytes
                0xE0 | track.sps.length // 3bit reserved (111) + numOfSequenceParameterSets
            ].concat(sps).concat([
                track.pps.length // numOfPictureParameterSets
            ]).concat(pps))), // "PPS"
                width = track.width,
                height = track.height;
            //console.log('avcc:' + Hex.hexDump(avcc));
            return MP4.box(MP4.types.avc1, new Uint8Array([
                0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, // reserved
                0x00, 0x01, // data_reference_index
                0x00, 0x00, // pre_defined
                0x00, 0x00, // reserved
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // pre_defined
                (width >> 8) & 0xFF,
                width & 0xff, // width
                (height >> 8) & 0xFF,
                height & 0xff, // height
                0x00, 0x48, 0x00, 0x00, // horizresolution
                0x00, 0x48, 0x00, 0x00, // vertresolution
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x01, // frame_count
                0x12,
                0x62, 0x69, 0x6E, 0x65, //binelpro.ru
                0x6C, 0x70, 0x72, 0x6F,
                0x2E, 0x72, 0x75, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, // compressorname
                0x00, 0x18,   // depth = 24
                0x11, 0x11]), // pre_defined = -1
                avcc,
                MP4.box(MP4.types.btrt, new Uint8Array([
                    0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
                    0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
                    0x00, 0x2d, 0xc6, 0xc0])) // avgBitrate
            );
        }

        static esds(track) {
            var configlen = track.config.byteLength;
            let data = new Uint8Array(26 + configlen + 3);
            data.set([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags

                0x03, // descriptor_type
                0x17 + configlen, // length
                0x00, 0x01, //es_id
                0x00, // stream_priority

                0x04, // descriptor_type
                0x0f + configlen, // length
                0x40, //codec : mpeg4_audio
                0x15, // stream_type
                0x00, 0x00, 0x00, // buffer_size
                0x00, 0x00, 0x00, 0x00, // maxBitrate
                0x00, 0x00, 0x00, 0x00, // avgBitrate

                0x05, // descriptor_type
                configlen
            ]);
            data.set(track.config, 26);
            data.set([0x06, 0x01, 0x02], 26 + configlen);
            // return new Uint8Array([
            //     0x00, // version 0
            //     0x00, 0x00, 0x00, // flags
            //
            //     0x03, // descriptor_type
            //     0x17+configlen, // length
            //     0x00, 0x01, //es_id
            //     0x00, // stream_priority
            //
            //     0x04, // descriptor_type
            //     0x0f+configlen, // length
            //     0x40, //codec : mpeg4_audio
            //     0x15, // stream_type
            //     0x00, 0x00, 0x00, // buffer_size
            //     0x00, 0x00, 0x00, 0x00, // maxBitrate
            //     0x00, 0x00, 0x00, 0x00, // avgBitrate
            //
            //     0x05 // descriptor_type
            // ].concat([configlen]).concat(track.config).concat([0x06, 0x01, 0x02])); // GASpecificConfig)); // length + audio config descriptor
            return data;
        }

        static mp4a(track) {
            var audiosamplerate = track.audiosamplerate;
            return MP4.box(MP4.types.mp4a, new Uint8Array([
                0x00, 0x00, 0x00, // reserved
                0x00, 0x00, 0x00, // reserved
                0x00, 0x01, // data_reference_index
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, track.channelCount, // channelcount
                0x00, 0x10, // sampleSize:16bits
                0x00, 0x00, // pre_defined
                0x00, 0x00, // reserved2
                (audiosamplerate >> 8) & 0xFF,
                audiosamplerate & 0xff, //
                0x00, 0x00]),
                MP4.box(MP4.types.esds, MP4.esds(track)));
        }

        static stsd(track) {
            if (track.type === 'audio') {
                return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp4a(track));
            } else {
                return MP4.box(MP4.types.stsd, MP4.STSD, MP4.avc1(track));
            }
        }

        static tkhd(track) {
            var id = track.id,
                duration = track.duration,
                width = track.width,
                height = track.height,
                volume = track.volume;
            return MP4.box(MP4.types.tkhd, new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x07, // flags
                0x00, 0x00, 0x00, 0x00, // creation_time
                0x00, 0x00, 0x00, 0x00, // modification_time
                (id >> 24) & 0xFF,
                (id >> 16) & 0xFF,
                (id >> 8) & 0xFF,
                id & 0xFF, // track_ID
                0x00, 0x00, 0x00, 0x00, // reserved
                (duration >> 24),
                (duration >> 16) & 0xFF,
                (duration >> 8) & 0xFF,
                duration & 0xFF, // duration
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, // reserved
                0x00, 0x00, // layer
                0x00, 0x00, // alternate_group
                (volume >> 0) & 0xff, (((volume % 1) * 10) >> 0) & 0xff, // track volume // FIXME
                0x00, 0x00, // reserved
                0x00, 0x01, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x01, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00,
                0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
                (width >> 8) & 0xFF,
                width & 0xFF,
                0x00, 0x00, // width
                (height >> 8) & 0xFF,
                height & 0xFF,
                0x00, 0x00 // height
            ]));
        }

        static traf(track, baseMediaDecodeTime) {
            var sampleDependencyTable = MP4.sdtp(track),
                id = track.id;
            return MP4.box(MP4.types.traf,
                MP4.box(MP4.types.tfhd, new Uint8Array([
                    0x00, // version 0
                    0x00, 0x00, 0x00, // flags
                    (id >> 24),
                    (id >> 16) & 0XFF,
                    (id >> 8) & 0XFF,
                    (id & 0xFF) // track_ID
                ])),
                MP4.box(MP4.types.tfdt, new Uint8Array([
                    0x00, // version 0
                    0x00, 0x00, 0x00, // flags
                    (baseMediaDecodeTime >> 24),
                    (baseMediaDecodeTime >> 16) & 0XFF,
                    (baseMediaDecodeTime >> 8) & 0XFF,
                    (baseMediaDecodeTime & 0xFF) // baseMediaDecodeTime
                ])),
                MP4.trun(track,
                    sampleDependencyTable.length +
                    16 + // tfhd
                    16 + // tfdt
                    8 +  // traf header
                    16 + // mfhd
                    8 +  // moof header
                    8),  // mdat header
                sampleDependencyTable);
        }

        /**
         * Generate a track box.
         * @param track {object} a track definition
         * @return {Uint8Array} the track box
         */
        static trak(track) {
            track.duration = track.duration || 0xffffffff;
            return MP4.box(MP4.types.trak, MP4.tkhd(track), MP4.mdia(track));
        }

        static trex(track) {
            var id = track.id;
            return MP4.box(MP4.types.trex, new Uint8Array([
                0x00, // version 0
                0x00, 0x00, 0x00, // flags
                (id >> 24),
                (id >> 16) & 0XFF,
                (id >> 8) & 0XFF,
                (id & 0xFF), // track_ID
                0x00, 0x00, 0x00, 0x01, // default_sample_description_index
                0x00, 0x00, 0x00, 0x00, // default_sample_duration
                0x00, 0x00, 0x00, 0x00, // default_sample_size
                0x00, 0x01, 0x00, 0x01 // default_sample_flags
            ]));
        }

        static trun(track, offset) {
            var samples = track.samples || [],
                len = samples.length,
                arraylen = 12 + (16 * len),
                array = new Uint8Array(arraylen),
                i, sample, duration, size, flags, cts;
            offset += 8 + arraylen;
            array.set([
                0x00, // version 0
                0x00, 0x0f, 0x01, // flags
                (len >>> 24) & 0xFF,
                (len >>> 16) & 0xFF,
                (len >>> 8) & 0xFF,
                len & 0xFF, // sample_count
                (offset >>> 24) & 0xFF,
                (offset >>> 16) & 0xFF,
                (offset >>> 8) & 0xFF,
                offset & 0xFF // data_offset
            ], 0);
            for (i = 0; i < len; i++) {
                sample = samples[i];
                duration = sample.duration;
                size = sample.size;
                flags = sample.flags;
                cts = sample.cts;
                array.set([
                    (duration >>> 24) & 0xFF,
                    (duration >>> 16) & 0xFF,
                    (duration >>> 8) & 0xFF,
                    duration & 0xFF, // sample_duration
                    (size >>> 24) & 0xFF,
                    (size >>> 16) & 0xFF,
                    (size >>> 8) & 0xFF,
                    size & 0xFF, // sample_size
                    (flags.isLeading << 2) | flags.dependsOn,
                    (flags.isDependedOn << 6) |
                    (flags.hasRedundancy << 4) |
                    (flags.paddingValue << 1) |
                    flags.isNonSync,
                    flags.degradPrio & 0xF0 << 8,
                    flags.degradPrio & 0x0F, // sample_flags
                    (cts >>> 24) & 0xFF,
                    (cts >>> 16) & 0xFF,
                    (cts >>> 8) & 0xFF,
                    cts & 0xFF // sample_composition_time_offset
                ], 12 + 16 * i);
            }
            return MP4.box(MP4.types.trun, array);
        }

        static initSegment(tracks, duration, timescale) {
            if (!MP4.types) {
                MP4.init();
            }
            var movie = MP4.moov(tracks, duration, timescale), result;
            result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
            result.set(MP4.FTYP);
            result.set(movie, MP4.FTYP.byteLength);
            return result;
        }
    }

    const LOG_TAG = "mse";
    const Log$1 = getTagged(LOG_TAG);

    class MSEBuffer {
        constructor(parent, codec) {
            this.mediaSource = parent.mediaSource;
            this.players = parent.players;
            this.cleaning = false;
            this.parent = parent;
            this.queue = [];
            this.cleanResolvers = [];
            this.codec = codec;
            this.cleanRanges = [];

            Log$1.debug(`Use codec: ${codec}`);

            this.sourceBuffer = this.mediaSource.addSourceBuffer(codec);
            this.eventSource = new EventEmitter(this.sourceBuffer);

            this.eventSource.addEventListener('updatestart', (e) => {
                // this.updating = true;
                // Log.debug('update start');
                if (this.cleaning) {
                    Log$1.debug(`${this.codec} cleaning start`);
                }
            });

            this.eventSource.addEventListener('update', (e) => {
                // this.updating = true;
                if (this.cleaning) {
                    Log$1.debug(`${this.codec} cleaning update`);
                }
            });

            this.eventSource.addEventListener('updateend', (e) => {
                // Log.debug('update end');
                // this.updating = false;
                if (this.cleaning) {
                    Log$1.debug(`${this.codec} cleaning end`);

                    try {
                        if (this.sourceBuffer.buffered.length && this.players[0].currentTime < this.sourceBuffer.buffered.start(0)) {
                            this.players[0].currentTime = this.sourceBuffer.buffered.start(0);
                        }
                    } catch (e) {
                        // TODO: do something?
                    }
                    while (this.cleanResolvers.length) {
                        let resolver = this.cleanResolvers.shift();
                        resolver();
                    }
                    this.cleaning = false;

                    if (this.cleanRanges.length) {
                        this.doCleanup();
                        return;
                    }
                } else {
                    // Log.debug(`buffered: ${this.sourceBuffer.buffered.end(0)}, current ${this.players[0].currentTime}`);
                }
                this.feedNext();
            });

            this.eventSource.addEventListener('error', (e) => {
                Log$1.debug(`Source buffer error: ${this.mediaSource.readyState}`);
                if (this.mediaSource.sourceBuffers.length) {
                    this.mediaSource.removeSourceBuffer(this.sourceBuffer);
                }
                this.parent.eventSource.dispatchEvent('error');
            });

            this.eventSource.addEventListener('abort', (e) => {
                Log$1.debug(`Source buffer aborted: ${this.mediaSource.readyState}`);
                if (this.mediaSource.sourceBuffers.length) {
                    this.mediaSource.removeSourceBuffer(this.sourceBuffer);
                }
                this.parent.eventSource.dispatchEvent('error');
            });

            if (!this.sourceBuffer.updating) {
                this.feedNext();
            }
            // TODO: cleanup every hour for live streams
        }

        destroy() {
            this.eventSource.destroy();
            this.clear();
            this.queue = [];
            if (this.mediaSource.sourceBuffers.length > 0)
                this.mediaSource.removeSourceBuffer(this.sourceBuffer);
        }

        clear() {
            this.queue = [];
            let promises = [];

            if (!this.sourceBuffer.hasOwnProperty('buffered'))
                return promises;

            for (let i = 0; i < this.sourceBuffer.buffered.length; ++i) {
                // TODO: await remove
                this.cleaning = true;
                promises.push(new Promise((resolve, reject) => {
                    this.cleanResolvers.push(resolve);
                    if (!this.sourceBuffer.updating) {
                        this.sourceBuffer.remove(this.sourceBuffer.buffered.start(i), this.sourceBuffer.buffered.end(i));
                        resolve();
                    } else {
                        this.sourceBuffer.onupdateend = () => {
                            if (this.sourceBuffer) {
                                this.sourceBuffer.remove(this.sourceBuffer.buffered.start(i), this.sourceBuffer.buffered.end(i));
                            }
                            resolve();
                        };
                    }
                }));
            }
            return Promise.all(promises);
        }

        setLive(is_live) {
            this.is_live = is_live;
        }

        feedNext() {
            // Log.debug("feed next ", this.sourceBuffer.updating);
            if (!this.sourceBuffer.updating && !this.cleaning && this.queue.length) {
                this.doAppend(this.queue.shift());
                // TODO: if is live and current position > 1hr => clean all and restart
            }
        }

        doCleanup() {
            if (!this.cleanRanges.length) {
                this.cleaning = false;
                this.feedNext();
                return;
            }
            let range = this.cleanRanges.shift();
            Log$1.debug(`${this.codec} remove range [${range[0]} - ${range[1]}). 
                    \nUpdating: ${this.sourceBuffer.updating}
                    `);
            this.cleaning = true;
            this.sourceBuffer.remove(range[0], range[1]);
        }

        initCleanup() {
            if (this.sourceBuffer.buffered.length && !this.sourceBuffer.updating && !this.cleaning) {
                Log$1.debug(`${this.codec} cleanup`);
                let removeBound = this.sourceBuffer.buffered.end(this.sourceBuffer.buffered.length - 1) - 2;

                for (let i = 0; i < this.sourceBuffer.buffered.length; ++i) {
                    let removeStart = this.sourceBuffer.buffered.start(i);
                    let removeEnd = this.sourceBuffer.buffered.end(i);
                    if ((this.players[0].currentTime <= removeStart) || (removeBound <= removeStart)) continue;

                    if ((removeBound <= removeEnd) && (removeBound >= removeStart)) {
                        Log$1.debug(`Clear [${removeStart}, ${removeBound}), leave [${removeBound}, ${removeEnd}]`);
                        removeEnd = removeBound;
                        if (removeEnd != removeStart) {
                            this.cleanRanges.push([removeStart, removeEnd]);
                        }
                        continue; // Do not cleanup buffered range after current position
                    }
                    this.cleanRanges.push([removeStart, removeEnd]);
                }

                this.doCleanup();

                // let bufferStart = this.sourceBuffer.buffered.start(0);
                // let removeEnd = this.sourceBuffer.buffered.start(0) + (this.sourceBuffer.buffered.end(0) - this.sourceBuffer.buffered.start(0))/2;
                // if (this.players[0].currentTime < removeEnd) {
                //     this.players[0].currentTime = removeEnd;
                // }
                // let removeEnd = Math.max(this.players[0].currentTime - 3, this.sourceBuffer.buffered.end(0) - 3);
                //
                // if (removeEnd < bufferStart) {
                //     removeEnd = this.sourceBuffer.buffered.start(0) + (this.sourceBuffer.buffered.end(0) - this.sourceBuffer.buffered.start(0))/2;
                //     if (this.players[0].currentTime < removeEnd) {
                //         this.players[0].currentTime = removeEnd;
                //     }
                // }

                // if (removeEnd > bufferStart && (removeEnd - bufferStart > 0.5 )) {
                //     // try {
                //         Log.debug(`${this.codec} remove range [${bufferStart} - ${removeEnd}).
                //         \nBuffered end: ${this.sourceBuffer.buffered.end(0)}
                //         \nUpdating: ${this.sourceBuffer.updating}
                //         `);
                //         this.cleaning = true;
                //         this.sourceBuffer.remove(bufferStart, removeEnd);
                //     // } catch (e) {
                //     //     // TODO: implement
                //     //     Log.error(e);
                //     // }
                // } else {
                //     this.feedNext();
                // }
            } else {
                this.feedNext();
            }
        }

        doAppend(data) {
            // console.log(MP4Inspect.mp4toJSON(data));
            let err = this.players[0].error;
            if (err) {
                Log$1.error(`Error occured: ${MSE.ErrorNotes[err.code]}`);
                try {
                    this.players.forEach((video) => { video.stop(); });
                    this.mediaSource.endOfStream();
                } catch (e) {

                }
                this.parent.eventSource.dispatchEvent('error');
            } else {
                try {
                    this.sourceBuffer.appendBuffer(data);
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        Log$1.debug(`${this.codec} quota fail`);
                        this.queue.unshift(data);
                        this.initCleanup();
                        return;
                    }
                    else if (e.name === 'InvalidStateError') {
                        this.queue.unshift(data);
                        this.initCleanup();
                        this.players.forEach((video) => { video.play(); });
                        return;
                    }

                    // reconnect on fail
                    Log$1.error(`Error occured while appending buffer. ${e.name}: ${e.message}`);
                    this.parent.eventSource.dispatchEvent('error');
                }
            }

        }

        feed(data) {
            this.queue = this.queue.concat(data);

            // Log.debug(this.sourceBuffer.updating, this.updating, this.queue.length);
            if (this.sourceBuffer && !this.sourceBuffer.updating && !this.cleaning) {
                // Log.debug('enq feed');
                if (this.sourceBuffer.buffered && this.sourceBuffer.buffered.length && this.sourceBuffer.buffered.length > 0) {
                    //let h = this.sourceBuffer.buffered.start(0);
                    let t = this.sourceBuffer.buffered.end(0), s = t - this.players[0].currentTime;
                    if (2 < s || s < 0) {
                        //t -= 0.5;
                        //t = h > t ? h : t;
                        if (t > 0.5) {
                            this.sourceBuffer.remove(0, t - 0.5);
                            //this.mediaSource.endOfStream();
                            //this.players[0].currentTime = this.sourceBuffer.buffered.end(0) - 0.5;
                            //this.players[0].duration = 0;

                            this.cleaning = true;
                        }
                    }
                }
                this.feedNext();
            }
        }
    }

    class MSE {
        // static CODEC_AVC_BASELINE = "avc1.42E01E";
        // static CODEC_AVC_MAIN = "avc1.4D401E";
        // static CODEC_AVC_HIGH = "avc1.64001E";
        // static CODEC_VP8 = "vp8";
        // static CODEC_AAC = "mp4a.40.2";
        // static CODEC_VORBIS = "vorbis";
        // static CODEC_THEORA = "theora";

        static get ErrorNotes() {
            return {
                [MediaError.MEDIA_ERR_ABORTED]: 'fetching process aborted by user',
                [MediaError.MEDIA_ERR_NETWORK]: 'error occurred when downloading',
                [MediaError.MEDIA_ERR_DECODE]: 'error occurred when decoding',
                [MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED]: 'audio/video not supported'
            }
        };

        static isSupported(codecs) {
            return (window.MediaSource && window.MediaSource.isTypeSupported(`video/mp4; codecs="${codecs.join(',')}"`));
        }

        constructor(players) {
            this.players = players;
            const playing = this.players.map((video, idx) => {
                video.onplaying = function () {
                    playing[idx] = true;
                };
                video.onpause = function () {
                    playing[idx] = false;
                };
                return !video.paused;
            });
            this.playing = playing;
            this.mediaSource = new MediaSource();
            this.eventSource = new EventEmitter(this.mediaSource);
            this.reset();
        }

        destroy() {
            this.reset();
            this.eventSource.destroy();
            this.mediaSource = null;
            this.eventSource = null;
        }

        play() {
            this.players.forEach((video, idx) => {
                if (video.paused && !this.playing[idx]) {
                    Log$1.debug(`player ${idx}: play`);
                    video.play();
                }
            });
        }

        setLive(is_live) {
            for (let idx in this.buffers) {
                this.buffers[idx].setLive(is_live);
            }
            this.is_live = is_live;
        }

        resetBuffers() {
            this.players.forEach((video, idx) => {
                if (!video.paused && this.playing[idx]) {
                    video.pause();
                    video.currentTime = 0;
                }
            });

            let promises = [];
            for (let buffer of this.buffers.values()) {
                promises.push(buffer.clear());
            }
            return Promise.all(promises).then(() => {
                this.mediaSource.endOfStream();
                this.mediaSource.duration = 0;
                this.mediaSource.clearLiveSeekableRange();
                this.play();
            });
        }

        clear() {
            this.reset();
            this.players.forEach((video) => { video.src = URL.createObjectURL(this.mediaSource);});

            return this.setupEvents();
        }

        setupEvents() {
            this.eventSource.clear();
            this.resolved = false;
            this.mediaReady = new Promise((resolve, reject) => {
                this._sourceOpen = () => {
                    Log$1.debug(`Media source opened: ${this.mediaSource.readyState}`);
                    if (!this.resolved) {
                        this.resolved = true;
                        resolve();
                    }
                };
                this._sourceEnded = () => {
                    Log$1.debug(`Media source ended: ${this.mediaSource.readyState}`);
                };
                this._sourceClose = () => {
                    Log$1.debug(`Media source closed: ${this.mediaSource.readyState}`);
                    if (this.resolved) {
                        this.eventSource.dispatchEvent('sourceclosed');
                    }
                };
                this.eventSource.addEventListener('sourceopen', this._sourceOpen);
                this.eventSource.addEventListener('sourceended', this._sourceEnded);
                this.eventSource.addEventListener('sourceclose', this._sourceClose);
            });
            return this.mediaReady;
        }

        reset() {
            this.ready = false;
            for (let track in this.buffers) {
                this.buffers[track].destroy();
                delete this.buffers[track];
            }
            if (this.mediaSource.readyState == 'open') {
                this.mediaSource.duration = 0;
                this.mediaSource.endOfStream();
            }
            this.updating = false;
            this.resolved = false;
            this.buffers = {};
            // this.players.forEach((video)=>{video.src = URL.createObjectURL(this.mediaSource)});
            // TODO: remove event listeners for existing media source
            // this.setupEvents();
            // this.clear();
        }

        setCodec(track, mimeCodec) {
            return this.mediaReady.then(() => {
                this.buffers[track] = new MSEBuffer(this, mimeCodec);
                this.buffers[track].setLive(this.is_live);
            });
        }

        feed(track, data) {
            if (this.buffers[track]) {
                this.buffers[track].feed(data);
            }
        }
    }

    const Log$2 = getTagged('remuxer:base');
    let track_id = 1;
    class BaseRemuxer {

        static get MP4_TIMESCALE() { return 90000; }

        // TODO: move to ts parser
        // static PTSNormalize(value, reference) {
        //
        //     let offset;
        //     if (reference === undefined) {
        //         return value;
        //     }
        //     if (reference < value) {
        //         // - 2^33
        //         offset = -8589934592;
        //     } else {
        //         // + 2^33
        //         offset = 8589934592;
        //     }
        //     /* PTS is 33bit (from 0 to 2^33 -1)
        //      if diff between value and reference is bigger than half of the amplitude (2^32) then it means that
        //      PTS looping occured. fill the gap */
        //     while (Math.abs(value - reference) > 4294967296) {
        //         value += offset;
        //     }
        //     return value;
        // }

        static getTrackID() {
            return track_id++;
        }

        constructor(timescale, scaleFactor, params) {
            this.timeOffset = 0;
            this.timescale = timescale;
            this.scaleFactor = scaleFactor;
            this.readyToDecode = false;
            this.samples = [];
            this.seq = 1;
            this.tsAlign = 1;
        }

        scaled(timestamp) {
            return timestamp / this.scaleFactor;
        }

        unscaled(timestamp) {
            return timestamp * this.scaleFactor;
        }

        remux(unit) {
            if (unit) {
                this.samples.push({
                    unit: unit,
                    pts: unit.pts,
                    dts: unit.dts
                });
                return true;
            }
            return false;
        }

        static toMS(timestamp) {
            return timestamp / 90;
        }

        setConfig(config) {

        }

        insertDscontinuity() {
            this.samples.push(null);
        }

        init(initPTS, initDTS, shouldInitialize = true) {
            this.initPTS = Math.min(initPTS, this.samples[0].dts /*- this.unscaled(this.timeOffset)*/);
            this.initDTS = Math.min(initDTS, this.samples[0].dts /*- this.unscaled(this.timeOffset)*/);
            Log$2.debug(`Initial pts=${this.initPTS} dts=${this.initDTS} offset=${this.unscaled(this.timeOffset)}`);
            this.initialized = shouldInitialize;
        }

        flush() {
            this.seq++;
            this.mp4track.len = 0;
            this.mp4track.samples = [];
        }

        static dtsSortFunc(a, b) {
            return (a.dts - b.dts);
        }

        getPayloadBase(sampleFunction, setupSample) {
            if (!this.readyToDecode || !this.initialized || !this.samples.length) return null;
            this.samples.sort(BaseRemuxer.dtsSortFunc);
            return true;
            //
            // let payload = new Uint8Array(this.mp4track.len);
            // let offset = 0;
            // let samples=this.mp4track.samples;
            // let mp4Sample, lastDTS, pts, dts;
            //
            // while (this.samples.length) {
            //     let sample = this.samples.shift();
            //     if (sample === null) {
            //         // discontinuity
            //         this.nextDts = undefined;
            //         break;
            //     }
            //
            //     let unit = sample.unit;
            //
            //     pts = Math.round((sample.pts - this.initDTS)/this.tsAlign)*this.tsAlign;
            //     dts = Math.round((sample.dts - this.initDTS)/this.tsAlign)*this.tsAlign;
            //     // ensure DTS is not bigger than PTS
            //     dts = Math.min(pts, dts);
            //
            //     // sampleFunction(pts, dts);   // TODO:
            //
            //     // mp4Sample = setupSample(unit, pts, dts);    // TODO:
            //
            //     payload.set(unit.getData(), offset);
            //     offset += unit.getSize();
            //
            //     samples.push(mp4Sample);
            //     lastDTS = dts;
            // }
            // if (!samples.length) return null;
            //
            // // samplesPostFunction(samples); // TODO:
            //
            // return new Uint8Array(payload.buffer, 0, this.mp4track.len);
        }
    }

    const Log$3 = getTagged("remuxer:aac");
    // TODO: asm.js
    class AACRemuxer extends BaseRemuxer {

        constructor(timescale, scaleFactor = 1, params = {}) {
            super(timescale, scaleFactor);

            this.codecstring = MSE.CODEC_AAC;
            this.units = [];
            this.initDTS = undefined;
            this.nextAacPts = undefined;
            this.lastPts = 0;
            this.firstDTS = 0;
            this.firstPTS = 0;
            this.duration = params.duration || 1;
            this.initialized = false;

            this.mp4track = {
                id: BaseRemuxer.getTrackID(),
                type: 'audio',
                fragmented: true,
                channelCount: 0,
                audiosamplerate: this.timescale,
                duration: 0,
                timescale: this.timescale,
                volume: 1,
                samples: [],
                config: '',
                len: 0
            };
            if (params.config) {
                this.setConfig(params.config);
            }
        }

        setConfig(config) {
            this.mp4track.channelCount = config.channels;
            this.mp4track.audiosamplerate = config.samplerate;
            if (!this.mp4track.duration) {
                this.mp4track.duration = (this.duration ? this.duration : 0) * config.samplerate;
            }
            this.mp4track.timescale = config.samplerate;
            this.mp4track.config = config.config;
            this.mp4track.codec = config.codec;
            this.timescale = config.samplerate;
            this.scaleFactor = BaseRemuxer.MP4_TIMESCALE / config.samplerate;
            this.expectedSampleDuration = 1024 * this.scaleFactor;
            this.readyToDecode = true;
        }

        remux(aac) {
            if (super.remux.call(this, aac)) {
                this.mp4track.len += aac.getSize();
            }
        }

        getPayload() {
            if (!this.readyToDecode || !this.samples.length) return null;
            this.samples.sort(function (a, b) {
                return (a.dts - b.dts);
            });

            let payload = new Uint8Array(this.mp4track.len);
            let offset = 0;
            let samples = this.mp4track.samples;
            let mp4Sample, lastDTS, pts, dts;

            while (this.samples.length) {
                let sample = this.samples.shift();
                if (sample === null) {
                    // discontinuity
                    this.nextDts = undefined;
                    break;
                }
                let unit = sample.unit;
                pts = sample.pts - this.initDTS;
                dts = sample.dts - this.initDTS;

                if (lastDTS === undefined) {
                    if (this.nextDts) {
                        let delta = Math.round(this.scaled(pts - this.nextAacPts));
                        // if fragment are contiguous, or delta less than 600ms, ensure there is no overlap/hole between fragments
                        if (/*contiguous || */Math.abs(delta) < 600) {
                            // log delta
                            if (delta) {
                                if (delta > 0) {
                                    Log$3.log(`${delta} ms hole between AAC samples detected,filling it`);
                                    // if we have frame overlap, overlapping for more than half a frame duraion
                                } else if (delta < -12) {
                                    // drop overlapping audio frames... browser will deal with it
                                    Log$3.log(`${(-delta)} ms overlapping between AAC samples detected, drop frame`);
                                    this.mp4track.len -= unit.getSize();
                                    continue;
                                }
                                // set DTS to next DTS
                                pts = dts = this.nextAacPts;
                            }
                        }
                    }
                    // remember first PTS of our aacSamples, ensure value is positive
                    this.firstDTS = Math.max(0, dts);
                }

                mp4Sample = {
                    size: unit.getSize(),
                    cts: 0,
                    duration: 1024,
                    flags: {
                        isLeading: 0,
                        isDependedOn: 0,
                        hasRedundancy: 0,
                        degradPrio: 0,
                        dependsOn: 1
                    }
                };

                payload.set(unit.getData(), offset);
                offset += unit.getSize();
                samples.push(mp4Sample);
                lastDTS = dts;
            }
            if (!samples.length) return null;
            this.nextDts = pts + this.expectedSampleDuration;
            return new Uint8Array(payload.buffer, 0, this.mp4track.len);
        }
    }
    //test.bundle.js:42 [remuxer:h264] skip frame from the past at DTS=18397972271140676 with expected DTS=18397998040950484

    /**
     * Parser for exponential Golomb codes, a variable-bitwidth number encoding scheme used by h264.
    */
    // TODO: asm.js
    class ExpGolomb {

        constructor(data) {
            this.data = data;
            // the number of bytes left to examine in this.data
            this.bytesAvailable = this.data.byteLength;
            // the current word being examined
            this.word = 0; // :uint
            // the number of bits left to examine in the current word
            this.bitsAvailable = 0; // :uint
        }

        // ():void
        loadWord() {
            var
                position = this.data.byteLength - this.bytesAvailable,
                workingBytes = new Uint8Array(4),
                availableBytes = Math.min(4, this.bytesAvailable);
            if (availableBytes === 0) {
                throw new Error('no bytes available');
            }
            workingBytes.set(this.data.subarray(position, position + availableBytes));
            this.word = new DataView(workingBytes.buffer, workingBytes.byteOffset, workingBytes.byteLength).getUint32(0);
            // track the amount of this.data that has been processed
            this.bitsAvailable = availableBytes * 8;
            this.bytesAvailable -= availableBytes;
        }

        // (count:int):void
        skipBits(count) {
            var skipBytes; // :int
            if (this.bitsAvailable > count) {
                this.word <<= count;
                this.bitsAvailable -= count;
            } else {
                count -= this.bitsAvailable;
                skipBytes = count >> 3;
                count -= (skipBytes << 3);
                this.bytesAvailable -= skipBytes;
                this.loadWord();
                this.word <<= count;
                this.bitsAvailable -= count;
            }
        }

        // (size:int):uint
        readBits(size) {
            var
                bits = Math.min(this.bitsAvailable, size), // :uint
                valu = this.word >>> (32 - bits); // :uint
            if (size > 32) {
                Log.error('Cannot read more than 32 bits at a time');
            }
            this.bitsAvailable -= bits;
            if (this.bitsAvailable > 0) {
                this.word <<= bits;
            } else if (this.bytesAvailable > 0) {
                this.loadWord();
            }
            bits = size - bits;
            if (bits > 0) {
                return valu << bits | this.readBits(bits);
            } else {
                return valu;
            }
        }

        // ():uint
        skipLZ() {
            var leadingZeroCount; // :uint
            for (leadingZeroCount = 0; leadingZeroCount < this.bitsAvailable; ++leadingZeroCount) {
                if (0 !== (this.word & (0x80000000 >>> leadingZeroCount))) {
                    // the first bit of working word is 1
                    this.word <<= leadingZeroCount;
                    this.bitsAvailable -= leadingZeroCount;
                    return leadingZeroCount;
                }
            }
            // we exhausted word and still have not found a 1
            this.loadWord();
            return leadingZeroCount + this.skipLZ();
        }

        // ():void
        skipUEG() {
            this.skipBits(1 + this.skipLZ());
        }

        // ():void
        skipEG() {
            this.skipBits(1 + this.skipLZ());
        }

        // ():uint
        readUEG() {
            var clz = this.skipLZ(); // :uint
            return this.readBits(clz + 1) - 1;
        }

        // ():int
        readEG() {
            var valu = this.readUEG(); // :int
            if (0x01 & valu) {
                // the number is odd if the low order bit is set
                return (1 + valu) >>> 1; // add 1 to make it even, and divide by 2
            } else {
                return -1 * (valu >>> 1); // divide by two then make it negative
            }
        }

        // Some convenience functions
        // :Boolean
        readBoolean() {
            return 1 === this.readBits(1);
        }

        // ():int
        readUByte() {
            return this.readBits(8);
        }

        // ():int
        readUShort() {
            return this.readBits(16);
        }
        // ():int
        readUInt() {
            return this.readBits(32);
        }
    }

    // TODO: asm.js
    function appendByteArray(buffer1, buffer2) {
        let tmp = new Uint8Array((buffer1.byteLength | 0) + (buffer2.byteLength | 0));
        tmp.set(buffer1, 0);
        tmp.set(buffer2, buffer1.byteLength | 0);
        return tmp;
    }

    function base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    function hexToByteArray(hex) {
        let len = hex.length >> 1;
        var bufView = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bufView[i] = parseInt(hex.substr(i << 1, 2), 16);
        }
        return bufView;
    }

    function bitSlice(bytearray, start = 0, end = bytearray.byteLength * 8) {
        let byteLen = Math.ceil((end - start) / 8);
        let res = new Uint8Array(byteLen);
        let startByte = start >>> 3;   // /8
        let endByte = (end >>> 3) - 1;    // /8
        let bitOffset = start & 0x7;     // %8
        let nBitOffset = 8 - bitOffset;
        let endOffset = 8 - end & 0x7;   // %8
        for (let i = 0; i < byteLen; ++i) {
            let tail = 0;
            if (i < endByte) {
                tail = bytearray[startByte + i + 1] >> nBitOffset;
                if (i == endByte - 1 && endOffset < 8) {
                    tail >>= endOffset;
                    tail <<= endOffset;
                }
            }
            res[i] = (bytearray[startByte + i] << bitOffset) | tail;
        }
        return res;
    }

    class BitArray {

        constructor(src) {
            this.src = new DataView(src.buffer, src.byteOffset, src.byteLength);
            this.bitpos = 0;
            this.byte = this.src.getUint8(0); /* This should really be undefined, uint wont allow it though */
            this.bytepos = 0;
        }

        readBits(length) {
            if (32 < (length | 0) || 0 === (length | 0)) {
                /* To big for an uint */
                throw new Error("too big");
            }

            let result = 0;
            for (let i = length; i > 0; --i) {

                /* Shift result one left to make room for another bit,
                 then add the next bit on the stream. */
                result = ((result | 0) << 1) | (((this.byte | 0) >> (8 - (++this.bitpos))) & 0x01);
                if ((this.bitpos | 0) >= 8) {
                    this.byte = this.src.getUint8(++this.bytepos);
                    this.bitpos &= 0x7;
                }
            }

            return result;
        }
        skipBits(length) {
            this.bitpos += (length | 0) & 0x7; // %8
            this.bytepos += (length | 0) >>> 3;  // *8
            if (this.bitpos > 7) {
                this.bitpos &= 0x7;
                ++this.bytepos;
            }

            if (!this.finished()) {
                this.byte = this.src.getUint8(this.bytepos);
                return 0;
            } else {
                return this.bytepos - this.src.byteLength - this.src.bitpos;
            }
        }

        finished() {
            return this.bytepos >= this.src.byteLength;
        }
    }

    class NALU {

        static get NDR() { return 1; }
        static get SLICE_PART_A() { return 2; }
        static get SLICE_PART_B() { return 3; }
        static get SLICE_PART_C() { return 4; }
        static get IDR() { return 5; }
        static get SEI() { return 6; }
        static get SPS() { return 7; }
        static get PPS() { return 8; }
        static get DELIMITER() { return 9; }
        static get EOSEQ() { return 10; }
        static get EOSTR() { return 11; }
        static get FILTER() { return 12; }
        static get STAP_A() { return 24; }
        static get STAP_B() { return 25; }
        static get FU_A() { return 28; }
        static get FU_B() { return 29; }

        static get TYPES() {
            return {
                [NALU.IDR]: 'IDR',
                [NALU.SEI]: 'SEI',
                [NALU.SPS]: 'SPS',
                [NALU.PPS]: 'PPS',
                [NALU.NDR]: 'NDR'
            }
        };

        static type(nalu) {
            if (nalu.ntype in NALU.TYPES) {
                return NALU.TYPES[nalu.ntype];
            } else {
                return 'UNKNOWN';
            }
        }

        constructor(ntype, nri, data, dts, pts) {

            this.data = data;
            this.ntype = ntype;
            this.nri = nri;
            this.dts = dts;
            this.pts = pts ? pts : this.dts;
            this.sliceType = null;
        }

        appendData(idata) {
            this.data = appendByteArray(this.data, idata);
        }

        toString() {
            return `${NALU.type(this)}(${this.data.byteLength}): NRI: ${this.getNri()}, PTS: ${this.pts}, DTS: ${this.dts}`;
        }

        getNri() {
            return this.nri >> 5;
        }

        type() {
            return this.ntype;
        }

        isKeyframe() {
            return this.ntype === NALU.IDR || this.sliceType === 7;
        }

        getSize() {
            return 4 + 1 + this.data.byteLength;
        }

        getData() {
            let header = new Uint8Array(5 + this.data.byteLength);
            let view = new DataView(header.buffer);
            view.setUint32(0, this.data.byteLength + 1);
            view.setUint8(4, (0x0 & 0x80) | (this.nri & 0x60) | (this.ntype & 0x1F));
            header.set(this.data, 5);
            return header;
        }
    }

    class H264Parser {

        constructor(remuxer) {
            this.remuxer = remuxer;
            this.track = remuxer.mp4track;
            this.firstFound = false;
        }

        msToScaled(timestamp) {
            return (timestamp - this.remuxer.timeOffset) * this.remuxer.scaleFactor;
        }

        parseSPS(sps) {
            var config = H264Parser.readSPS(new Uint8Array(sps));

            this.track.width = config.width;
            this.track.height = config.height;
            this.track.sps = [new Uint8Array(sps)];
            // this.track.timescale = this.remuxer.timescale;
            // this.track.duration = this.remuxer.timescale; // TODO: extract duration for non-live client
            this.track.codec = 'avc1.';

            let codecarray = new DataView(sps.buffer, sps.byteOffset + 1, 4);
            for (let i = 0; i < 3; ++i) {
                var h = codecarray.getUint8(i).toString(16);
                if (h.length < 2) {
                    h = '0' + h;
                }
                this.track.codec += h;
            }
        }

        parsePPS(pps) {
            this.track.pps = [new Uint8Array(pps)];
        }

        parseNAL(unit) {
            if (!unit) return false;

            let push = null;
            // console.log(unit.toString());
            switch (unit.type()) {
                case NALU.NDR:
                case NALU.IDR:
                    unit.sliceType = H264Parser.parceSliceHeader(unit.data);
                    if (unit.isKeyframe() && !this.firstFound) {
                        this.firstFound = true;
                    }
                    if (this.firstFound) {
                        push = true;
                    } else {
                        push = false;
                    }
                    break;
                case NALU.PPS:
                    push = false;
                    if (!this.track.pps) {
                        this.parsePPS(unit.getData().subarray(4));
                        if (!this.remuxer.readyToDecode && this.track.pps && this.track.sps) {
                            this.remuxer.readyToDecode = true;
                        }
                    }
                    break;
                case NALU.SPS:
                    push = false;
                    if (!this.track.sps) {
                        this.parseSPS(unit.getData().subarray(4));
                        if (!this.remuxer.readyToDecode && this.track.pps && this.track.sps) {
                            this.remuxer.readyToDecode = true;
                        }
                    }
                    break;
                case NALU.SEI:
                    push = false;
                    let data = new DataView(unit.data.buffer, unit.data.byteOffset, unit.data.byteLength);
                    let byte_idx = 0;
                    let pay_type = data.getUint8(byte_idx);
                    ++byte_idx;
                    let pay_size = 0;
                    let sz = data.getUint8(byte_idx);
                    ++byte_idx;
                    while (sz === 255) {
                        pay_size += sz;
                        sz = data.getUint8(byte_idx);
                        ++byte_idx;
                    }
                    pay_size += sz;

                    let uuid = unit.data.subarray(byte_idx, byte_idx + 16);
                    byte_idx += 16;
                    //console.log(`PT: ${pay_type}, PS: ${pay_size}, UUID: ${Array.from(uuid).map(function (i) {
                    //    return ('0' + i.toString(16)).slice(-2);
                    //}).join('')}`);
                    // debugger;
                    break;
                case NALU.EOSEQ:
                case NALU.EOSTR:
                    push = false;
                default:
            }
            if (push === null && unit.getNri() > 0) {
                push = true;
            }
            return push;
        }

        static parceSliceHeader(data) {
            let decoder = new ExpGolomb(data);
            let first_mb = decoder.readUEG();
            let slice_type = decoder.readUEG();
            let ppsid = decoder.readUEG();
            let frame_num = decoder.readUByte();
            // console.log(`first_mb: ${first_mb}, slice_type: ${slice_type}, ppsid: ${ppsid}, frame_num: ${frame_num}`);
            return slice_type;
        }

        /**
         * Advance the ExpGolomb decoder past a scaling list. The scaling
         * list is optionally transmitted as part of a sequence parameter
         * set and is not relevant to transmuxing.
         * @param decoder {ExpGolomb} exp golomb decoder
         * @param count {number} the number of entries in this scaling list
         * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
         */
        static skipScalingList(decoder, count) {
            let lastScale = 8,
                nextScale = 8,
                deltaScale;
            for (let j = 0; j < count; j++) {
                if (nextScale !== 0) {
                    deltaScale = decoder.readEG();
                    nextScale = (lastScale + deltaScale + 256) % 256;
                }
                lastScale = (nextScale === 0) ? lastScale : nextScale;
            }
        }

        /**
         * Read a sequence parameter set and return some interesting video
         * properties. A sequence parameter set is the H264 metadata that
         * describes the properties of upcoming video frames.
         * @param data {Uint8Array} the bytes of a sequence parameter set
         * @return {object} an object with configuration parsed from the
         * sequence parameter set, including the dimensions of the
         * associated video frames.
         */
        static readSPS(data) {
            let decoder = new ExpGolomb(data);
            let frameCropLeftOffset = 0,
                frameCropRightOffset = 0,
                frameCropTopOffset = 0,
                frameCropBottomOffset = 0,
                sarScale = 1,
                profileIdc, profileCompat, levelIdc,
                numRefFramesInPicOrderCntCycle, picWidthInMbsMinus1,
                picHeightInMapUnitsMinus1,
                frameMbsOnlyFlag,
                scalingListCount;
            decoder.readUByte();
            profileIdc = decoder.readUByte(); // profile_idc
            profileCompat = decoder.readBits(5); // constraint_set[0-4]_flag, u(5)
            decoder.skipBits(3); // reserved_zero_3bits u(3),
            levelIdc = decoder.readUByte(); //level_idc u(8)
            decoder.skipUEG(); // seq_parameter_set_id
            // some profiles have more optional data we don't need
            if (profileIdc === 100 ||
                profileIdc === 110 ||
                profileIdc === 122 ||
                profileIdc === 244 ||
                profileIdc === 44 ||
                profileIdc === 83 ||
                profileIdc === 86 ||
                profileIdc === 118 ||
                profileIdc === 128) {
                var chromaFormatIdc = decoder.readUEG();
                if (chromaFormatIdc === 3) {
                    decoder.skipBits(1); // separate_colour_plane_flag
                }
                decoder.skipUEG(); // bit_depth_luma_minus8
                decoder.skipUEG(); // bit_depth_chroma_minus8
                decoder.skipBits(1); // qpprime_y_zero_transform_bypass_flag
                if (decoder.readBoolean()) { // seq_scaling_matrix_present_flag
                    scalingListCount = (chromaFormatIdc !== 3) ? 8 : 12;
                    for (let i = 0; i < scalingListCount; ++i) {
                        if (decoder.readBoolean()) { // seq_scaling_list_present_flag[ i ]
                            if (i < 6) {
                                H264Parser.skipScalingList(decoder, 16);
                            } else {
                                H264Parser.skipScalingList(decoder, 64);
                            }
                        }
                    }
                }
            }
            decoder.skipUEG(); // log2_max_frame_num_minus4
            var picOrderCntType = decoder.readUEG();
            if (picOrderCntType === 0) {
                decoder.readUEG(); //log2_max_pic_order_cnt_lsb_minus4
            } else if (picOrderCntType === 1) {
                decoder.skipBits(1); // delta_pic_order_always_zero_flag
                decoder.skipEG(); // offset_for_non_ref_pic
                decoder.skipEG(); // offset_for_top_to_bottom_field
                numRefFramesInPicOrderCntCycle = decoder.readUEG();
                for (let i = 0; i < numRefFramesInPicOrderCntCycle; ++i) {
                    decoder.skipEG(); // offset_for_ref_frame[ i ]
                }
            }
            decoder.skipUEG(); // max_num_ref_frames
            decoder.skipBits(1); // gaps_in_frame_num_value_allowed_flag
            picWidthInMbsMinus1 = decoder.readUEG();
            picHeightInMapUnitsMinus1 = decoder.readUEG();
            frameMbsOnlyFlag = decoder.readBits(1);
            if (frameMbsOnlyFlag === 0) {
                decoder.skipBits(1); // mb_adaptive_frame_field_flag
            }
            decoder.skipBits(1); // direct_8x8_inference_flag
            if (decoder.readBoolean()) { // frame_cropping_flag
                frameCropLeftOffset = decoder.readUEG();
                frameCropRightOffset = decoder.readUEG();
                frameCropTopOffset = decoder.readUEG();
                frameCropBottomOffset = decoder.readUEG();
            }
            if (decoder.readBoolean()) {
                // vui_parameters_present_flag
                if (decoder.readBoolean()) {
                    // aspect_ratio_info_present_flag
                    let sarRatio;
                    const aspectRatioIdc = decoder.readUByte();
                    switch (aspectRatioIdc) {
                        case 1: sarRatio = [1, 1]; break;
                        case 2: sarRatio = [12, 11]; break;
                        case 3: sarRatio = [10, 11]; break;
                        case 4: sarRatio = [16, 11]; break;
                        case 5: sarRatio = [40, 33]; break;
                        case 6: sarRatio = [24, 11]; break;
                        case 7: sarRatio = [20, 11]; break;
                        case 8: sarRatio = [32, 11]; break;
                        case 9: sarRatio = [80, 33]; break;
                        case 10: sarRatio = [18, 11]; break;
                        case 11: sarRatio = [15, 11]; break;
                        case 12: sarRatio = [64, 33]; break;
                        case 13: sarRatio = [160, 99]; break;
                        case 14: sarRatio = [4, 3]; break;
                        case 15: sarRatio = [3, 2]; break;
                        case 16: sarRatio = [2, 1]; break;
                        case 255: {
                            sarRatio = [decoder.readUByte() << 8 | decoder.readUByte(), decoder.readUByte() << 8 | decoder.readUByte()];
                            break;
                        }
                    }
                    if (sarRatio) {
                        sarScale = sarRatio[0] / sarRatio[1];
                    }
                }
                if (decoder.readBoolean()) { decoder.skipBits(1); }

                if (decoder.readBoolean()) {
                    decoder.skipBits(4);
                    if (decoder.readBoolean()) {
                        decoder.skipBits(24);
                    }
                }
                if (decoder.readBoolean()) {
                    decoder.skipUEG();
                    decoder.skipUEG();
                }
                if (decoder.readBoolean()) {
                    let unitsInTick = decoder.readUInt();
                    let timeScale = decoder.readUInt();
                    let fixedFrameRate = decoder.readBoolean();
                    let frameDuration = timeScale / (2 * unitsInTick);
                    console.log(`timescale: ${timeScale}; unitsInTick: ${unitsInTick}; fixedFramerate: ${fixedFrameRate}; avgFrameDuration: ${frameDuration}`);
                }
            }
            return {
                width: Math.ceil((((picWidthInMbsMinus1 + 1) * 16) - frameCropLeftOffset * 2 - frameCropRightOffset * 2) * sarScale),
                height: ((2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16) - ((frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset))
            };
        }

        static readSliceType(decoder) {
            // skip NALu type
            decoder.readUByte();
            // discard first_mb_in_slice
            decoder.readUEG();
            // return slice_type
            return decoder.readUEG();
        }
    }

    const Log$4 = getTagged("remuxer:h264");
    // TODO: asm.js
    class H264Remuxer extends BaseRemuxer {

        constructor(timescale, scaleFactor = 1, params = {}) {
            super(timescale, scaleFactor);

            this.nextDts = undefined;
            this.readyToDecode = false;
            this.initialized = false;

            this.firstDTS = 0;
            this.firstPTS = 0;
            this.lastDTS = undefined;
            this.lastSampleDuration = 0;
            this.lastDurations = [];
            // this.timescale = 90000;
            this.tsAlign = Math.round(this.timescale / 60);

            this.mp4track = {
                id: BaseRemuxer.getTrackID(),
                type: 'video',
                len: 0,
                fragmented: true,
                sps: '',
                pps: '',
                width: 0,
                height: 0,
                timescale: timescale,
                duration: timescale,
                samples: []
            };
            this.samples = [];
            this.lastGopDTS = -99999999999999;
            this.gop = [];
            this.firstUnit = true;

            this.h264 = new H264Parser(this);

            if (params.sps) {
                let arr = new Uint8Array(params.sps);
                if ((arr[0] & 0x1f) === 7) {
                    this.setSPS(arr);
                } else {
                    Log$4.warn("bad SPS in SDP");
                }
            }
            if (params.pps) {
                let arr = new Uint8Array(params.pps);
                if ((arr[0] & 0x1f) === 8) {
                    this.setPPS(arr);
                } else {
                    Log$4.warn("bad PPS in SDP");
                }
            }

            if (this.mp4track.pps && this.mp4track.sps) {
                this.readyToDecode = true;
            }
        }

        _scaled(timestamp) {
            return timestamp >>> this.scaleFactor;
        }

        _unscaled(timestamp) {
            return timestamp << this.scaleFactor;
        }

        setSPS(sps) {
            this.h264.parseSPS(sps);
        }

        setPPS(pps) {
            this.h264.parsePPS(pps);
        }

        remux(nalu) {
            if (this.lastGopDTS < nalu.dts) {
                this.gop.sort(BaseRemuxer.dtsSortFunc);
                for (let unit of this.gop) {
                    // if (this.firstUnit) {
                    //     unit.ntype = 5;//NALU.IDR;
                    //     this.firstUnit = false;
                    // }
                    if (super.remux.call(this, unit)) {
                        this.mp4track.len += unit.getSize();
                    }
                }
                this.gop = [];
                this.lastGopDTS = nalu.dts;
            }
            if (this.h264.parseNAL(nalu)) {
                this.gop.push(nalu);
            }
        }

        getPayload() {
            if (!this.getPayloadBase()) {
                return null;
            }

            let payload = new Uint8Array(this.mp4track.len);
            let offset = 0;
            let samples = this.mp4track.samples;
            let mp4Sample, lastDTS, pts, dts;


            // Log.debug(this.samples.map((e)=>{
            //     return Math.round((e.dts - this.initDTS));
            // }));

            // let minDuration = Number.MAX_SAFE_INTEGER;
            while (this.samples.length) {
                let sample = this.samples.shift();
                if (sample === null) {
                    // discontinuity
                    this.nextDts = undefined;
                    break;
                }

                let unit = sample.unit;

                pts = sample.pts - this.initDTS; // /*Math.round(*/(sample.pts - this.initDTS)/*/this.tsAlign)*this.tsAlign*/;
                dts = sample.dts - this.initDTS; ///*Math.round(*/(sample.dts - this.initDTS)/*/this.tsAlign)*this.tsAlign*/;
                // ensure DTS is not bigger than PTS
                dts = Math.min(pts, dts);
                // if not first AVC sample of video track, normalize PTS/DTS with previous sample value
                // and ensure that sample duration is positive
                if (lastDTS !== undefined) {
                    let sampleDuration = this.scaled(dts - lastDTS);
                    // Log.debug(`Sample duration: ${sampleDuration}`);
                    //�ȹ۲쿴��û��bug�����ע�ͻؿ�������û�������
                    //if (sampleDuration < 0) {
                    //    Log$4.log(`invalid AVC sample duration at PTS/DTS: ${pts}/${dts}|lastDTS: ${lastDTS}:${sampleDuration}`);
                    //    //this.mp4track.len -= unit.getSize();
                    //    sampleDuration = 0;
                    //    //continue;
                    //}
                    // minDuration = Math.min(sampleDuration, minDuration);
                    if (sampleDuration < 0) {
                        lastDTS = dts;
                        sampleDuration = 0;
                    }
                    this.lastDurations.push(sampleDuration);
                    if (this.lastDurations.length > 100) {
                        this.lastDurations.shift();
                    }
                    mp4Sample.duration = sampleDuration;
                } else {
                    if (this.nextDts) {
                        let delta = dts - this.nextDts;
                        // if fragment are contiguous, or delta less than 600ms, ensure there is no overlap/hole between fragments
                        if (/*contiguous ||*/ Math.abs(Math.round(BaseRemuxer.toMS(delta))) < 600) {

                            if (delta) {
                                // set DTS to next DTS
                                // Log.debug(`Video/PTS/DTS adjusted: ${pts}->${Math.max(pts - delta, this.nextDts)}/${dts}->${this.nextDts},delta:${delta}`);
                                dts = this.nextDts;
                                // offset PTS as well, ensure that PTS is smaller or equal than new DTS
                                pts = Math.max(pts - delta, dts);
                            }
                        } else {
                            if (delta < 0) {
                                Log$4.log(`skip frame from the past at DTS=${dts} with expected DTS=${this.nextDts}`);
                                this.mp4track.len -= unit.getSize();
                                continue;
                            }
                        }
                    }
                    // remember first DTS of our avcSamples, ensure value is positive
                    this.firstDTS = Math.max(0, dts);
                }

                mp4Sample = {
                    size: unit.getSize(),
                    duration: 0,
                    cts: this.scaled(pts - dts),
                    flags: {
                        isLeading: 0,
                        isDependedOn: 0,
                        hasRedundancy: 0,
                        degradPrio: 0
                    }
                };
                let flags = mp4Sample.flags;
                if (sample.unit.isKeyframe() === true) {
                    // the current sample is a key frame
                    flags.dependsOn = 2;
                    flags.isNonSync = 0;
                } else {
                    flags.dependsOn = 1;
                    flags.isNonSync = 1;
                }

                payload.set(unit.getData(), offset);
                offset += unit.getSize();

                samples.push(mp4Sample);
                lastDTS = dts;
            }

            if (!samples.length) return null;

            let avgDuration = this.lastDurations.reduce(function (a, b) { return (a | 0) + (b | 0); }, 0) / (this.lastDurations.length || 1) | 1;
            if (samples.length >= 2) {
                this.lastSampleDuration = avgDuration;
                mp4Sample.duration = avgDuration;
            } else {
                mp4Sample.duration = this.lastSampleDuration;
            }

            if (samples.length && (!this.nextDts || navigator.userAgent.toLowerCase().indexOf('chrome') > -1)) {
                let flags = samples[0].flags;
                // chrome workaround, mark first sample as being a Random Access Point to avoid sourcebuffer append issue
                // https://code.google.com/p/chromium/issues/detail?id=229412
                flags.dependsOn = 2;
                flags.isNonSync = 0;
            }

            // next AVC sample DTS should be equal to last sample DTS + last sample duration
            this.nextDts = dts + this.unscaled(this.lastSampleDuration);
            // Log.debug(`next dts: ${this.nextDts}, last duration: ${this.lastSampleDuration}, last dts: ${dts}`);

            return new Uint8Array(payload.buffer, 0, this.mp4track.len);
        }
    }

    class PayloadType {
        static get H264() { return 1; }
        static get AAC() { return 2; }

        static get map() {
            return {
                [PayloadType.H264]: 'video',
                [PayloadType.AAC]: 'audio'
            }
        };

        static get string_map() {
            return {
                H264: PayloadType.H264,
                AAC: PayloadType.AAC,
                'MP4A-LATM': PayloadType.AAC,
                'MPEG4-GENERIC': PayloadType.AAC
            }
        }
    }

    const LOG_TAG$1 = "remuxer";
    const Log$5 = getTagged(LOG_TAG$1);

    class Remuxer {
        static get TrackConverters() {
            return {
                [PayloadType.H264]: H264Remuxer,
                [PayloadType.AAC]: AACRemuxer
            }
        };

        static get TrackScaleFactor() {
            return {
                [PayloadType.H264]: 1,//4,
                [PayloadType.AAC]: 0
            }
        };

        static get TrackTimescale() {
            return {
                [PayloadType.H264]: 90000,//22500,
                [PayloadType.AAC]: 0
            }
        };

        constructor(mediaElement) {
            this.mse = new MSE([mediaElement]);
            this.eventSource = new EventEmitter();
            this.mseEventSource = new EventSourceWrapper(this.mse.eventSource);
            this.mse_ready = true;

            this.reset();

            this.errorListener = this.mseClose.bind(this);
            this.closeListener = this.mseClose.bind(this);

            this.eventSource.addEventListener('ready', this.init.bind(this));
        }

        initMSEHandlers() {
            this.mseEventSource.on('error', this.errorListener);
            this.mseEventSource.on('sourceclosed', this.closeListener);
        }

        async reset() {
            this.tracks = {};
            this.initialized = false;
            this.initSegments = {};
            this.codecs = [];
            this.streams = {};
            this.enabled = false;
            await this.mse.clear();
            this.initMSEHandlers();
        }

        destroy() {
            this.mseEventSource.destroy();
            this.mse.destroy();
            this.mse = null;

            this.detachClient();

            this.eventSource.destroy();
        }

        onTracks(tracks) {
            Log$5.debug(`ontracks: `, tracks.detail);
            // store available track types
            for (let track of tracks.detail) {
                this.tracks[track.type] = new Remuxer.TrackConverters[track.type](Remuxer.TrackTimescale[track.type], Remuxer.TrackScaleFactor[track.type], track.params);
                if (track.offset) {
                    this.tracks[track.type].timeOffset = track.offset;
                }
                if (track.duration) {
                    this.tracks[track.type].mp4track.duration = track.duration * (this.tracks[track.type].timescale || Remuxer.TrackTimescale[track.type]);
                    this.tracks[track.type].duration = track.duration;
                } else {
                    this.tracks[track.type].duration = 1;
                }

                // this.tracks[track.type].duration
            }
            this.mse.setLive(!this.client.seekable);
        }

        setTimeOffset(timeOffset, track) {
            if (this.tracks[track.type]) {
                this.tracks[track.type].timeOffset = timeOffset;///this.tracks[track.type].scaleFactor;
            }
        }

        init() {
            let tracks = [];
            this.codecs = [];
            let initmse = [];
            let initPts = Infinity;
            let initDts = Infinity;
            for (let track_type in this.tracks) {
                let track = this.tracks[track_type];
                if (!MSE.isSupported([track.mp4track.codec])) {
                    throw new Error(`${track.mp4track.type} codec ${track.mp4track.codec} is not supported`);
                }
                tracks.push(track.mp4track);
                this.codecs.push(track.mp4track.codec);
                track.init(initPts, initDts/*, false*/);
                // initPts = Math.min(track.initPTS, initPts);
                // initDts = Math.min(track.initDTS, initDts);
            }

            for (let track_type in this.tracks) {
                let track = this.tracks[track_type];
                //track.init(initPts, initDts);
                //this.initSegments[track_type] = MP4.initSegment([track.mp4track], track.duration * track.timescale, track.timescale);
                this.initSegments[track_type] = MP4.initSegment([track.mp4track], 0, track.timescale);
                initmse.push(this.initMSE(track_type, track.mp4track.codec));
            }
            this.initialized = true;
            return Promise.all(initmse).then(() => {
                //this.mse.play();
                this.enabled = true;
            });

        }

        initMSE(track_type, codec) {
            if (MSE.isSupported(this.codecs)) {
                return this.mse.setCodec(track_type, `${PayloadType.map[track_type]}/mp4; codecs="${codec}"`).then(() => {
                    this.mse.feed(track_type, this.initSegments[track_type]);
                    // this.mse.play();
                    // this.enabled = true;
                });
            } else {
                throw new Error('Codecs are not supported');
            }
        }

        mseClose() {
            // this.mse.clear();
            this.client.stop();
            this.eventSource.dispatchEvent('stopped');
        }

        flush() {
            this.onSamples();

            if (!this.initialized) {
                // Log.debug(`Initialize...`);
                if (Object.keys(this.tracks).length) {
                    for (let track_type in this.tracks) {
                        if (!this.tracks[track_type].readyToDecode || !this.tracks[track_type].samples.length) return;
                        Log$5.debug(`Init MSE for track ${this.tracks[track_type].mp4track.type}`);
                    }
                    this.eventSource.dispatchEvent('ready');
                }
            } else {

                for (let track_type in this.tracks) {
                    let track = this.tracks[track_type];
                    let pay = track.getPayload();
                    if (pay && pay.byteLength) {
                        this.mse.feed(track_type, [MP4.moof(track.seq, track.scaled(track.firstDTS), track.mp4track), MP4.mdat(pay)]);
                        track.flush();
                    }
                }
            }
        }

        onSamples(ev) {
            // TODO: check format
            // let data = ev.detail;
            // if (this.tracks[data.pay] && this.client.sampleQueues[data.pay].length) {
            // console.log(`video ${data.units[0].dts}`);
            for (let qidx in this.client.sampleQueues) {
                let queue = this.client.sampleQueues[qidx];
                while (queue.length) {
                    let units = queue.shift();
                    for (let chunk of units) {
                        this.tracks[qidx].remux(chunk);
                    }
                }
            }
            // }
        }

        onAudioConfig(ev) {
            if (this.tracks[ev.detail.pay]) {
                this.tracks[ev.detail.pay].setConfig(ev.detail.config);
            }
        }

        attachClient(client) {
            this.detachClient();
            this.client = client;
            this.clientEventSource = new EventSourceWrapper(this.client.eventSource);
            this.clientEventSource.on('samples', this.samplesListener);
            this.clientEventSource.on('audio_config', this.audioConfigListener);
            this.clientEventSource.on('tracks', this.onTracks.bind(this));
            this.clientEventSource.on('flush', this.flush.bind(this));
            //this.clientEventSource.on('clear', () => {
            //    this.reset();
            //    this.mse.clear().then(() => {
            //        //this.mse.play();
            //        this.initMSEHandlers();
            //    });
            //});
        }

        detachClient() {
            if (this.client) {
                this.clientEventSource.destroy();
                // this.client.eventSource.removeEventListener('samples', this.onSamples.bind(this));
                // this.client.eventSource.removeEventListener('audio_config', this.onAudioConfig.bind(this));
                // // TODO: clear other listeners
                // this.client.eventSource.removeEventListener('clear', this._clearListener);
                // this.client.eventSource.removeEventListener('tracks', this._tracksListener);
                // this.client.eventSource.removeEventListener('flush', this._flushListener);
                this.client = null;
            }
        }
    }

    const Log$6 = getTagged("parser:sdp");

    class SDPParser {
        constructor() {
            this.version = -1;
            this.origin = null;
            this.sessionName = null;
            this.timing = null;
            this.sessionBlock = {};
            this.media = {};
            this.tracks = {};
            this.mediaMap = {};
            this.isH265 = false;
        }

        parse(content) {
            // Log.debug(content);
            return new Promise((resolve, reject) => {
                var dataString = content;
                var success = true;
                var currentMediaBlock = this.sessionBlock;

                // TODO: multiple audio/video tracks

                for (let line of dataString.split("\n")) {
                    line = line.replace(/\r/, '');
                    if (0 === line.length) {
                        /* Empty row (last row perhaps?), skip to next */
                        continue;
                    }

                    switch (line.charAt(0)) {
                        case 'v':
                            if (-1 !== this.version) {
                                Log$6.log('Version present multiple times in SDP');
                                reject();
                                return false;
                            }
                            success = success && this._parseVersion(line);
                            break;

                        case 'o':
                            if (null !== this.origin) {
                                Log$6.log('Origin present multiple times in SDP');
                                reject();
                                return false;
                            }
                            success = success && this._parseOrigin(line);
                            break;

                        case 's':
                            if (null !== this.sessionName) {
                                Log$6.log('Session Name present multiple times in SDP');
                                reject();
                                return false;
                            }
                            success = success && this._parseSessionName(line);
                            break;

                        case 't':
                            if (null !== this.timing) {
                                Log$6.log('Timing present multiple times in SDP');
                                reject();
                                return false;
                            }
                            success = success && this._parseTiming(line);
                            break;

                        case 'm':
                            if (null !== currentMediaBlock && this.sessionBlock !== currentMediaBlock) {
                                /* Complete previous block and store it */
                                this.media[currentMediaBlock.type] = currentMediaBlock;
                            }

                            /* A wild media block appears */
                            currentMediaBlock = {};
                            currentMediaBlock.rtpmap = {};
                            this._parseMediaDescription(line, currentMediaBlock);
                            break;

                        case 'a':
                            SDPParser._parseAttribute(line, currentMediaBlock);
                            break;

                        case 'c':
                            SDPParser._parseAttribute(line, currentMediaBlock);
                            break;

                        default:
                            Log$6.log('Ignored unknown SDP directive: ' + line);
                            break;
                    }

                    if (!success) {
                        reject();
                        return;
                    }
                }

                this.media[currentMediaBlock.type] = currentMediaBlock;

                success ? resolve() : reject();
            });
        }

        _parseVersion(line) {
            let matches = line.match(/^v=([0-9]+)$/);
            if (!matches || !matches.length) {
                Log$6.log('\'v=\' (Version) formatted incorrectly: ' + line);
                return false;
            }

            this.version = matches[1];
            if (0 != this.version) {
                Log$6.log('Unsupported SDP version:' + this.version);
                return false;
            }

            return true;
        }

        _parseOrigin(line) {
            let matches = line.match(/^o=([^ ]+) (-?[0-9]+) (-?[0-9]+) (IN) (IP4|IP6) ([^ ]+)$/);
            if (!matches || !matches.length) {
                Log$6.log('\'o=\' (Origin) formatted incorrectly: ' + line);
                return false;
            }

            this.origin = {};
            this.origin.username = matches[1];
            this.origin.sessionid = matches[2];
            this.origin.sessionversion = matches[3];
            this.origin.nettype = matches[4];
            this.origin.addresstype = matches[5];
            this.origin.unicastaddress = matches[6];

            return true;
        }

        _parseSessionName(line) {
            let matches = line.match(/^s=([^\r\n]+)$/);
            if (!matches || !matches.length) {
                Log$6.log('\'s=\' (Session Name) formatted incorrectly: ' + line);
                return false;
            }

            this.sessionName = matches[1];

            return true;
        }

        _parseTiming(line) {
            let matches = line.match(/^t=([0-9]+) ([0-9]+)$/);
            if (!matches || !matches.length) {
                Log$6.log('\'t=\' (Timing) formatted incorrectly: ' + line);
                return false;
            }

            this.timing = {};
            this.timing.start = matches[1];
            this.timing.stop = matches[2];

            return true;
        }

        _parseMediaDescription(line, media) {
            let matches = line.match(/^m=([^ ]+) ([^ ]+) ([^ ]+)[ ]/);
            if (!matches || !matches.length) {
                Log$6.log('\'m=\' (Media) formatted incorrectly: ' + line);
                return false;
            }

            media.type = matches[1];
            media.port = matches[2];
            media.proto = matches[3];
            media.fmt = line.substr(matches[0].length).split(' ').map(function (fmt, index, array) {
                return parseInt(fmt);
            });

            for (let fmt of media.fmt) {
                this.mediaMap[fmt] = media;
            }

            return true;
        }

        static _parseAttribute(line, media) {
            if (null === media) {
                /* Not in a media block, can't be bothered parsing attributes for session */
                return true;
            }

            var matches;
            /* Used for some cases of below switch-case */
            var separator = line.indexOf(':');
            var attribute = line.substr(0, (-1 === separator) ? 0x7FFFFFFF : separator);
            /* 0x7FF.. is default */

            switch (attribute) {
                case 'a=recvonly':
                case 'a=sendrecv':
                case 'a=sendonly':
                case 'a=inactive':
                    media.mode = line.substr('a='.length);
                    break;
                case 'a=range':
                    matches = line.match(/^a=range:\s*([a-zA-Z-]+)=([0-9.]+|now)\s*-\s*([0-9.]*)$/);
                    if (!matches) {
                        matches = line.match(/^a=range:\s*([a-zA-Z-]+)=([0-9TZ]+|now)\s*-\s*([0-9TZ]*)$/);
                    }
                    media.range = [Number(matches[2] == "now" ? -1 : matches[2]), Number(matches[3]), matches[1]];
                    if (isNaN(media.range[0])) media.range[0] = 0;
                    if (isNaN(media.range[1])) media.range[1] = 5 * 60;
                    break;
                case 'a=control':
                    media.control = line.substr('a=control:'.length);
                    break;

                case 'a=rtpmap':
                    matches = line.match(/^a=rtpmap:(\d+) (.*)$/);
                    if (null === matches) {
                        Log$6.log('Could not parse \'rtpmap\' of \'a=\'');
                        return false;
                    }

                    var payload = parseInt(matches[1]);
                    media.rtpmap[payload] = {};

                    var attrs = matches[2].split('/');
                    media.rtpmap[payload].name = attrs[0].toUpperCase();
                    media.rtpmap[payload].clock = attrs[1];
                    if (undefined !== attrs[2]) {
                        media.rtpmap[payload].encparams = attrs[2];
                    }
                    media.ptype = PayloadType.string_map[attrs[0].toUpperCase()];

                    break;

                case 'a=fmtp':
                    matches = line.match(/^a=fmtp:(\d+) (.*)$/);
                    if (0 === matches.length) {
                        Log$6.log('Could not parse \'fmtp\'  of \'a=\'');
                        return false;
                    }

                    media.fmtp = {};
                    for (var param of matches[2].split(';')) {
                        var idx = param.indexOf('=');
                        media.fmtp[param.substr(0, idx).toLowerCase().trim()] = param.substr(idx + 1).trim();
                    }
                    break;
            }

            return true;
        }

        getSessionBlock() {
            return this.sessionBlock;
        }

        hasMedia(mediaType) {
            return this.media[mediaType] != undefined;
        }

        getMediaBlock(mediaType) {
            return this.media[mediaType];
        }

        getMediaBlockByPayloadType(pt) {
            // for (var m in this.media) {
            //     if (-1 !== this.media[m].fmt.indexOf(pt)) {
            //         return this.media[m];
            //     }
            // }
            return this.mediaMap[pt] || null;

            //ErrorManager.dispatchError(826, [pt], true);
            // Log.error(`failed to find media with payload type ${pt}`);
            //
            // return null;
        }

        getMediaBlockList() {
            var res = [];
            for (var m in this.media) {
                res.push(m);
            }

            return res;
        }
    }

    // TODO: asm.js
    class RTP {
        constructor(pkt/*uint8array*/, sdp) {
            let bytes = new DataView(pkt.buffer, pkt.byteOffset, pkt.byteLength);

            this.version = bytes.getUint8(0) >>> 6;
            this.padding = bytes.getUint8(0) & 0x20 >>> 5;
            this.has_extension = bytes.getUint8(0) & 0x10 >>> 4;
            this.csrc = bytes.getUint8(0) & 0x0F;
            this.marker = bytes.getUint8(1) >>> 7;
            this.pt = bytes.getUint8(1) & 0x7F;
            this.sequence = bytes.getUint16(2);
            this.timestamp = bytes.getUint32(4);
            this.ssrc = bytes.getUint32(8);
            this.csrcs = [];

            let pktIndex = 12;
            if (this.csrc > 0) {
                this.csrcs.push(bytes.getUint32(pktIndex));
                pktIndex += 4;
            }
            if (this.has_extension == 1) {
                this.extension = bytes.getUint16(pktIndex);
                this.ehl = bytes.getUint16(pktIndex + 2);
                pktIndex += 4;
                this.header_data = pkt.slice(pktIndex, this.ehl);
                pktIndex += this.ehl;
            }

            this.headerLength = pktIndex;
            let padLength = 0;
            if (this.padding) {
                padLength = bytes.getUint8(pkt.byteLength - 1);
            }

            // this.bodyLength   = pkt.byteLength-this.headerLength-padLength;

            this.media = sdp.getMediaBlockByPayloadType(this.pt);
            if (null === this.media) {
                Log.log(`Media description for payload type: ${this.pt} not provided.`);
            } else {
                this.type = this.media.ptype;//PayloadType.string_map[this.media.rtpmap[this.media.fmt[0]].name];
            }

            this.data = pkt.subarray(pktIndex);
            // this.timestamp = 1000 * (this.timestamp / this.media.rtpmap[this.pt].clock);
            // console.log(this);
        }
        getPayload() {
            return this.data;
        }

        getTimestampMS() {
            return this.timestamp; //1000 * (this.timestamp / this.media.rtpmap[this.pt].clock);
        }

        toString() {
            return "RTP(" +
                "version:" + this.version + ", " +
                "padding:" + this.padding + ", " +
                "has_extension:" + this.has_extension + ", " +
                "csrc:" + this.csrc + ", " +
                "marker:" + this.marker + ", " +
                "pt:" + this.pt + ", " +
                "sequence:" + this.sequence + ", " +
                "timestamp:" + this.timestamp + ", " +
                "ssrc:" + this.ssrc + ")";
        }

        isVideo() { return this.media.type == 'video'; }
        isAudio() { return this.media.type == 'audio'; }


    }

    class RTPFactory {
        constructor(sdp) {
            this.tsOffsets = {};
            for (let pay in sdp.media) {
                for (let pt of sdp.media[pay].fmt) {
                    this.tsOffsets[pt] = { last: 0, overflow: 0 };
                }
            }
        }

        build(pkt/*uint8array*/, sdp) {
            let rtp = new RTP(pkt, sdp);

            let tsOffset = this.tsOffsets[rtp.pt];
            if (tsOffset) {
                rtp.timestamp += tsOffset.overflow;
                if (tsOffset.last && Math.abs(rtp.timestamp - tsOffset.last) > 0x7fffffff) {
                    console.log(`\nlast ts: ${tsOffset.last}\n
                            new ts: ${rtp.timestamp}\n
                            new ts adjusted: ${rtp.timestamp + 0xffffffff}\n
                            last overflow: ${tsOffset.overflow}\n
                            new overflow: ${tsOffset.overflow + 0xffffffff}\n
                            `);
                    tsOffset.overflow += 0xffffffff;
                    rtp.timestamp += 0xffffffff;
                }
                /*if (rtp.timestamp>0xffffffff) {
                    console.log(`ts: ${rtp.timestamp}, seq: ${rtp.sequence}`);
                }*/
                tsOffset.last = rtp.timestamp;
            }

            return rtp;
        }
    }

    // TODO: asm.js
    class NALUAsm {

        constructor() {
            this.fragmented_nalu = null;
        }


        static parseNALHeader(hdr) {
            return {
                nri: hdr & 0x60,
                type: hdr & 0x1F
            }
        }

        parseSingleNALUPacket(rawData, header, dts, pts) {
            return new NALU(header.type, header.nri, rawData.subarray(0), dts, pts);
        }

        parseAggregationPacket(rawData, header, dts, pts) {
            let data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
            let nal_start_idx = 0;
            let don = null;
            if (NALU.STAP_B === header.type) {
                don = data.getUint16(nal_start_idx);
                nal_start_idx += 2;
            }
            let ret = [];
            while (nal_start_idx < data.byteLength) {
                let size = data.getUint16(nal_start_idx);
                nal_start_idx += 2;
                let header = NALUAsm.parseNALHeader(data.getInt8(nal_start_idx));
                nal_start_idx++;
                let nalu = this.parseSingleNALUPacket(rawData.subarray(nal_start_idx, nal_start_idx + size), header, dts, pts);
                if (nalu !== null) {
                    ret.push(nalu);
                }
                nal_start_idx += size;
            }
            return ret;
        }

        parseFragmentationUnit(rawData, header, dts, pts) {
            let data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
            let nal_start_idx = 0;
            let fu_header = data.getUint8(nal_start_idx);
            let is_start = (fu_header & 0x80) >>> 7;
            let is_end = (fu_header & 0x40) >>> 6;
            let payload_type = fu_header & 0x1F;
            let ret = null;

            nal_start_idx++;
            let don = 0;
            if (NALU.FU_B === header.type) {
                don = data.getUint16(nal_start_idx);
                nal_start_idx += 2;
            }

            if (is_start) {
                this.fragmented_nalu = new NALU(payload_type, header.nri, rawData.subarray(nal_start_idx), dts, pts);
            }
            if (this.fragmented_nalu && this.fragmented_nalu.ntype === payload_type) {
                if (!is_start) {
                    this.fragmented_nalu.appendData(rawData.subarray(nal_start_idx));
                }
                if (is_end) {
                    ret = this.fragmented_nalu;
                    this.fragmented_nalu = null;
                    return ret;
                }
            }
            return null;
        }

        onNALUFragment(rawData, dts, pts) {

            let data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);

            let header = NALUAsm.parseNALHeader(data.getUint8(0));

            let nal_start_idx = 1;

            let unit = null;
            if (header.type > 0 && header.type < 24) {
                unit = this.parseSingleNALUPacket(rawData.subarray(nal_start_idx), header, dts, pts);
            } else if (NALU.FU_A === header.type || NALU.FU_B === header.type) {
                unit = this.parseFragmentationUnit(rawData.subarray(nal_start_idx), header, dts, pts);
            } else if (NALU.STAP_A === header.type || NALU.STAP_B === header.type) {
                return this.parseAggregationPacket(rawData.subarray(nal_start_idx), header, dts, pts);
            } else {
                /* 30 - 31 is undefined, ignore those (RFC3984). */
                Log.log('Undefined NAL unit, type: ' + header.type);
                return null;
            }
            if (unit) {
                return [unit];
            }
            return null;
        }
    }

    class AACFrame {

        constructor(data, dts, pts) {
            this.dts = dts;
            this.pts = pts ? pts : this.dts;

            this.data = data;//.subarray(offset);
        }

        getData() {
            return this.data;
        }

        getSize() {
            return this.data.byteLength;
        }
    }

    // TODO: asm.js
    class AACAsm {
        constructor() {
            this.config = null;
        }

        onAACFragment(pkt) {
            let rawData = pkt.getPayload();
            if (!pay || !pay.byteLength) {
                return null;
            }

            if (!pkt.media) {
                return null;
            }
            let data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);

            let sizeLength = Number(pkt.media.fmtp['sizelength'] || 0);
            let indexLength = Number(pkt.media.fmtp['indexlength'] || 0);
            let indexDeltaLength = Number(pkt.media.fmtp['indexdeltalength'] || 0);
            let CTSDeltaLength = Number(pkt.media.fmtp['ctsdeltalength'] || 0);
            let DTSDeltaLength = Number(pkt.media.fmtp['dtsdeltalength'] || 0);
            let RandomAccessIndication = Number(pkt.media.fmtp['randomaccessindication'] || 0);
            let StreamStateIndication = Number(pkt.media.fmtp['streamstateindication'] || 0);
            let AuxiliaryDataSizeLength = Number(pkt.media.fmtp['auxiliarydatasizelength'] || 0);

            let configHeaderLength =
                sizeLength + Math.max(indexLength, indexDeltaLength) + CTSDeltaLength + DTSDeltaLength +
                RandomAccessIndication + StreamStateIndication + AuxiliaryDataSizeLength;


            let auHeadersLengthPadded = 0;
            let offset = 0;
            let ts = (Math.round(pkt.getTimestampMS() / 1024) << 10) * 90000 / this.config.samplerate;
            if (0 !== configHeaderLength) {
                /* The AU header section is not empty, read it from payload */
                let auHeadersLengthInBits = data.getUint16(0); // Always 2 octets, without padding
                auHeadersLengthPadded = 2 + (auHeadersLengthInBits >>> 3) + ((auHeadersLengthInBits & 0x7) ? 1 : 0); // Add padding

                //this.config = AACParser.parseAudioSpecificConfig(new Uint8Array(rawData, 0 , auHeadersLengthPadded));
                // TODO: parse config
                let frames = [];
                let frameOffset = 0;
                let bits = new BitArray(rawData.subarray(2 + offset));
                let cts = 0;
                let dts = 0;
                for (let offset = 0; offset < auHeadersLengthInBits;) {
                    let size = bits.readBits(sizeLength);
                    let idx = bits.readBits(offset ? indexDeltaLength : indexLength);
                    offset += sizeLength + (offset ? indexDeltaLength : indexLength)/*+2*/;
                    if (/*ctsPresent &&*/ CTSDeltaLength) {
                        let ctsPresent = bits.readBits(1);
                        cts = bits.readBits(CTSDeltaLength);
                        offset += CTSDeltaLength;
                    }
                    if (/*dtsPresent && */DTSDeltaLength) {
                        let dtsPresent = bits.readBits(1);
                        dts = bits.readBits(DTSDeltaLength);
                        offset += CTSDeltaLength;
                    }
                    if (RandomAccessIndication) {
                        bits.skipBits(1);
                        offset += 1;
                    }
                    if (StreamStateIndication) {
                        bits.skipBits(StreamStateIndication);
                        offset += StreamStateIndication;
                    }
                    frames.push(new AACFrame(rawData.subarray(auHeadersLengthPadded + frameOffset, auHeadersLengthPadded + frameOffset + size), ts + dts, ts + cts));
                    frameOffset += size;
                }
                return frames;
            } else {
                let aacData = rawData.subarray(auHeadersLengthPadded);
                while (true) {
                    if (aacData[offset] != 255) break;
                    ++offset;
                }
                ++offset;
                return [new AACFrame(rawData.subarray(auHeadersLengthPadded + offset), ts)];
            }
        }
    }

    class RTPPayloadParser {

        constructor() {
            this.h264parser = new RTPH264Parser();
            this.aacparser = new RTPAACParser();
        }

        parse(rtp) {
            if (rtp.media.type == 'video') {
                return this.h264parser.parse(rtp);
            } else if (rtp.media.type == 'audio') {
                return this.aacparser.parse(rtp);
            }
            return null;
        }
    }

    class RTPH264Parser {
        constructor() {
            this.naluasm = new NALUAsm();
        }

        parse(rtp) {
            return this.naluasm.onNALUFragment(rtp.getPayload(), rtp.getTimestampMS());
        }
    }

    class RTPAACParser {

        constructor() {
            this.scale = 1;
            this.asm = new AACAsm();
        }

        setConfig(conf) {
            this.asm.config = conf;
        }

        parse(rtp) {
            return this.asm.onAACFragment(rtp);
        }
    }

    class BaseClient {
        constructor(options = { flush: 100 }) {
            this.options = options;
            this.eventSource = new EventEmitter();

            Object.defineProperties(this, {
                sourceUrl: { value: null, writable: true },   // TODO: getter with validator
                paused: { value: true, writable: true },
                seekable: { value: false, writable: true },
                connected: { value: false, writable: true }
            });

            this._onData = () => {
                if (this.connected) {
                    while (this.transport.dataQueue.length) {
                        this.onData(this.transport.dataQueue.pop());
                    }
                }
            };
            this._onConnect = this.onConnected.bind(this);
            this._onDisconnect = this.onDisconnected.bind(this);
        }

        static streamType() {
            return null;
        }

        destroy() {
            this.detachTransport();
        }

        attachTransport(transport) {
            if (this.transport) {
                this.detachTransport();
            }
            this.transport = transport;
            this.transport.eventSource.addEventListener('data', this._onData);
            this.transport.eventSource.addEventListener('connected', this._onConnect);
            this.transport.eventSource.addEventListener('disconnected', this._onDisconnect);
        }

        detachTransport() {
            if (this.transport) {
                this.transport.eventSource.removeEventListener('data', this._onData);
                this.transport.eventSource.removeEventListener('connected', this._onConnect);
                this.transport.eventSource.removeEventListener('disconnected', this._onDisconnect);
                this.transport = null;
            }
        }
        reset() {

        }

        start() {
            Log.log('Client start');
            this.paused = false;
            // this.startStreamFlush();
        }

        play() {
            Log.log('Client play');
            if (this.pause) {
                this.paused = false;
                // this.startStreamFlush();
                if (this.transport)
                    this.transport.send('', WSPProtocol.CMD_PLAY);
            }
        }

        pause() {
            Log.log('Client pause');
            if (this.pause) {
                this.paused = true;
                // this.stopStreamFlush();
                if (this.transport)
                    this.transport.send('', WSPProtocol.CMD_PAUSE);
            }
        }

        stop() {
            Log.log('Client stop');
            this.paused = true;
            // this.stopStreamFlush();
        }

        seek(range) {
            if (this.transport)
                return this.transport.send('range:' + range, WSPProtocol.CMD_SEEK);
        }

        setSource(source) {
            this.stop();
            if (source) {
                this.endpoint = source;
                this.sourceUrl = source.urlpath;
            }
        }

        startStreamFlush() {
            this.flushInterval = setInterval(() => {
                if (!this.paused) {
                    this.eventSource.dispatchEvent('flush');
                }
            }, this.options.flush);
        }

        stopStreamFlush() {
            clearInterval(this.flushInterval);
        }

        onData(data) {
            var objData = {
                t: kFileData,
                s: 0,
                e: ev.data.byteLength,
                d: ev.data,
                q: 0
            };
            self.postMessage(objData, [objData.d]);
        }

        onConnected() {
            if (!this.seekable) {
                this.transport.dataQueue = [];
                this.eventSource.dispatchEvent('clear');
            }
            this.connected = true;
        }

        onDisconnected() {
            this.connected = false;
        }

        queryCredentials() {
            return Promise.resolve();
        }

        setCredentials(user, password) {
            if (this.endpoint) {
                this.endpoint.user = user;
                this.endpoint.pass = password;
                this.endpoint.auth = `${user}:${password}`;
            }
        }
    }

    class AACParser {
        static get SampleRates() {
            return [
                96000, 88200,
                64000, 48000,
                44100, 32000,
                24000, 22050,
                16000, 12000,
                11025, 8000,
                7350];
        }

        // static Profile = [
        //     0: Null
        //     1: AAC Main
        //     2: AAC LC (Low Complexity)
        //     3: AAC SSR (Scalable Sample Rate)
        //     4: AAC LTP (Long Term Prediction)
        //     5: SBR (Spectral Band Replication)
        //     6: AAC Scalable
        // ]

        static parseAudioSpecificConfig(bytesOrBits) {
            let config;
            if (bytesOrBits.byteLength) { // is byteArray
                config = new BitArray(bytesOrBits);
            } else {
                config = bytesOrBits;
            }

            let bitpos = config.bitpos + (config.src.byteOffset + config.bytepos) * 8;
            let prof = config.readBits(5);
            this.codec = `mp4a.40.${prof}`;
            let sfi = config.readBits(4);
            if (sfi == 0xf) config.skipBits(24);
            let channels = config.readBits(4);

            return {
                config: bitSlice(new Uint8Array(config.src.buffer), bitpos, bitpos + 16),
                codec: `mp4a.40.${prof}`,
                samplerate: AACParser.SampleRates[sfi],
                channels: channels
            }
        }

        static parseStreamMuxConfig(bytes) {
            // ISO_IEC_14496-3 Part 3 Audio. StreamMuxConfig
            let config = new BitArray(bytes);

            if (!config.readBits(1)) {
                config.skipBits(14);
                return AACParser.parseAudioSpecificConfig(config);
            }
        }
    }

    const LOG_TAG$4 = "client:rtp";
    const Log$9 = getTagged(LOG_TAG$4);
    class RTPClient extends BaseClient {

        static streamType() {
            return 'rtp';
        }

        constructor(options = { flush: 200 }) {
            super(options);

            this.rtpBuffer = {};
            this.timeOffset = {};
            this.lastTimestamp = {};
            this.transport = null;
            this.payParser = new RTPPayloadParser();
            this.rtp_channels = new Set();
            //this.sessions = {};

            this.ontracks = (tracks) => {
                this.eventSource.dispatchEvent('tracks', tracks);
                this.startStreamFlush();
            };
            this.sampleQueues = {};

            this.keepaliveTime = 30000;
        }

        reset() {
            this.tracks = [];
            this.rtpBuffer = {};

            this.sdp = null;
            this.interleaveChannelIndex = 0;
            //this.session = null;
            this.timeOffset = {};
            this.lastTimestamp = {};
        }

        async reconnect() {
            //this.parent.eventSource.dispatchEvent('clear');
            await this.reset();
            await this.transport.send('', WSPProtocol.CMD_INIT);
            return this.transport.send('', WSPProtocol.CMD_PLAY);
        }

        start() {
            super.start();
            if (this.transport) {
                return this.transport.ready.then(() => {
                    if (this.keepaliveInterval)
                        return;

                    let ops = this.transport.socket().options;
                    this.sdp = ops.sdp;
                    if (this.sdp.isH265) {
                        let duration = this.sdp.sessionBlock.range ? this.sdp.sessionBlock.range[1] - this.sdp.sessionBlock.range[0] : 0;
                        this.seekable = (duration > 1);
                        return;
                    }

                    this.tracks = this.sdp.getMediaBlockList();
                    this.rtpFactory = new RTPFactory(this.sdp);

                    let reses = [];
                    let reIndex = 0;

                    for (let track_type of this.tracks) {
                        Log$9.log("setup track: " + track_type);
                        // if (track_type=='audio') continue;
                        // if (track_type=='video') continue;
                        let track = this.sdp.getMediaBlock(track_type);
                        if (!PayloadType.string_map[track.rtpmap[track.fmt[0]].name]) continue;

                        this.sampleQueues[PayloadType.string_map[track.rtpmap[track.fmt[0]].name]] = [];
                        this.rtpBuffer[track.fmt[0]] = [];

                        this.timeOffset[track.fmt[0]] = 0;

                        let params = {
                            timescale: 0,
                            scaleFactor: 0
                        };
                        if(track.fmtp){
							if (track.fmtp['sprop-parameter-sets']) {
							    let sps_pps = track.fmtp['sprop-parameter-sets'].split(',');
							    params = {
							        sps: base64ToArrayBuffer(sps_pps[0]),
							        pps: base64ToArrayBuffer(sps_pps[1])
							    };
							} else if (track.fmtp['config']) {
							    let config = track.fmtp['config'];
							    this.has_config = track.fmtp['cpresent'] != '0';
							    let generic = track.rtpmap[track.fmt[0]].name == 'MPEG4-GENERIC';
							    if (generic) {
							        params = {
							            config:
							                AACParser.parseAudioSpecificConfig(hexToByteArray(config))
							        };
							        this.payParser.aacparser.setConfig(params.config);
							    } else if (config) {
							        // todo: parse audio specific config for mpeg4-generic
							        params = {
							            config:
							                AACParser.parseStreamMuxConfig(hexToByteArray(config))
							        };
							        this.payParser.aacparser.setConfig(params.config);
							    }
							}
						}
                        params.duration = this.sdp.sessionBlock.range ? this.sdp.sessionBlock.range[1] - this.sdp.sessionBlock.range[0] : 0;
                        this.seekable = (params.duration > 1);
                        reses[reIndex++] = {
                            track: track,
                            offset: this.timeOffset[track.fmt[0]],
                            type: PayloadType.string_map[track.rtpmap[track.fmt[0]].name],
                            params: params,
                            duration: params.duration
                        };

                        let interleaved = ops.channels[track_type].match(/interleaved=([0-9]+)-([0-9]+)/)[1];
                        if (interleaved) {
                            this.useRTPChannel(Number(interleaved));
                        }
                    }

                    if (this.ontracks) {
                        this.ontracks(reses);
                    }

                    this.startKeepAlive();
                    return this.transport.send('', WSPProtocol.CMD_PLAY);
                });
            }
            else
                return null;
        }

        play() {
            super.play();
        }

        pause() {
            super.pause();
        }

        stop() {
            super.stop();
        }

        detachTransport() {
            this.stopKeepAlive();

            super.detachTransport();
        }

        useRTPChannel(channel) {
            this.rtp_channels.add(channel);
        }

        forgetRTPChannel(channel) {
            this.rtp_channels.delete(channel);
        }

        sendKeepalive() {
            if (this.transport)
                return this.transport.send('', WSPProtocol.CMD_KEEP);

            this.stopKeepAlive();

            return null;
        }

        stopKeepAlive() {
            clearInterval(this.keepaliveInterval);
            this.keepaliveInterval = null;
        }

        startKeepAlive() {
            if (this.keepaliveInterval) {
                this.stopKeepAlive();
            }

            this.keepaliveInterval = setInterval(() => {
                let result = this.sendKeepalive();
                if (result) {
                    result.catch((e) => {
                        Log$7.error(e);
                        if (e instanceof RTSPError) {
                            if (Number(e.data.parsed.code) == 501) {
                                return;
                            }
                        }
                        this.reconnect();
                    });
                }
            }, this.keepaliveTime);
        }

        onData(data) {
            let channel = data[1];
            if (this.rtp_channels.has(channel)) {
                this.onRTP({ packet: data.subarray(4), type: channel });
            }
        }

        onRTP(_data) {
            if (!this.rtpFactory) return;

            let rtp = this.rtpFactory.build(_data.packet, this.sdp);
            if (!rtp.type) {
                return;
            }

            if (this.timeOffset[rtp.pt] === undefined) {
                //console.log(rtp.pt, this.timeOffset[rtp.pt]);
                this.rtpBuffer[rtp.pt].push(rtp);
                return;
            }

            if (this.lastTimestamp[rtp.pt] === undefined) {
                this.lastTimestamp[rtp.pt] = rtp.timestamp - this.timeOffset[rtp.pt];
            }

            let queue = this.rtpBuffer[rtp.pt];
            queue.push(rtp);

            while (queue.length) {
                let rtp = queue.shift();

                rtp.timestamp = rtp.timestamp - this.timeOffset[rtp.pt] - this.lastTimestamp[rtp.pt];
                // TODO: overflow
                // if (rtp.timestamp < 0) {
                //     rtp.timestamp = (rtp.timestamp + Number.MAX_SAFE_INTEGER) % 0x7fffffff;
                // }
                if (rtp.media) {
                    let pay = this.payParser.parse(rtp);
                    if (pay) {
                        // if (typeof pay == typeof []) {
                        this.sampleQueues[rtp.type].push(pay);
                        // } else {
                        //     this.parent.sampleQueues[rtp.type].push([pay]);
                        // }
                    }
                }
            }
            // this.remuxer.feedRTP();
        }
    }

    class BaseTransport {
        constructor(endpoint, stream_type, config = {}) {
            this.stream_type = stream_type;
            this.endpoint = endpoint;
            this.eventSource = new EventEmitter();
            this.dataQueue = [];
            this.config = config;
        }

        destroy() {
            this.eventSource.destroy();
        }

        connect() {
            // TO be impemented
        }

        disconnect() {
            // TO be impemented
        }

        reconnect() {
            return this.disconnect().then(() => {
                return this.connect();
            });
        }

        setEndpoint(endpoint) {
            this.endpoint = endpoint;
            return this.reconnect();
        }

        send(data) {
            // TO be impemented
            // return this.prepare(data).send();
        }

        prepare(data) {
            // TO be impemented
            // return new Request(data);
        }

        // onData(type, data) {
        //     this.eventSource.dispatchEvent(type, data);
        // }
    }

    const LOG_TAG$5 = "transport:ws";
    const Log$10 = getTagged(LOG_TAG$5);
    class WebsocketTransport extends BaseTransport {
        constructor(endpoint, stream_type, options = {
            socket: `${location.protocol.replace('http', 'ws')}//${location.host}/ws/`,
            workers: 1
        }) {
            super(endpoint, stream_type, options);
            this.proxies = [];
            this.currentProxy = 0;
            this.workers = 1;
            this.socket_url = options.socket;
            this.ready = this.connect();
        }

        destroy() {
            return this.disconnect().then(() => {
                return super.destroy();
            });

        }

        static canTransfer(stream_type) {
            return StreamType$1.isSupported(stream_type);
        }

        set_disconnect_handler(handler) {
            this.disconnectHandler = handler;
        }

        set_decodechanged_handler(handler) {
            this.decodechangedHandler = handler;
        }

        set_h265_handler(handler) {
            this.h265_data_handler = handler;
        }

        connect() {
            return this.disconnect().then(() => {
                let promises = [];
                // TODO: get mirror list
                for (let i = 0; i < this.workers; ++i) {
                    let proxy = new WebSocketProxy(this.socket_url, this.config, this.stream_type);

                    proxy.set_disconnect_handler((e) => {
                        this.eventSource.dispatchEvent('disconnected', { code: e.code, reason: e.reason });
                        // TODO: only reconnect on demand

                        if (this.disconnectHandler) {
                            this.disconnectHandler(e);
                        }

                        if ([1000, 1006, 1013, 1011].includes(e.code)) {
                            setTimeout(() => {
                                if (this.ready && this.ready.reject) {
                                    this.ready.reject();
                                }
                                this.ready = this.connect();
                            }, 3000);
                        }
                    });
					//获取到视频流后的操作
                    proxy.set_data_handler((data) => {
                        if (this.h265_data_handler) {
                            this.h265_data_handler.onData(data);
                        } else {
                            this.dataQueue.push(new Uint8Array(data));
                            this.eventSource.dispatchEvent('data');
                        }
                    });

                    if (this.decodechangedHandler)
                        proxy.set_decodechanged_handler(this.decodechangedHandler);

                    promises.push(proxy.connect().then(() => {
                        this.eventSource.dispatchEvent('connected');
                    }).catch((e) => {
                        this.eventSource.dispatchEvent('error');
                        throw new Error(e);
                    }));
                    this.proxies.push(proxy);
                }
                return Promise.all(promises);
            });
        }

        disconnect() {
            let promises = [];
            for (let i = 0; i < this.proxies.length; ++i) {
                promises.push(this.proxies[i].close());
            }
            this.proxies = [];
            if (this.proxies.length) {
                return Promise.all(promises);
            } else {
                return Promise.resolve();
            }
        }

        socket() {
            return this.proxies[(this.currentProxy++) % this.proxies.length];
        }

        send(_data, cmd, fn) {
            let pro = this.socket();
            if (pro && pro.send) {
                let res = pro.send(_data, cmd);
                if (fn) {
                    fn(res.seq);
                }
                return res.promise;
            }
            return null;
        }
    }

    class WSPProtocol {
        static get PROTO() { return 'WSP'; }

        static get V1_1() { return '1.1'; }

        static get CMD_INIT() { return 'INIT'; }
        static get CMD_JOIN() { return 'JOIN'; }
        static get CMD_PLAY() { return 'PLAY'; }
        static get CMD_KEEP() { return 'KEEP'; }
        static get CMD_WRAP() { return 'WRAP'; }
        static get CMD_PAUSE() { return 'PAUSE'; }
        static get CMD_SEEK() { return 'SEEK'; }

        constructor(ver) {
            this.ver = ver;
        }

        build(cmd, data, payload = '') {
            let data_str = '';
            if (!data.seq) {
                data.seq = ++WSPProtocol.seq;
            }
            for (let k in data) {
                data_str += `${k}: ${data[k]}\r\n`;
            }
            return `${WSPProtocol.PROTO}/${this.ver} ${cmd}\r\n${data_str}\r\n${payload}`;
        }

        static parse(data) {
            let payIdx = data.indexOf('\r\n\r\n');
            let lines = data.substr(0, payIdx).split('\r\n');
            let hdr = lines.shift().match(new RegExp(`${WSPProtocol.PROTO}/${WSPProtocol.V1_1}\\s+(\\d+)\\s+(.+)`));
            if (hdr) {
                let res = {
                    code: Number(hdr[1]),
                    msg: hdr[2],
                    data: {},
                    payload: ''
                };
                while (lines.length) {
                    let line = lines.shift();
                    if (line) {
                        let [k, v] = line.split(': ');
                        res.data[k.trim()] = v.trim();
                    } else {
                        break;
                    }
                }
                res.payload = data.substr(payIdx + 4);
                return res;
            }
            return null;
        }
    }
    WSPProtocol.seq = 0;

    class WebSocketProxy {
        static get CHN_CONTROL() { return 'control'; }
        static get CHN_DATA() { return 'data'; }

        constructor(wsurl, config, stream_type) {
            this.url = wsurl;
            this.stream_type = stream_type;
            //this.endpoint = endpoint;
            this.data_handler = () => { };
            this.disconnect_handler = () => { };
            this.builder = new WSPProtocol(WSPProtocol.V1_1);
            this.awaitingPromises = {};
            this.seq = 0;
            this.options = {
                sdp: new SDPParser()
            };

            if (config.id) {
                this.options.id = config.id;
            }
            if (config.rtsp) {
                this.options.rtsp = config.rtsp;
            }
            if (config.starttime) {
                this.options.starttime = config.starttime;
            }
        }

        set_data_handler(handler) {
            this.data_handler = handler;
        }

        set_disconnect_handler(handler) {
            this.disconnect_handler = handler;
        }

        set_decodechanged_handler(handler) {
            this.decodechangedHandler = handler;
        }

        close() {
            Log$10.log('closing connection');
            return new Promise((resolve) => {
                this.ctrlChannel.onclose = () => {
                    if (this.dataChannel) {
                        this.dataChannel.onclose = () => {
                            Log$10.log('closed');
                            resolve();
                        };
                        this.dataChannel.close();
                    } else {
                        Log$10.log('closed');
                        resolve();
                    }
                };
                this.ctrlChannel.close();
            });
        }

        onDisconnect() {
            this.ctrlChannel.onclose = null;
            this.ctrlChannel.close();
            if (this.dataChannel) {
                this.dataChannel.onclose = null;
                this.dataChannel.close();
            }
            this.disconnect_handler(this);
        }

        initDataChannel(channel_id) {
            return new Promise((resolve, reject) => {
                this.dataChannel = new WebSocket(this.url, WebSocketProxy.CHN_DATA);
                this.dataChannel.binaryType = 'arraybuffer';
                this.dataChannel.onopen = () => {
                    let msg = this.builder.build(WSPProtocol.CMD_JOIN, {
                        channel: channel_id
                    });
                    Log$10.debug(msg);
                    this.dataChannel.send(msg);
                };
                this.dataChannel.onmessage = (ev) => {
                    Log$10.debug(`[data]\r\n${ev.data}`);
                    let res = WSPProtocol.parse(ev.data);
                    if (!res) {
                        return reject();
                    }

                    this.dataChannel.onmessage = (e) => {
                        // Log.debug('got data');
                        if (this.data_handler) {
                            this.data_handler(e.data);
                        }
                    };
                    resolve();
                };
                this.dataChannel.onerror = (e) => {
                    Log$10.error(`[data] ${e.type}`);
                    this.dataChannel.close();
                };
                this.dataChannel.onclose = (e) => {
                    Log$10.error(`[data] ${e.type}. code: ${e.code}, reason: ${e.reason || 'unknown reason'}`);
                    this.onDisconnect(e);
                };
            });
        }

        connect() {
            this.encryptionKey = null;
            return new Promise((resolve, reject) => {
                this.ctrlChannel = new WebSocket(this.url, WebSocketProxy.CHN_CONTROL);

                this.connected = false;

                this.ctrlChannel.onopen = () => {
                    let headers = {
                        proto: this.stream_type
                    };
                    if (this.options.id) {
                        headers.id = this.options.id;
                    }
                    if (this.options.rtsp) {
                        headers.rtsp = this.options.rtsp;
                    }
                    if (this.options.starttime) {
                        headers.starttime = this.options.starttime;
                    }

                    let msg = this.builder.build(WSPProtocol.CMD_INIT, headers);
                    Log$10.debug(msg);
                    this.ctrlChannel.send(msg);
                };

                this.ctrlChannel.onmessage = (ev) => {
                    Log$10.debug(`[ctrl]\r\n${ev.data}`);

                    let res = WSPProtocol.parse(ev.data);
                    if (!res) {
                        return reject();
                    }

                    if (res.code >= 300) {
                        Log$10.error(`[ctrl]\r\n${res.code}: ${res.msg}`);
                        return reject();
                    }
                    this.ctrlChannel.onmessage = (e) => {
                        let res = WSPProtocol.parse(e.data);
                        Log$10.debug(`[ctrl]\r\n${e.data}`);
                        if (res.data.seq in this.awaitingPromises) {
                            if (res.code < 300) {
                                this.awaitingPromises[res.data.seq].resolve(res);
                            } else {
                                this.awaitingPromises[res.data.seq].reject(res);
                            }
                            delete this.awaitingPromises[res.data.seq];
                        }
                    };

                    this.options.sdp.parse(res.payload);
                    this.options.channels = [];

                    this.options.sdp.isH265 = res.data.decoder == "265";
                    //�ж���h264����h265����Ĳ�������
                    if (this.decodechangedHandler) {
                        this.decodechangedHandler(this.options.sdp.isH265);
                    }
                    if (!this.options.sdp.isH265) {
                        for (let media in this.options.sdp.media) {
                            this.options.channels[media] = res.data[this.options.sdp.media[media].control];
                        }
                    }

                    this.initDataChannel(res.data.channel).then(resolve).catch(reject);
                };

                this.ctrlChannel.onerror = (e) => {
                    Log$10.error(`[ctrl] ${e.type}`);
                    this.ctrlChannel.close();
                };
                this.ctrlChannel.onclose = (e) => {
                    Log$10.error(`[ctrl] ${e.type}. code: ${e.code} ${e.reason || 'unknown reason'}`);
                    this.onDisconnect(e);
                };
            });
        }

        send(payload, cmd) {
            if (this.ctrlChannel.readyState != WebSocket.OPEN) {
                this.close();
                // .then(this.connect.bind(this));
                // return;
                throw new Error('disconnected');
            }
            // Log.debug(payload);
            let data = {
                contentLength: payload ? payload.length : 0,
                seq: ++WSPProtocol.seq
            };
            return {
                seq: data.seq,
                promise: new Promise((resolve, reject) => {
                    this.awaitingPromises[data.seq] = { resolve, reject };
                    let msg = this.builder.build(cmd, data, payload);
                    Log$10.debug(msg);
                    this.ctrlChannel.send(msg);
                })
            };
        }
    }

    const Log$11 = getTagged('wsp');

    class StreamType$1 {
        static get HLS() { return 'hls'; }
        static get RTSP() { return 'rtsp'; }
        static get RTP() { return 'rtp'; }

        static isSupported(type) {
            return [StreamType$1.HLS, StreamType$1.RTSP, StreamType$1.RTP].includes(type);
        }

        static fromUrl(url) {
            let parsed;
            try {
                parsed = Url.parse(url);
            } catch (e) {
                return null;
            }
            switch (parsed.protocol) {
                case 'rtsp':
                    return StreamType$1.RTSP;
                case 'http':
                case 'https':
                    if (url.indexOf('.m3u8') >= 0) {
                        return StreamType$1.HLS;
                    } else {
                        return null;
                    }
                default:
                    return null;
            }
        }

        static fromMime(mime) {
            switch (mime) {
                case 'application/x-rtsp':
                    return StreamType$1.RTSP;
                case 'application/vnd.apple.mpegurl':
                case 'application/x-mpegurl':
                    return StreamType$1.HLS;
                default:
                    return null;
            }
        }
    }

    //Decoder states.
    const decoderStateIdle = 0;
    const decoderStateInitializing = 1;
    const decoderStateReady = 2;
    const decoderStateFinished = 3;

    //Player states.
    const playerStateIdle = 0;
    const playerStatePlaying = 1;
    const playerStatePausing = 2;

    //Constant.
    const maxVideoFrameQueueSize = 16;
    const downloadSpeedByteRateCoef = 1.5;

    class CanvasPlayer extends BaseClient {

        constructor(canvas, seekable, options = { flush: 200 }) {
            super(options);

            this.canvas = canvas;
            this.seekable = seekable;
            this.webglPlayer = null;
            this.eventSource = new EventEmitter();

            this.decoderState = decoderStateIdle;
            this.playerState = playerStateIdle;

            this.paused = false;
            this.seeking = false;
            this.trackTimer = null;
            this.trackTimerInterval = 500;
            this.beginTimeOffset = 0;
            this.duration = 0;
            this.time = 0;
            this.lastTime = 0;

            this.decodeInterval = 5;
            this.audioQueue = [];
            this.videoQueue = [];

            this.keepaliveTime = 30000;
            //this.logger = new Logger("Player");

            this.initDecodeWorker();
        }

        addSelfListener(listenerName, handler) {
            this.eventSource.addEventListener(listenerName, handler);
        }

        destroy() {
            this.eventSource.destroy();

            this.decodeWorker.terminate();
            this.decodeWorker = null;
        }

        initDecodeWorker() {
            let self = this;
            this.decodeWorker = new Worker("static/js/h265/videodecoder.js");
            this.decodeWorker.onmessage = function (evt) {
                var objData = evt.data;
                switch (objData.t) {
                    case kInitDecoderRsp:
                        self.onInitDecoder(objData);
                        break;
                    case kOpenDecoderRsp:
                        self.onOpenDecoder(objData);
                        break;
                    case kCloseDecoderRsp:
                        self.OnCloseDecoder(objData);
                        break;
                    case kVideoFrame:
                        self.onVideoFrame(objData);
                        break;
                    case kAudioFrame:
                        self.onAudioFrame(objData);
                        break;
                    case kDecodeFinishedEvt:
                        self.onDecodeFinished(objData);
                        break;
                    case kRequestDataEvt:
                        self.onRequestData(objData.o);
                        break;
                    case kSeekToRsp:
                        self.onSeekToRsp(objData.r);
                        break;
                }
            }
        }

        onInitDecoder(objData) {
            if (this.playerState == playerStateIdle) {
                return;
            }

            if (this.decoderState == decoderStateInitializing) {
                this.decoderState = decoderStateReady;
                return;
            }

            //this.logger.logInfo("Init decoder response " + objData.e + ".");
            if (objData.e == 0) {
                this.eventSource.dispatchEvent("play", this);
                this.eventSource.dispatchEvent("timeupdate", this.time);
                this.decoderState = decoderStateReady;
                this.transport.send('', WSPProtocol.CMD_PLAY);
                this.startKeepAlive();
            } else {
                this.reportPlayError(objData.e);
            }
        }

        onOpenDecoder(objData) {
            if (this.playerState == playerStateIdle) {
                return;
            }

            //this.logger.logInfo("Open decoder response " + objData.e + ".");
            if (objData.e == 0) {
                this.onVideoParam(objData.v);
                this.onAudioParam(objData.a);
                this.decoderState = decoderStateReady;
                //this.logger.logInfo("Decoder ready now.");
                this.startDecoding();
            } else {
                this.reportPlayError(objData.e);
            }
        }

        OnCloseDecoder(objData) {
            //this.decoderState = decoderStateIdle;
        }

        onVideoFrame(frame) {
            if (this.playerState != playerStatePlaying) {
                return;
            }

            if (this.seeking) {
                this.restartAudio();
                this.startTrackTimer();
                //this.hideLoading();
                this.seeking = false;
            }

            //Queue video frames for memory controlling.
            this.videoQueue.push(frame);
            if (!this.seekable && this.videoQueue.length >= maxVideoFrameQueueSize) {
                //if (this.decoding) {
                //    //this.logger.logInfo("Image queue size >= " + maxVideoFrameQueueSize + ", pause decoding.");
                //    this.pauseDecoding();
                //}
                this.videoQueue.shift();
            }
        };

        reportPlayError(error, status, message) {
            var e = {
                error: error || 0,
                status: status || 0,
                message: message
            };

            if (this.callback) {
                this.callback(e);
            }
        }

        startTrackTimer() {
            let self = this;
            this.trackTimer = setInterval(function () {
                self.updateTrackTime();
            }, this.trackTimerInterval);
        }

        stopTrackTimer() {
            if (this.trackTimer != null) {
                clearInterval(this.trackTimer);
                this.trackTimer = null;
            }
        }

        updateTrackTime() {
//          if (this.playerState == playerStatePlaying && this.pcmPlayer) {
//              var currentPlayTime = this.pcmPlayer.getTimestamp() + this.beginTimeOffset;
//              if (this.timeTrack) {
//                  this.timeTrack.value = 1000 * currentPlayTime;
//              }
//
//              if (this.timeLabel) {
//                  this.timeLabel.innerHTML = this.formatTime(currentPlayTime) + "/" + this.displayDuration;
//              }
//          }
        }

        displayLoop() {
            requestAnimationFrame(this.displayLoop.bind(this));
            if (this.playerState != playerStatePlaying || this.paused) {
                return;
            }

            if (this.videoQueue.length == 0) {
                return;
            }

            var frame = this.videoQueue[0];
            
//          console.log(frame)
            
            var audioCurTs = 0;
            if (this.pcmPlayer) this.pcmPlayer.getTimestamp();
            var audioTimestamp = audioCurTs + this.beginTimeOffset;
            var delay = frame.s - audioTimestamp;

            //this.logger.logInfo("displayLoop delay=" + delay + "=" + " " + frame.s  + " - (" + audioCurTs  + " + " + this.beginTimeOffset + ")" + "->" + audioTimestamp);

            if (audioTimestamp <= 0 || delay <= 0) {
                var data = new Uint8Array(frame.d);
                //this.renderVideoFrame(frame.d);

                // if (this.canvas.width != frame.w)
                // this.canvas.width = frame.w;

                // if (this.canvas.height != frame.h)
                // this.canvas.height = frame.h;

                this.time += 40;
                if (parseInt(this.time / 1000) != parseInt(this.lastTime / 1000)) {
//              	console.log(this.time,this.lastTime);
                    this.lastTime = this.time;
                    this.eventSource.dispatchEvent("timeupdate", this.time);
                }

                this.webglPlayer.renderFrame(frame.d, frame.w, frame.h, frame.y, frame.uv);

                this.videoQueue.shift();

                //if (this.videoQueue.length < maxVideoFrameQueueSize / 2) {
                //    if (!this.decoding) {
                //        //this.logger.logInfo("Image queue size < " + maxVideoFrameQueueSize / 2 + ", restart decoding.");
                //        this.startDecoding();
                //    }
                //}

                if (this.videoQueue.length == 0) {
                    if (this.decoderState == decoderStateFinished) {
                        this.reportPlayError(1, 0, "Finished");
                        this.stop();
                    }
                }
            }
        }

        detachTransport() {
            this.stopKeepAlive();

            super.detachTransport();
        }

        sendKeepalive() {
            if (this.transport)
                return this.transport.send('', WSPProtocol.CMD_KEEP);

            this.stopKeepAlive();

            return null;
        }

        sendOpenDecoder() {
            var req = {
                t: kInitDecoderReq,
                s: DECODER_H265,
                c: this.chunkSize
            };
            this.decodeWorker.postMessage(req);
        }

        sendFlushDecoder() {
            var req = {
                t: kPauseDecodingReq
            };
            this.decodeWorker.postMessage(req);
        }

        sendCloseDecoder() {
            var req = {
                t: kCloseDecoderReq
            };
            this.decodeWorker.postMessage(req);
        }

        stopKeepAlive() {
            clearInterval(this.keepaliveInterval);
            this.keepaliveInterval = null;
        }

        startKeepAlive() {
            if (this.keepaliveInterval) {
                this.stopKeepAlive();
            }

            this.keepaliveInterval = setInterval(() => {
                let result = this.sendKeepalive();
                if (result) {
                    result.catch((e) => {
                        //Log$7.error(e);
                        //if (e instanceof RTSPError) {
                        //    if (Number(e.data.parsed.code) == 501) {
                        //        return;
                        //    }
                        //}
                        //this.reconnect();
                    });
                }
            }, this.keepaliveTime);
        }

        onData(data) {
            if (this.playerState != playerStatePlaying) {
                return;
            }
	
            let objData = {
                t: kFeedDataReq,
                d: data
            };
            
            this.decodeWorker.postMessage(objData, [objData.d]);
        }

        start() {

            this.playerState = playerStatePlaying;
            this.startTrackTimer();
            this.displayLoop();

            //var playCanvasContext = playCanvas.getContext("2d"); //If get 2d, webgl will be disabled.
            this.webglPlayer = new WebGLPlayer(this.canvas, {
                preserveDrawingBuffer: false
            });

            this.sendOpenDecoder();
        }

        stop() {
            super.stop();

            this.playerState = playerStateIdle;

            this.stopKeepAlive();
            this.stopTrackTimer();

            if (this.webglPlayer)
                this.webglPlayer.destroy();
            this.webglPlayer = null;

            this.videoQueue = [];

            this.sendFlushDecoder();
            this.sendCloseDecoder();

            this.eventSource.dispatchEvent("stop", this);
        }

        play() {
            if (this.pause) {
                this.paused = false;
                this.playerState = playerStatePlaying;
            }
        }

        pause() {
            if (this.pause) {
                this.paused = true;
                this.playerState = playerStatePausing;
            }
        }

        seek(range) {

            if (this.transport) {

                this.pause();

                this.transport.send('', WSPProtocol.CMD_PAUSE).then(() => {

                    //���³�ʼ��������
                    //this.decoderState = decoderStateInitializing;
                    //this.sendFlushDecoder();
                    this.sendCloseDecoder();
                    this.decodeWorker.terminate();
                    this.decodeWorker = null;

                    this.initDecodeWorker();
                    this.sendOpenDecoder();

                    this.videoQueue.length = 0;
                    this.play();

                    super.seek(range).then(() => {
                        this.lastTime = this.time;
                        this.time = 0;
                        this.eventSource.dispatchEvent("timeupdate", this.time);
                    }).catch(e => {
                        this.stop();
                    });
                });
            }
        }
    }

    class WSPlayer {

        constructor(node, node_h265, opts) {
            if (typeof node == typeof '') {
                this.player = document.getElementById(node);
            } else {
                this.player = node;
            }
            if (typeof node_h265 == typeof '') {
                this.player_h265 = document.getElementById(node_h265);
            } else {
                this.player_h265 = node_h265;
            }

            this.canvasPlayer = null;

            let modules = opts.modules || {
                client: RTPClient,
                transport: {
                    constructor: WebsocketTransport
                }
            };
            this.isStart = false;
            this.errorHandler = opts.errorHandler || null;
            this.queryCredentials = opts.queryCredentials || null;
            this.initHandler = (isH265) => {
                if (isH265) {

                    this.player.pause();
                    this.player.style.display = "none";

                    this.player_h265.style.display = "";
                    this.canvasPlayer = new CanvasPlayer(this.player_h265, this.seekable());

                    this.canvasPlayer.attachTransport(this.transport);
                    this.transport.set_h265_handler(this.canvasPlayer);

                    if (this.playHandler) this.canvasPlayer.addSelfListener("play", this.playHandler);
                    if (this.pauseHandler) this.canvasPlayer.addSelfListener("pause", this.pauseHandler);
                    if (this.stopHandler) this.canvasPlayer.addSelfListener("stop", this.stopHandler);
                    if (this.playTimeChangedHandler) this.canvasPlayer.addSelfListener("timeupdate", this.playTimeChangedHandler);

                    this.canvasPlayer.start();
                } else {
                    this.player_h265.style.display = "none";

                    if (this.playHandler) this.player.addEventListener("play", this.playHandler);
                    if (this.pauseHandler) this.player.addEventListener("pause", this.pauseHandler);
                    if (this.stopHandler) this.player.addEventListener("stop", this.stopHandler);
                    if (this.playTimeChangedHandler) this.player.addEventListener("timeupdate", this.playTimeChangedHandler);

                    this.player.style.display = "";
                    this.player.play();
                }
            };

            this.modules = {};
            for (let module of modules) {
                let transport = module.transport || WebsocketTransport;
                let client = module.client || RTPClient;
                if (StreamType$1.isSupported(client.streamType())) {
                    this.modules[client.streamType()] = {
                        client: client,
                        transport: transport
                    };
                } else {
                    Log$11.warn(`Client stream type ${client.streamType()} is incompatible with transport types [${transport.streamTypes().join(', ')}]. Skip`);
                }
            }

            this.type = StreamType$1.RTP;

            this.setSource(this.modules[this.type].transport.options, this.type);

            // this.player.addEventListener('play', () => {
            // if (!this.isPlaying()) {
            // this.client.play();
            // }
            // }, false);

            // this.player.addEventListener('pause', () => {
            // this.client.pause();
            // }, false);
        }

        // TODO: check native support

        isPlaying() {
            //return !(this.player.paused || this.client.paused);
            return !this.client.paused;
        }

        isDestroy() {
            return this.client && !this.remuxer;
        }

        static canPlayWithModules(mimeType, modules) {

            let filteredModules = {};
            for (let module of modules) {
                let transport = module.transport || WebsocketTransport;
                let client = module.client || RTPClient;
                if (StreamType$1.isSupported(client.streamType())) {
                    filteredModules[client.streamType()] = true;
                }
            }

            for (let type in filteredModules) {
                if (type == StreamType$1.fromMime(mimeType)) {
                    return true;
                }
            }
            return false;
        }

        /// TODO: deprecate it?
        static canPlay(resource) {
            return StreamType$1.fromMime(resource.type) || StreamType$1.fromUrl(resource.src);
        }

        canPlayUrl(src) {
            let type = StreamType$1.fromUrl(src);
            return (type in this.modules);
        }

        _checkSource(src) {
            if (!src.dataset['ignore'] && src.src && !this.player.canPlayType(src.type) && (StreamType$1.fromMime(src.type) || StreamType$1.fromUrl(src.src))) {
                this.url = src.src;
                this.type = src.type ? StreamType$1.fromMime(src.type) : StreamType$1.fromUrl(src.src);
                return true;
            }
            return false;
        }

        async setSource(opts, type) {
            if (this.transport) {
                if (this.client) {
                    await this.client.detachTransport();
                }
                await this.transport.destroy();
            }

            let transport = this.modules[type].transport;
            this.transport = new transport.constructor(this.endpoint, this.type, opts);

            if (this.initHandler) {
                this.transport.set_decodechanged_handler(this.initHandler);
            }

            let lastType = this.type;
            this.type = (StreamType$1.isSupported(type) ? type : false) || StreamType$1.fromMime(type);
            if (!this.type) {
                throw new Error("Bad stream type");
            }

            if (lastType != this.type || !this.client) {
                if (this.client) {
                    await this.client.destroy();
                }
                let client = this.modules[type].client;
                this.client = new client();
            } else {
                this.client.reset();
            }

            if (this.queryCredentials) {
                this.client.queryCredentials = this.queryCredentials;
            }
            if (this.remuxer) {
                this.remuxer.destroy();
                this.remuxer = null;
            }
            this.remuxer = new Remuxer(this.player);
            this.remuxer.attachClient(this.client);

            this.client.attachTransport(this.transport);
            this.client.setSource(this.endpoint);

            if (this.player.autoplay) {
                this.start();
            }
        }

        start() {
            if (this.client && this.transport) {
                this.transport.ready.then(() => {
                    this.isStart = true;
                    this.client.start().catch((e) => {
                        this.isStart = false;
                        if (this.errorHandler) {
                            this.destroy();
                            this.errorHandler(e);
                        }
                    });
                });
            }
        }

        play() {
            if (this.isStart) {
                if (this.canvasPlayer) {
                    this.canvasPlayer.play();
                }
                this.client.play();
                if (this.playHandler)
                    this.playHandler();
                //if (!this.canvasPlayer)
                //this.player.play();
            } else if (this.client) {
                this.start();
            }
        }

        pause() {
            if (this.client) {
                if (this.canvasPlayer) {
                    this.canvasPlayer.pause();
                }
                this.client.pause();
                if (this.pauseHandler)
                    this.pauseHandler();
                //if (!this.canvasPlayer)
                //this.player.pause();
            }
        }

        stop() {
            if (this.client) {
                this.client.stop();
            }
            if (this.canvasPlayer) {
                this.canvasPlayer.stop();
                this.canvasPlayer.destroy();
            }
        }

        seek(range) {
            if (this.seekable()) {
                if (this.canvasPlayer) {
                    this.canvasPlayer.seek(range);
                } else if (this.client) {
                    this.client.seek(range);
                }
            }
        }

        seekable() {
            if (this.client && this.client.seekable && this.client.sdp && this.client.sdp.sessionBlock) {
                return this.client.sdp.sessionBlock.range;
            }
            return null;
        }

        getTime() {
            if (this.canvasPlayer) {
                if (this.canvasPlayer.time)
                    return this.canvasPlayer.time / 1000;
                else
                    return 0;
            } else {
                return this.player.currentTime;
            }
        }

        async destroy() {
            this.stop();
            this.isStart = false;
            if (this.transport) {
                if (this.client) {
                    await this.client.detachTransport();
                }
                await this.transport.destroy();
            }
            if (this.client) {
                await this.client.destroy();
            }
            if (this.remuxer) {
                this.remuxer.destroy();
                this.remuxer = null;
            }

            this.playHandler = null;
            this.pauseHandler = null;
            this.stopHandler = null;
            this.playTimeChangedHandler = null;
        }

        set_disconnect_handler(handler) {
            if (this.transport) {
                this.transport.set_disconnect_handler(handler);
            }
        }

        set_play_handler(handler) {
            this.playHandler = handler;
            //if (this.canvasPlayer)
            //    this.canvasPlayer.addSelfListener("play", handler);
            //else
            //    this.player.addEventListener("play", handler);
        }

        set_pause_handler(handler) {
            this.pauseHandler = handler;
            //if (this.canvasPlayer)
            //    this.canvasPlayer.addSelfListener("pause", handler);
            //else
            //    this.player.addEventListener("pause", handler);
        }

        set_stop_handler(handler) {
            this.stopHandler = handler;
            //if (this.canvasPlayer)
            //    this.canvasPlayer.addSelfListener("stop", handler);
            //else
            //    this.player.addEventListener("stop", handler);
        }

        set_playtimechanged_handler(handler) {
            this.playTimeChangedHandler = handler;
            //if (this.canvasPlayer)
            //    this.canvasPlayer.addSelfListener("timeupdate", handler);
            //else
            //    this.player.addEventListener("timeupdate", handler);
        }
    }

    setDefaultLogLevel(LogLevel.Error);
    getTagged("transport:ws").setLevel(LogLevel.Error);
    getTagged("client:rtp").setLevel(LogLevel.Warn);
    getTagged("mse").setLevel(LogLevel.Warn);

    window.Streamedian = {
        logger(tag) {
            return getTagged(tag)
        },
        player(node, opts, node_h265) {
            if (!opts.socket) {
                throw new Error("socket parameter is not set");
            }

            let _options = {
                modules: [
                    {
                        client: RTPClient,
                        transport: {
                            constructor: WebsocketTransport,
                            options: {
                                socket: opts.socket
                            }
                        }
                    }
                ],
                errorHandler(e) {
                    alert(`Failed to start player: ${e.message}`);
                },
                queryCredentials(client) {
                    return new Promise((resolve, reject) => {
                        let c = prompt('input credentials in format user:password');
                        if (c) {
                            client.setCredentials.apply(client, c.split(':'));
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            };

            if (opts.id) {
                _options.modules[0].transport.options.id = opts.id;
            }
            if (opts.rtspUrll) {
                _options.modules[0].transport.options.rtsp = opts.rtspUrll;
            }
            if (opts.starttime) {
                _options.modules[0].transport.options.starttime = opts.starttime;
            }

            return new WSPlayer(node, node_h265, _options);
        }
    };

}());
//# sourceMappingURL=streamedian.min.js.map
