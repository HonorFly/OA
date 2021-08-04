import axios from '@/config/axios.js';
import instance from 'axios';
import { reject } from 'lodash';
let upload = instance.create();
import {
    Toast
} from 'vant'

// request demo
const userInfo = commonMessage();


export async function _getData(url = '', data = {}, config = {}) {
    if (!data.userid) {
        delete data.userid
    }
    return await axios.post(url, {
        ... {
            userId: userInfo.userid, //刘翠蕾1962 李敏2077 马海平1905 丁哥 1950 董1956 翟 1963
            token: userInfo.token
        },
        ...data
    }, config).then(data => {
        // console.log("zou ::",data)
        if (data.data.code == 0 || data.data.code == 200) {
            if (data.data.code == 200) {
                return data.data
            } else {
                return data.data.result
            }
        }else{
            return data.data
        }
    }).catch(err => {
        // /* if (errorCallBack) {
        //     errorCallBack(err)
        // } else {
        //     console.log(err)
        // } */
        console.log("错误：",err)
        reject(err)
    })
}
export async function uploadImage(url = '', data = {}) {
    return await upload.post(url, data, {
        baseURL: `${process.env.API_HOST.URL}/api/`
    }).then(data => {
        console.log(data)
            // console.log(router)
        if (data.data.code == 0 || data.data.code == 200) {
            // console.log(router)
            if (data.data.code == 200) {
                return data.data
            } else {
                return data.data.result
            }

        }

    }).catch(err => {
        // /* if (errorCallBack) {
        //     errorCallBack(err)
        // } else {
        //     console.log(err)
        // } */
    })
}

export async function _getDataAll(funArr = []) {
    return await axios.all(funArr).then(axios.spread(function(acct, perms) {
        // 两个请求现在都执行完成
        return true
    }));
}
