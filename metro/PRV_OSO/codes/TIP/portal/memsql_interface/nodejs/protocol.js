const binproto = require("./binproto");
const log4js = require('log4js');
log4js.configure("./memsqllog.json");
const logInfo = log4js.getLogger('logInfo');

class pack_data_type{
    constructor(){
        this.EMPTY = 0;
        this.UNSIGNED = 1;
        this.NUMBER = 2;
        this.FLOAT = 3;
        this.STRING = 4;
    }
}

class request_type{
    constructor(){
        this.SGET = 1;
        this.SSET = 2;
        this.SDEL = 3;
        this.FGET = 11;
        this.FSUB = 14;
        this.MGET = 21;
        this.MSET = 22;
        this.MDEL = 23;
        this.MSUB = 24;
    }

}

class response_type{
    constructor(){
        this.SGET = 1;
        this.SSET = 2;
        this.SDEL = 3;
        this.FGET = 11;
        this.FSUB = 14;
        this.MGET = 21;
        this.MSET = 22;
        this.MDEL = 23;
        this.MSUB = 24;
        this.PUB = 30;
    }

}

class pub_type{
    constructor(){
        this.PUB_UPDATE = 1;
        this.PUB_ADD = 2;
        this.PUB_DELETE = 3;
    }
}

class del_type{
    constructor(){
        this.DEL_FAILED = 0;
        this.DEL_SUCCESS = 1;
        this.DEL_DENIED = 255;
    }
}

class set_type{
    constructor(){
        this.SET_FAILED = new del_type().DEL_FAILED;
        this.SET_UPDATE = new pub_type().PUB_UPDATE;
        this.SET_ADD = new pub_type().PUB_ADD;
        this.SET_DENIED = new del_type().DEL_DENIED;
    }
}

//basic typed defination
class pack_ret_t{
    constructor()
    {
        this.name = binproto.variable_len_string(2);
        this.value = binproto.Suint_obj(1);
    }

    serialize_to_buffer(){
        return Buffer.from(this.name.serialize_to_buffer() + Buffer.from(this.value.serialize_to_buffer()));
    };

    parse_from_buffer(buf, index){
        if (index === undefined) {
            index = 0;
        }
        index = this.name.parse_from_buffer(buf,index);
        index = this.value.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.name.get_binary_len();
        tmplen = tmplen + this.value.get_binary_len();
        return tmplen;
    };
}

class pack_data_value{
    constructor(){
        this.typed =  binproto.Suint_obj(1);
        this.typed.seted(new pack_data_type().EMPTY);
        this.data =  binproto.variable_len_string(2);
    }

    set_unsigned(u) {
        let pbuf = Buffer.alloc(4);
        pbuf.fill(0);
        pbuf.writeUInt32BE(u,0);
        this.typed.seted(new pack_data_type().UNSIGNED);
        this.data.seted(pbuf.slice(0,4));
    };

    set_number(i) {
        let pbuf = Buffer.alloc(4);
        pbuf.fill(0);
        pbuf.writeInt32BE(i, 0);
        this.typed.seted(new pack_data_type().NUMBER);
        this.data.seted(pbuf.slice(0,4));
    };

    set_float(f) {
        let pbuf = Buffer.alloc(4);
        pbuf.fill(0);
        pbuf.write(f);
        this.typed.seted(new pack_data_type().FLOAT);
        this.data.seted(pbuf.slice(0,4));
    };

    set_string(s) {
        let pbuf = Buffer.alloc(8);
        pbuf.fill(0);
        pbuf.write(s);
        this.typed.seted(new pack_data_type().STRING);
        this.data.seted(pbuf.slice(0,s.length));
    };

    set_empty() {
        this.typed.seted(new pack_data_type().EMPTY);
        this.data.seted('')
    };

    get_type() {
        return this.typed.geted();
    };

    get_unsigned() {
        return (this.data.geted()).readUIntBE(0,4);
    };

    get_number() {
        return (this.data.geted()).readIntBE(0,4);
    };

    get_float() {
        return (this.data.geted()).toString();
    };

    get_string() {
        return this.data.geted().toString();
    };

    serialize_to_buffer(){
        let buf = Buffer.alloc( this.typed.serialize_to_buffer().length + this.data.serialize_to_buffer().length);
        this.typed.serialize_to_buffer().copy(buf,0,0);
        this.data.serialize_to_buffer().copy(buf,this.typed.serialize_to_buffer().length,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.typed.parse_from_buffer(buf,index);
        index = this.data.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.typed.get_binary_len();
        tmplen = tmplen + this.data.get_binary_len();
        return tmplen;
    };
}

class pack_data_point{
    constructor(){
        this.name = binproto.variable_len_string(2);
        this.value = new pack_data_value();
    }

    serialize_to_buffer(){
        let buf = Buffer.alloc( this.name.serialize_to_buffer().length + this.value.serialize_to_buffer().length);
        this.name.serialize_to_buffer().copy(buf,0,0);
        this.value.serialize_to_buffer().copy(buf,this.name.serialize_to_buffer().length,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.name.parse_from_buffer(buf,index);
        index = this.value.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.name.get_binary_len();
        tmplen = tmplen + this.value.get_binary_len();
        return tmplen;
    };
}


class pack_head{

    constructor(){
        this.typed = binproto.Suint_obj(1);
        this.len = binproto.Suint_obj(4);
        this.tag = binproto.fixed_len_string(8);
    }

    serialize_to_buffer(){
        let len1 = this.len.serialize_to_buffer().length;
        let len2 = this.typed.serialize_to_buffer().length;
        let len3 = this.tag.serialize_to_buffer().length;
        let buf = Buffer.alloc(len1 + len2 + len3);
        buf.fill(0);
        this.len.serialize_to_buffer().copy(buf,0,0);
        this.typed.serialize_to_buffer().copy(buf,len1,0);
        this.tag.serialize_to_buffer().copy(buf,len1 + len2,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.len.parse_from_buffer(buf,index);
        index = this.typed.parse_from_buffer(buf,index);
        index = this.tag.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        return this.len.get_binary_len() + this.typed.get_binary_len() + this.tag.get_binary_len();
    };
}

//request typed defination


class pack_sdel_request{
    constructor(){
        this.head = new pack_head();
        this.name = binproto.variable_len_string(2);
    }

    serialize_to_buffer(){
        return Buffer.from(this.head.serialize_to_buffer() + this.name.serialize_to_buffer());
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.head.parse_from_buffer(buf,index);
        index = this.name.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.head.get_binary_len();
        tmplen = tmplen + this.name.get_binary_len();
        return tmplen;
    };
}

class pack_sset_request{
    constructor(){
        this.head = new pack_head();
        this.datapoint = new pack_data_point();
    }

    serialize_to_buffer(){
        let buf = Buffer.alloc( this.head.serialize_to_buffer().length + this.datapoint.serialize_to_buffer().length);
        Buffer.from(this.head.serialize_to_buffer()).copy(buf,0,0);
        this.datapoint.serialize_to_buffer().copy(buf,this.head.serialize_to_buffer().length,0);
        return buf;
    };

    parse_from_buffer(buf, index){
        if (index === undefined) {
            index = 0;
        }
        index = this.head.parse_from_buffer(buf,index);
        index = this.datapoint.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.head.get_binary_len();
        tmplen = tmplen + this.datapoint.get_binary_len();
        return tmplen;
    };
}

class pack_fsub_request{
    constructor(){
        this.head = new pack_head();
        this.name_list = binproto.binary_obj_list( binproto.variable_len_string(2),4);
    }

    serialize_to_buffer(){
        let buf = Buffer.alloc( this.head.serialize_to_buffer().length + this.name_list.serialize_to_buffer().length);
        this.head.serialize_to_buffer().copy(buf,0,0);
        this.name_list.serialize_to_buffer().copy(buf,this.head.serialize_to_buffer().length,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.head.parse_from_buffer(buf,index);
        index = this.name_list.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.head.get_binary_len();
        tmplen = tmplen + this.name_list.get_binary_len();
        return tmplen;
    };
}


class pack_mset_request{
    constructor(){
        this.head = new pack_head();
        this.dp_list = binproto.binary_obj_list(pack_data_point,4);
    }

    serialize_to_buffer(){
        let buf = Buffer.alloc( this.head.serialize_to_buffer().length + this.dp_list.serialize_to_buffer().length);
        this.head.serialize_to_buffer().copy(buf,0,0);
        this.dp_list.serialize_to_buffer().copy(buf,this.head.serialize_to_buffer().length,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.head.parse_from_buffer(buf,index);
        index = this.dp_list.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.head.get_binary_len();
        tmplen = tmplen + this.dp_list.get_binary_len();
        return tmplen;
    };
}

//response typed defination
class pack_sset_response{
    constructor(){
        this.head = new pack_head();
        this.ret = new pack_ret_t();
    }

    serialize_to_buffer(){
        let buf = Buffer.alloc( this.head.serialize_to_buffer().length + this.ret.serialize_to_buffer().length);
        this.head.serialize_to_buffer().copy(buf,0,0);
        this.ret.serialize_to_buffer().copy(buf,this.head.serialize_to_buffer().length,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.head.parse_from_buffer(buf,index);
        index = this.ret.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.head.get_binary_len();
        tmplen = tmplen + this.ret.get_binary_len();
        return tmplen;
    };
}

class pack_mset_response{
    constructor(){
        this.head = new pack_head();
        this.ret_list = binproto.binary_obj_list(pack_ret_t,4);
    }

    serialize_to_buffer(){
        let buf = Buffer.alloc( this.head.serialize_to_buffer().length + this.ret_list.serialize_to_buffer().length);
        this.head.serialize_to_buffer().copy(buf,0,0);
        this.ret_list.serialize_to_buffer().copy(buf,this.head.serialize_to_buffer().length,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.head.parse_from_buffer(buf,index);
        index = this.ret_list.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        return this.head.get_binary_len() + this.ret_list.get_binary_len();
    };
}

class pack_pub_response{
    constructor(){
        this.head = new pack_head();
        this.pubtype =  binproto.Suint_obj(1);
        this.datapoint = new pack_data_point();
    }

    serialize_to_buffer(){
        let len1 = this.head.serialize_to_buffer().length;
        let len2 = this.pubtype.serialize_to_buffer().length;
        let len3 = this.datapoint.serialize_to_buffer().length;
        let buf = Buffer.alloc(len1 + len2 + len3);
        this.head.serialize_to_buffer().copy(buf,0,0);
        this.pubtype.serialize_to_buffer().copy(buf,len1,0);
        this.datapoint.serialize_to_buffer().copy(buf,len1 + len2,0);
        return buf;
    };

    parse_from_buffer(buf,index){
        if (index === undefined) {
            index = 0;
        }
        index = this.head.parse_from_buffer(buf,index);
        index = this.pubtype.parse_from_buffer(buf,index);
        index = this.datapoint.parse_from_buffer(buf,index);
        return index;
    };

    get_binary_len(){
        let tmplen = this.head.get_binary_len();
        tmplen = tmplen + this.pubtype.get_binary_len();
        tmplen = tmplen + this.datapoint.get_binary_len();
        return tmplen;
    };
}

module.exports.pack_data_type = function() {
    return new pack_data_type();
};
module.exports.request_type = function() {
    return new request_type();
};
module.exports.response_type = function() {
    return new response_type();
};
module.exports.pub_type = function() {
    return new pub_type();
};
module.exports.del_type = function() {
    return new del_type();
};
module.exports.set_type = function() {
    return new set_type();
};
module.exports.pack_ret_t = function() {
    return new pack_ret_t();
};
module.exports.pack_data_value = function() {
    return new pack_data_value();
};
module.exports.pack_data_point = function() {
    return new pack_data_point();
};
module.exports.pack_head = function() {
    return new pack_head();
};
module.exports.pack_sdel_request = function() {
    return new pack_sdel_request();
};
module.exports.pack_sset_request = function() {
    return new pack_sset_request();
};

module.exports.parse_from_buffer = function() {
    return new parse_from_buffer();
};

module.exports.pack_fsub_request = function() {
    return new pack_fsub_request();
};

module.exports.pack_mset_request = function() {
    return new pack_mset_request();
};

module.exports.pack_sset_response = function() {
    return new pack_sset_response();
};
module.exports.pack_mset_response = function() {
    return new pack_mset_response();
};
module.exports.pack_pub_response = function() {
    return new pack_pub_response();
};









