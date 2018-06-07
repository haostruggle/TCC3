const assert = require('assert');
const log4js = require('log4js');
log4js.configure("./memsqllog.json");
const logInfo = log4js.getLogger('logInfo');


const fmtdict = [];
fmtdict.push({'1':'!B', '2':'!H', '4':'!I', '8':'!Q'});

class Suint_obj{
    constructor(byteslen){
        this._num = 0;
        this._byteslen = byteslen;
        this.datetype = fmtdict[0][this._byteslen.toString()];
    }

    seted(num){
        this._num = num % (Math.pow(2,(this._byteslen * 8)));
    };

    geted(){
        return this._num;
    };

    parse_from_buffer(buff,index){
        if (index === undefined) {
            index = 0;
        }
        if(buff.length - index < this._byteslen){
            logInfo.error('uint_obj parse error, size of buff = ' + buff.length - index + ', require = ' + this._byteslen );
        }
        let tmpnum = 0;
        switch(this.datetype){
            case '!B':
                tmpnum = buff.slice(index,index + this._byteslen).readUInt8(0);
                this._num = tmpnum;
                break;

            case '!H':
                tmpnum = buff.slice(index,index + this._byteslen).readUInt16BE(0);


                this._num = tmpnum;
                break;

            case '!I':
                tmpnum = buff.slice(index,index + this._byteslen).readUInt32BE(0);
                this._num = tmpnum;
                break;

            case '!Q':
                tmpnum = buff.slice(index,index + this._byteslen).readDoubleBE(0);

                this._num = tmpnum;
                break;

            case 1:
                tmpnum = buff.slice(index,index + this._byteslen).readUInt8(0);

                this._num = tmpnum;
                break;

            case 2:
                tmpnum = buff.slice(index,index + this._byteslen).readUInt16BE(0);

                this._num = tmpnum;
                break;

            case 4:
                tmpnum = buff.slice(index,index + this._byteslen).readUInt32BE(0);

                this._num = tmpnum;
                break;

            case 8:
                tmpnum = buff.slice(index,index + this._byteslen).readDoubleBE(0);

                this._num = tmpnum;
                break;

        }
        return index + this._byteslen;
    };

    serialize_to_buffer(){
        let pbuf = Buffer.alloc(8);
        pbuf.fill(0);
        switch(this.datetype) {
            case '!B':
                pbuf.writeInt8(this._num,0);
                return  pbuf.slice(0,1);
                break;
            case '!H':
                pbuf.writeInt16BE(this._num,0);
                return  pbuf.slice(0,2);
                break;
            case '!I':
                pbuf.writeInt32BE(this._num,0);
                return  pbuf.slice(0,4);
                break;
            case '!Q':
                pbuf.writeDoubleBE(this._num,0);
                return  pbuf.slice(0,8);
            case 1:
                pbuf.writeInt8(this._num,0);
                return  pbuf.slice(0,1);
                break;
            case 2:
                pbuf.writeInt16BE(this._num,0);
                return  pbuf.slice(0,2);
                break;
            case 4:
                pbuf.writeInt32BE(this._num,0);
                return  pbuf.slice(0,4);
                break;
            case 8:
                pbuf.writeDoubleBE(this._num,0);
                return  pbuf.slice(0,8);
                break;
        }

    };

    get_binary_len(){
        return this._byteslen;
    };
}


class variable_len_string{
    constructor(lensize){
        this._str = '';
        this._lensize = lensize;
        // const tempsize = [1,2,4];
    }

    seted(pstr){
        this._str = pstr.slice(0, Math.pow(2,(this._lensize *8)));
    };

    geted(){
        return this._str;
    };

    parse_from_buffer(buff,index){
        if (index === undefined) {
            index = 0;
        }
        let tmplen = new Suint_obj(this._lensize);
        index = tmplen.parse_from_buffer(buff,index);

        if (buff.length - index < tmplen.geted()) {
            logInfo.error('variable_len_string parse error, size of buff = ' + buff.length - index + ', require = ' + tmplen.get_binary_len() + ',index = ' +  index);
        }
        this._str = buff.slice(index, index + tmplen.geted());
        return index + tmplen.geted();
    };

    serialize_to_buffer() {
        let tmplen = new Suint_obj(this._lensize);
        tmplen.seted(this._str.length);
        let buf = Buffer.alloc( (tmplen.serialize_to_buffer()).length + (this._str).length);
        (tmplen.serialize_to_buffer()).copy(buf,0,0);
        let tmpstr = Buffer.from(this._str);
        tmpstr.copy(buf,(tmplen.serialize_to_buffer()).length,0);
        return buf;
    };

    get_binary_len(){
        return this._lensize + this._str.length;
    };
}

class fixed_len_string{

    constructor(strlen){
        this._str = '';
        this._strlen = strlen;
    }

    seted(pstr) {
        this._str = Buffer.alloc(this._strlen);
        this._str.fill(0);
        if (this._str.length <= this._strlen) {
            this._str.fill(pstr,0,pstr.length);
            return this._str;
        }
    }

    geted() {
        return this._str;
    };

    parse_from_buffer(buff,index) {
        if (index === undefined) {
            index = 0;
        }
        if (buff.length < this._strlen) {
            logInfo.error('fixed_len_string parse error, size of buff = ' + buff.length + ', require = ' + this._strlen );
        }

        this._str = buff.slice(index, index + this._strlen);
        return this._strlen + index
    };

    serialize_to_buffer() {
        return Buffer.from(this._str);
    };

    get_binary_len() {
        return this._strlen;
    };
}

class binary_obj_list{
    constructor(itemcreator,sizesize){
        this._list = [];
        this.itemcreator = itemcreator;
        this.sizesize = sizesize;
    }

    mutiable_list() {
        return this._list;
    };

    clear() {
        this._list = [];
    };

    parse_from_buffer(buff,index) {
        if (index === undefined) {
            index = 0;
        }
        this._list = [];
        let tmp_list = [];
        let tmpsize = new Suint_obj(this.sizesize);
        index = tmpsize.parse_from_buffer(buff,index);

        for(let i = 0; i < tmpsize.geted(); i++){
            let tmpitem =  new this.itemcreator();
            index = tmpitem.parse_from_buffer(buff,index);
            this._list.push(tmpitem);
        }
        return index;
    };

    serialize_to_buffer() {
        let tmpsize = new Suint_obj(this.sizesize);
        tmpsize.seted(this._list.length);
        let len = tmpsize.serialize_to_buffer().length;

        for(let i = 0; i < this._list.length;i++){
            len = len + (this._list[i].serialize_to_buffer()).length;
        }
        let tmpbuf = Buffer.alloc(len);
        tmpbuf.fill(0);
        tmpsize.serialize_to_buffer().copy(tmpbuf,0,0);
        len = tmpsize.serialize_to_buffer().length;
        for(let i = 0; i < this._list.length;i++){
            this._list[i].serialize_to_buffer().copy(tmpbuf,len,0);
            len = len + (this._list[i].serialize_to_buffer()).length;
        }
        return tmpbuf;
    };

    get_binary_len() {
        let tmplen = this.sizesize;
        for(let i of this._list){
            tmplen = tmplen + i.get_binary_len()
        }
        return tmplen;
    };
}


module.exports.Suint_obj = function(byteslen) {
    return new Suint_obj(byteslen);
};

module.exports.variable_len_string = function(lensize) {
    return new variable_len_string(lensize);
};

module.exports.fixed_len_string = function(strlen) {
    return new fixed_len_string(strlen);
};

module.exports.binary_obj_list = function(itemcreator,sizesize) {
    return new binary_obj_list(itemcreator,sizesize);
};