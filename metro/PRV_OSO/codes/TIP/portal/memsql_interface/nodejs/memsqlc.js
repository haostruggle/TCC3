const events = require('events');
const emitter = new events.EventEmitter();
const binproto = require('./binproto');
const protocol = require('./protocol');
const log4js = require('log4js');
log4js.configure("./memsqllog.json");
const logInfo = log4js.getLogger('logInfo');
const net = require('net');

class NetThread{
    constructor(){
        this.is_running = false;
    }
    set_req_and_resp(req,resp){
        this.req = req;
        this.resp = resp;
    };

    run(sock){
        let client = sock;
        this.is_running = true;
        let reppack = this.req.serialize_to_buffer();
        let buf = Buffer.from(reppack);
        logInfo.info("write data:" + buf);
        client.write(reppack);
    }

    check(resdata){
            let data = resdata;
            logInfo.info('reveive data:' + data);
            let head = protocol.pack_head();
            let buflen = 0;
            let tmpbuf = Buffer.alloc(data.length);
        try {
            tmpbuf.fill(0);
            while (this.is_running === true) {
                if (data.length != 0) {
                    data.copy(tmpbuf, 0, 0);
                }
                if (head.len.geted() === 0) {
                    if (tmpbuf.length >= 4) {
                        head.len.parse_from_buffer(tmpbuf);
                    }
                }
                if (tmpbuf.length >= head.len.geted() + head.len.get_binary_len()) {
                    buflen = tmpbuf.length;
                    break;
                }
            }
        }
        catch (e){
                logInfo.error('Connection broken, please restart program and reconnect:' + e);
            }

        if (this.is_running === true) {
            logInfo.info('Parsing response received from memsql');
            try {
                if(tmpbuf[4] === protocol.response_type().PUB) {
                    let objcount = 0;
                    let resplist = [];
                    let totalnum = tmpbuf.length;
                    while (totalnum > 10){
                        this.resp = protocol.pack_pub_response();
                        let chitem = tmpbuf[3]*1;
                        this.resp.parse_from_buffer(tmpbuf.slice(0 ,chitem+4));
                        let tmp = this.resp;
                        resplist.push(tmp);
                        tmpbuf = tmpbuf.slice(chitem+4);
                        totalnum = tmpbuf.length;
                        objcount++;
                    }
                    logInfo.info('Parsing response success :'+ objcount + 'objs');
                    return resplist;
                }
                else
                {
                    this.resp.parse_from_buffer(tmpbuf);

                    let objcount = 1;
                    if (this.resp.head.typed.geted() === protocol.response_type().FGET || this.resp.head.typed.geted() === protocol.response_type().MGET
                        || this.resp.head.typed.geted() === protocol.response_type().FSUB || this.resp.head.typed.geted() === protocol.response_type().MSUB) {
                        objcount = this.resp.dp_list.mutiable_list().length;
                    } else if (this.resp.head.typed.geted() === protocol.response_type().MSET || this.resp.head.typed.geted() === protocol.response_type().MDEL) {
                        objcount = this.resp.ret_list.mutiable_list().length
                    }
                    logInfo.info('Parsing response success :' + buflen + 'bytes' + objcount + 'objs');
                }
            }
            catch(e)
            {
                logInfo.error('check function catch an error:' + e);
            }
        }
        else {
            logInfo.error('Action has been canceled');
        }
        return this.resp;
    };
    datadel(){
        this.is_running = false;
    }
}

class AddAllThread{
    constructor(){
        this.is_running = false;
        this.resp = '';
        this.dataindex = 0;
        this.retmap = [];
    }

    set_resp_and_index(resp, index){
        this.resp = resp;
        this.dataindex = index;
    };

    run(){
        this.is_running = true;
        if(this.resp.head.typed.geted() === protocol.response_type().FGET || this.resp.head.typed.geted() === protocol.response_type().MGET || this.resp.head.typed.geted() === protocol.response_type().SGET){
            while(this.is_running){
                if(this.dataindex === this.resp.dp_list.mutiable_list().length)
                    break;
                else{
                    let dp = this.resp.dp_list.mutiable_list()[this.dataindex];
                    let strtype = '';
                    let strvalue = '';
                    if(dp.value.typed.get() === protocol.pack_data_type().UNSIGNED){
                        strtype = 'UNSIGNED';
                        strvalue = dp.value.get_unsigned().toString;
                    }
                    else if(dp.value.typed.get() === protocol.pack_data_type().NUMBER){
                        strtype = 'NUMBER';
                        strvalue = dp.value.get_number().toString;
                    }
                    else if(dp.value.typed.get() === protocol.pack_data_type().FLOAT){
                        strtype = 'FLOAT';
                        strvalue = dp.value.get_float().toString;
                    }
                    else if(dp.value.typed.get() === protocol.pack_data_type().STRING){
                        strtype = 'STRING';
                        strvalue = dp.value.get_string();
                    }
                    else if(dp.value.typed.get() === protocol.pack_data_type().EMPTY){
                        strtype = 'NOT EXISTED';
                        strvalue = 'NOT EXISTED';
                    }
                    emitter.emit("ADD_DATA",dp.name.get(),strtype,strvalue);
                    this.dataindex =  this.dataindex +1;
                }
            }
        }
        else {
            if(this.resp.head.typed.geted() === protocol.response_type.SSET|| this.resp.head.typed.geted() === protocol.response_type.MSET){
                this.retmap = [];
                this.retmap.push('SET_FAILED');
                this.retmap.push('SET_UPDATE');
                this.retmap.push('SET_ADD');
                this.retmap.push('SET_DENIED');
            }
            else {
                this.retmap = [];
                this.retmap.push('DEL_FAILED');
                this.retmap.push('DEL_SUCCESS');
                this.retmap.push('DEL_DENIED');
            }
            while (this.is_running){
                if(this.dataindex === this.resp.ret_list.mutiable_list().length){
                    break;
                }
                else{
                    let ret = this.resp.ret_list.mutiable_list()[this.dataindex];
                    emitter.emit("ADD_RET",ret.name.get(),this.retmap[ret.value.get()]);
                    this.dataindex =  this.dataindex +1;
                }
            }
        }
        emitter.emit('ADDALL_RETURN');
    };

    datadel(){
        this.is_running = false;
        this.dataindex = 0;
        this.max = 0;
    }
}

class msqlc {
    constructor() {
        this.resp = '';
        this.req = '';
        this.itemlist = [];
        this.dataindex = 0;
        this.add_worker = new AddAllThread();
        // emitter.addListener('ADD_RET', function(name,ret){
        //     let tmplist = [];
        //     tmplist.push(name);
        //     tmplist.push(ret);
        //     this.itemlist.push(tmplist);
        // });
        // emitter.addListener('ADD_DATA', function(key,type,value){
        //     let tmplist = [];
        //     tmplist.push(key);
        //     tmplist.push(type);
        //     tmplist.push(value);
        //     this.itemlist.push(tmplist);
        // });
    }
    set_resp(resp){
        this.resp = resp;
    };

    clear(){
        this.itemlist = [];
    }

    stop(){
        this.resp = '';
        this.req = '';
        this.itemlist = [];
        this.dataindex = 0;
        delete this.add_worker;
    }

    memrun(msg) {
        let name = '';
        let tmpname = '';
        let msglen = msg.length;

        if(msg[0] === 'SSET'){
            if(msglen != 4){
                logInfo.error('Command Error,count of parameters for sset must be 3 !!!');
                return;
            }
            this.resp = protocol.pack_sset_response();
            this.resp.head.typed.seted( protocol.request_type().SSET);
            this.req = protocol.pack_sset_request();
            this.req.head.typed.seted( protocol.request_type().SSET);
            this.req.head.tag.seted("memsqlc");
            this.req.datapoint.name.seted(msg[1]);
            try{
                switch(msg[2]) {
                    case 'S':
                        this.req.datapoint.value.set_string(msg[3]);
                        break;
                    case 'U':
                        this.req.datapoint.value.set_unsigned(+msg[3]);
                        break;
                    case 'N':
                        this.req.datapoint.value.set_number(msg[3]);
                        break;
                    case 'F':
                        this.req.datapoint.value.set_float(msg[3]);
                        break;
                    default:
                        logInfo.error('Command Error, Unknown data typed !!!');
                        return;
                }
            }
            catch (e){
                logInfo.error('Command Error, the value do not match the typed !!!');
                return;
            }
        }
        else if(msg[0] === 'SDEL'){
            if(msglen != 2){
                logInfo.error('Command Error,count of parameters for sdet must be 1 !!!');
                return ;
            }
            this.resp = protocol.pack_sset_response();
            this.req = protocol.pack_sdel_request();
            this.req.head.typed.seted( protocol.request_type().SDEL);
            this.req.head.tag.seted("memsqlc");
            this.req.name.seted(msg[1])
        }
        else if(msg[0] === 'SGET'){
            if(msglen != 2){
                logInfo.error('Command Error,count of parameters for sget must be 1 !!!');
                return ;
            }
            this.resp = protocol.pack_sset_request();
            this.req = protocol.pack_sdel_request();
            this.req.head.typed.seted(protocol.request_type().SGET);
            this.req.head.tag.seted("memsqlc");
            this.req.name.seted(msg[1])
        }
        else if(msg[0] === 'FGET'){
            if(msglen === 1){
                logInfo.error('Command Error,count of parameters for fget can not be 0 !!!');
                return ;
            }
            this.resp = protocol.pack_mset_request();
            this.req = protocol.pack_fsub_request();
            this.req.head.typed.seted(protocol.request_type().FGET);
            this.req.head.tag.seted("memsqlc");
            for(let i = 1; i < msglen; i++)
            {
                name = msg[i];
                tmpname = binproto.variable_len_string(2);
                tmpname.seted(name);
                this.req.name_list.mutiable_list().push(tmpname);
            }
        }
        else if(msg[0] === 'MDEL'){
            if(msglen === 1){
                logInfo.error('Command Error,count of parameters for mdet can not be 0 !!!');
                return ;
            }
            this.resp = protocol.pack_mset_response();
            this.req = protocol.pack_fsub_request();
            this.req.head.typed.seted( protocol.request_type().MDEL);
            this.req.head.tag.seted("memsqlc");
            for(let i = 1; i < msglen; i++)
            {
                name = msg[i];
                tmpname = binproto.variable_len_string(2);
                tmpname.seted(name);
                this.req.name_list.mutiable_list().push(tmpname);
            }
        }
        else if(msg[0] === 'MGET'){
            if(msglen === 1){
                logInfo.error('Command Error,count of parameters for mget can not be 0 !!!');
                return ;
            }
            this.resp = protocol.pack_mset_request();
            this.req = protocol.pack_fsub_request();
            this.req.head.typed.seted( protocol.request_type().MGET);
            this.req.head.tag.seted("memsqlc");
            for(let i = 1; i < msglen; i++)
            {
                name = msg[i];
                tmpname = binproto.variable_len_string(2);
                tmpname.seted(name);
                this.req.name_list.mutiable_list().push(tmpname);
            }
        }
        else if(msg[0] === 'MSET') {
            if (msglen === 1) {
                logInfo.error('Command Error,count of parameters for mset can not be 0 !!!');
                return;
            }
            else if((msglen-1)%3 !=0){
                logInfo.error('Command Error,count of parameters for mset must be multiple of 3 !!!');
                return;
            }
            this.resp = protocol.pack_mset_response();
            this.req = protocol.pack_mset_request();
            this.req.head.typed.seted(protocol.request_type().MSET);
            this.req.head.tag.seted("memsqlc");
            let datapoint;
            try{
                for(let i = 0; i < (msg.length-1)/3; i++){
                    datapoint = protocol.pack_data_point();
                    datapoint.name.seted(msg[i*3+1]);
                    switch(msg[i*3+2]) {
                        case 'S':
                            datapoint.value.set_string(msg[i * 3 + 3]);
                            break;
                        case 'U':
                            datapoint.value.set_unsigned(msg[i * 3 + 3]);
                            break;
                        case 'N':
                            datapoint.value.set_number(msg[i * 3 + 3]);
                            break;
                        case 'F':
                            datapoint.value.set_float(msg[i * 3 + 3]);
                            break;
                        default:
                            logInfo.error('Command Error, Unknown data typed !!!');
                            return;
                    }
                    this.req.dp_list.mutiable_list().push(datapoint);
                }
            }
            catch (e){
                logInfo.error('Command Error, the value do not match the typed !!!');
                return;
            }
        }
        else if(msg[0] === 'FSUB') {
            if(msglen === 1){
                logInfo.error('Command Error,count of parameters for fsub can not be 0 !!!');
                return ;
            }
            this.resp = protocol.pack_mset_request();
            this.req = protocol.pack_fsub_request();
            this.req.head.typed.seted(protocol.request_type().FSUB);
            this.req.head.tag.seted("memsqlc");
            for(let i = 1; i < msglen; i++)
            {
                name = msg[i];
                tmpname = binproto.variable_len_string(2);
                tmpname.seted(name);
                this.req.name_list.mutiable_list().push(tmpname);
            }
        }
        else if(msg[0] === 'MSUB') {
            if(msglen === 1){
                logInfo.error('Command Error,count of parameters for msub can not be 0 !!!');
                return ;
            }
            this.resp = protocol.pack_mset_request();
            this.req = protocol.pack_fsub_request();
            this.req.head.typed.seted(protocol.request_type().MSUB);
            this.req.head.tag.seted("memsqlc");
            for(let i = 1; i < msglen; i++)
            {
                name = msg[i];
                tmpname = binproto.variable_len_string(2);
                tmpname.seted(name);
                this.req.name_list.mutiable_list().push(tmpname);
            }
        }
        else{
            logInfo.error('Command Error, Unknown Command !!!');
            return;
        }
        this.req.head.len.seted(this.req.get_binary_len() - this.req.head.len.get_binary_len());
        return [this.req,this.resp]
    }

    memresp(){
        let last_index = 0;
        let strtype = '';
        let strvalue = '';
        if(this.resp.head.typed.geted() === protocol.response_type().SGET){
            this.max = 1;
            if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().UNSIGNED){
                strtype = 'UNSIGNED';
                strvalue = (this.resp.datapoint.value.get_unsigned());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().NUMBER){
                strtype = 'NUMBER';
                strvalue = (this.resp.datapoint.value.get_number());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().FLOAT){
                strtype = 'FLOAT';
                strvalue = (this.resp.datapoint.value.get_float());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().STRING){
                strtype = 'STRING';
                strvalue = this.resp.datapoint.value.get_string();
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().EMPTY){
                strtype = 'NOT EXIST';
                strvalue = 'NOT EXIST';
            }
            this.tableadd(this.resp.datapoint.name.geted(),strtype,strvalue);
            this.dataindex = this.dataindex + 1;
        }
        else if(this.resp.head.typed.geted() === protocol.response_type().SDEL || this.resp.head.typed.geted() === protocol.response_type().SSET){
            this.max = 1;
            if(this.resp.head.typed.geted() === protocol.response_type().SSET || this.resp.head.typed.geted() === protocol.response_type().MSET){
                this.retmap = [];
                this.retmap.push('SET_FAILED');
                this.retmap.push('SET_UPDATE');
                this.retmap.push('SET_ADD');
                this.retmap.push('SET_DENIED');
            }
            else {
                this.retmap = [];
                this.retmap.push('DEL_FAILED');
                this.retmap.push('DEL_SUCCESS');
                this.retmap.push('DEL_DENIED');
            }
            this.tableret(this.resp.ret.name.geted(),this.retmap[this.resp.ret.value.geted()]);
            this.dataindex = this.dataindex + 1;
        }
        else if(this.resp.head.typed.geted() === protocol.response_type().FGET ||  this.resp.head.typed.geted() === protocol.response_type().MGET
        || this.resp.head.typed.geted() === protocol.response_type().FSUB ||  this.resp.head.typed.geted() === protocol.response_type().MSUB){
            this.max = (this.resp.dp_list.mutiable_list()).length;
            last_index = this.dataindex;
            while(this.dataindex < this.max && this.dataindex - last_index < 100000){
                let dp = this.resp.dp_list.mutiable_list()[this.dataindex];
                strtype = '';
                strvalue = '';
                if(dp.value.typed.geted() === protocol.pack_data_type().UNSIGNED){
                    strtype = 'UNSIGNED';
                    strvalue = dp.value.get_unsigned();
                }
                else if(dp.value.typed.geted() === protocol.pack_data_type().NUMBER){
                    strtype = 'NUMBER';
                    strvalue = dp.value.get_number();
                }
                else if(dp.value.typed.geted() === protocol.pack_data_type().FLOAT){
                    strtype = 'FLOAT';
                    strvalue = dp.value.get_float();
                }
                else if(dp.value.typed.geted() === protocol.pack_data_type().STRING){
                    strtype = 'STRING';
                    strvalue = dp.value.get_string();
                }
                else if(dp.value.typed.geted() === protocol.pack_data_type().EMPTY){
                    strtype = 'NOT EXIST';
                    strvalue = 'NOT EXIST';
                }
                this.tableadd(dp.name.geted(),strtype,strvalue);
                this.dataindex = this.dataindex + 1;
            }
        }
        else if(this.resp.head.typed.geted() === protocol.response_type().PUB){
            this.max = 1;

            if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().UNSIGNED){
                strtype = 'UNSIGNED';
                strvalue = (this.resp.datapoint.value.get_unsigned());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().NUMBER){
                strtype = 'NUMBER';
                strvalue = (this.resp.datapoint.value.get_number());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().FLOAT){
                strtype = 'FLOAT';
                strvalue = (this.resp.datapoint.value.get_float());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().STRING){
                strtype = 'STRING';
                strvalue = this.resp.datapoint.value.get_string();
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().EMPTY){
                strtype = 'NOT EXIST';
                strvalue = 'NOT EXIST';
            }
            this.tableadd(this.resp.datapoint.name.geted(),strtype,strvalue);
            this.dataindex = this.dataindex + 1;
        }
        else{
            if(this.resp.head.typed.geted() === protocol.response_type().SSET ||  this.resp.head.typed.geted() === protocol.response_type().MSET){
                this.retmap = [];
                this.retmap.push('SET_FAILED');
                this.retmap.push('SET_UPDATE');
                this.retmap.push('SET_ADD');
                this.retmap.push('SET_DENIED');
            }
            else {
                this.retmap = [];
                this.retmap.push('DEL_FAILED');
                this.retmap.push('DEL_SUCCESS');
                this.retmap.push('DEL_DENIED');
            }
            this.max = (this.resp.ret_list.mutiable_list()).length;
            last_index = this.dataindex;
            while(this.dataindex < this.max && this.dataindex - last_index < 100000){
                let ret = this.resp.ret_list.mutiable_list()[this.dataindex];
                this.tableret(ret.name.geted(),this.retmap[ret.value.geted()]);
                this.dataindex = this.dataindex + 1;
            }
        }
    }

    pubresp(msg, index){
        this.resp = msg;
        this.dataindex = index;

        let last_index = 0;
        let strtype = '';
        let strvalue = '';

        if(this.resp.head.typed.geted() === protocol.response_type().PUB){
            this.max = 1;

            if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().UNSIGNED){
                strtype = 'UNSIGNED';
                strvalue = (this.resp.datapoint.value.get_unsigned());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().NUMBER){
                strtype = 'NUMBER';
                strvalue = (this.resp.datapoint.value.get_number());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().FLOAT){
                strtype = 'FLOAT';
                strvalue = (this.resp.datapoint.value.get_float());
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().STRING){
                strtype = 'STRING';
                strvalue = this.resp.datapoint.value.get_string();
            }
            else if(this.resp.datapoint.value.typed.geted() === protocol.pack_data_type().EMPTY){
                strtype = 'NOT EXIST';
                strvalue = 'NOT EXIST';
            }
            this.tableadd(this.resp.datapoint.name.geted(),strtype,strvalue);
            this.dataindex = this.dataindex + 1;
        }
        else{
            logInfo.error('memsqlc has pub a bad data');
        }
    }

    tableret(name,ret){
        let tmplist = [];
        tmplist.push(name.toString());
        tmplist.push(ret);
        this.itemlist.push(tmplist);
    }

    tableadd(name,typed,value){
        let tmplist = [];
        tmplist.push(name.toString());
        tmplist.push(typed);
        tmplist.push(value);
        this.itemlist.push(tmplist);
    }

}

let th_fun = function (ip,port,msg,io) {
    const client = new net.Socket({
        readable:true,
        writable:true,
        allowHalfOpen:true
    });
    const net_worker = new NetThread();
    const sock = new msqlc();
    let relist = [];
    client.connect({
        host:ip,
        port:port
    },function(){
        let command = msg.replace('\n',' ');
        command = msg.replace('\t',' ');
        command = msg.replace('\xe2\x80\xa9',' ');
        let arr = command.split(' ');
        relist = sock.memrun(arr);
        net_worker.set_req_and_resp(relist[0],relist[1]);
        net_worker.run(client);
    });
    let run_flag = true;
    let total = 0;
    let buff = Buffer.from('');
    client.on('data',function(data){

        let buf = Buffer.from(data);
        if (run_flag === true) {
            if(buff.length > 0)
            {
                buf = Buffer.concat([buff, buf], buf.length + buff.length);//如果buff有遗留数据，判断为上次尾部的不完整包，要与本次包组合
                total = buf.slice(0, 4).readUInt32BE(0); //读取新包的头部数据
            }
            else {
                total = buf.slice(0, 4).readUInt32BE(0);
            }
            run_flag = false;
        }
       // let buflen = buf.length + buff.length;
        if(buff.length === 0)
        {
            buff = buf;
        }
        else {
            let totalbuf = Buffer.concat([buff, buf], buf.length + buff.length);
            buff = Buffer.from(totalbuf);
        }

        if (buff.length >= total) {

            if (buff[4] === protocol.response_type().PUB) {
                let strbuf = buff;   //临时存放的buff
                let temnum = buff.slice(0,4).readUInt32BE(0); //获得buff中第一个包的字节数
                while(buff.length > 4)      //当buff中还有数据时就继续循环
                {
                    buff = buff.slice(temnum+4, buff.length); //获取除去第一个完整包的数据
                    if(buff.length < temnum + 3)
                        break;
                    temnum = buff.slice(0,4).readUInt32BE(0);//读取新包的字节数，如果buff的长度少于temnum+4，则判断剩下的buff不是一个完整的包
                }
                strbuf = strbuf.slice(0,strbuf.length - buff.length); //如果存在buf，则截图完整的包，将不完整的包除去
                let resp_list = net_worker.check(strbuf);
                for (let i = 0; i < resp_list.length; i++) {
                    sock.pubresp(resp_list[i], 1);
                }
                io.emit('chat message', sock.itemlist);
                sock.itemlist = [];
                console.log(strbuf.length);
                total = 0;
                run_flag = true;
            }
            else {
                sock.set_resp(net_worker.check(buff));
                sock.memresp();
                io.emit('chat message', sock.itemlist);
                // for(let i = 0; i < sock.itemlist.length; i++){
                //         io.emit('chat message', sock.itemlist[i]);
                // }
                sock.itemlist = [];
                console.log(buff.length);
                total = 0;
                buff = '';
                run_flag = true;
            }
        }
    });
    client.on('error',function (err) {
        console.log(err);
    });
};

module.exports.th_fun = function(client,ip,port,msg) {
    return th_fun(client,ip,port,msg);
};

module.exports.msqlc = function() {
    return new msqlc();
};

module.exports.AddAllThread = function() {
    return new AddAllThread();
};

module.exports.NetThread = function() {
    return new NetThread();
};