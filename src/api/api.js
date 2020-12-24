import axios from "axios"


const url="http://5343.94un.com/admin/";

  /* 封装get方法*/
export function get(urlz,params){
    return new Promise((resolve,reject)=>{
        axios.get(urlz, params).then(response => {
            resolve(response.data);
        }).catch(error=>{
            reject(error);
        })
    })
}

/* 封装post方法 */
export function post(urlz, params) {
    // axios.defaults.headers['Set-Cookie'] = 'PHPSESSID=' + this.$cookies.get("PHPSESSID");
    return new Promise((resolve,reject)=>{
        const formData = new FormData();
        Object.keys(params).forEach((key) => {
            formData.append(key, params[key]);
        });
        axios.post(urlz, formData).then(response => {
            // console.log(response);
            try {
                resolve(response.data);
            } catch(err) { 
                resolve(response.data);
             }
        }).catch(error=>{
            reject(error);
        })
    })
}


/* 封装put方法 */
export function put(urlz,params){
    return new Promise((resolve,reject)=>{
        // params['token']=localStorage.getItem('token');
        axios.put(urlz,params).then(response=>{
            resolve(JSON.parse(response.data));
        }).catch(error=>{
            reject(error);
        })
    })
}

/* 封装del方法 */
export function del(urlz,params){
    return new Promise((resolve,reject)=>{
        // params['token']=localStorage.getItem('token');
        axios.delete(urlz,params).then(response=>{
            resolve(JSON.parse(response.data));
        }).catch(error=>{
            reject(error);
        })
    })
}

